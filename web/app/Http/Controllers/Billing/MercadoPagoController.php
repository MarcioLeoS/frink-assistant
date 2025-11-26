<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use App\Models\EnterpriseConfig;
use App\Models\Payment;
use Inertia\Inertia;
use App\Models\PaymentToken;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;

class MercadoPagoController extends Controller
{
    protected $accessToken;

    public function __construct()
    {
        // Obtén el token de acceso desde el archivo .env
        $this->accessToken = config('services.mercadopago.access_token');
    }

    public function createPaymentPreference(): JsonResponse
    {
        // 1) Obtén la única suscripción
        $subscription = Subscription::with('plan')->firstOrFail();
        $plan         = $subscription->plan;

        $randomToken = Str::uuid()->toString();

        // Hashea el token
        $hashedToken = Hash::make($randomToken);

        // Guarda el token en la base de datos
        PaymentToken::create([
            'subscription_id' => $subscription->id,
            'token' => $hashedToken,
        ]);

        // 2) Obtén los datos del cliente desde EnterpriseConfig
        $enterprise = EnterpriseConfig::firstOrFail();
        $payer = [
            'email'   => $enterprise->enterprise_customer_email,
            'name'    => $enterprise->enterprise_customer_name,
            'phone'   => [
                'area_code' => null,
                'number'    => $enterprise->enterprise_customer_phone,
            ],
            'address' => [
                'street_name'   => $enterprise->enterprise_customer_address,
                'street_number' => null,
                'zip_code'      => $enterprise->enterprise_customer_zip,
                'city'          => $enterprise->enterprise_customer_city,
                'state'         => $enterprise->enterprise_customer_state,
                'country'       => $enterprise->enterprise_customer_country,
            ],
        ];

        // 3) Prepara el ítem según el plan
        $items = [[
            'id'          => (string) $plan->id,
            'title'       => $plan->name,
            'description' => "Suscripción al plan {$plan->slug}",
            'quantity'    => 1,
            'unit_price'  => (float) $plan->price,
            'currency_id' => strtoupper($plan->currency),
        ]];

        // 4) URLs de retorno (defínelas en tus rutas web.php)
        $backUrls = [
            'success' => 'https://miclienteapp.loca.lt/billing/success',
            'failure' => 'https://miclienteapp.loca.lt/billing/failure',
            'pending' => 'https://miclienteapp.loca.lt/billing/pending',
        ];

        // 5) Cuerpo de la petición
        $requestBody = [
            'items'              => $items,
            'payer'              => $payer,
            'back_urls'          => $backUrls,
            'external_reference' => $hashedToken,
            'auto_return'        => 'approved',
            'payment_methods'    => [
                'installments'         => $plan->interval_count ?? 1,
                'default_installments' => 1,
                'excluded_payment_methods' => [],
                'excluded_payment_types'   => [],
            ],
            'statement_descriptor' => substr(config('app.name'), 0, 12),
            'expires'              => false,
        ];

        // 6) Llamada a Mercado Pago
        $response = Http::withToken($this->accessToken)
            ->post('https://api.mercadopago.com/checkout/preferences', $requestBody);

        if ($response->successful()) {
            return response()->json([
                'preferenceId' => $response->json()['id'],
                'initPoint'    => $response->json()['init_point'],
            ]);
        }

        // 7) Error
        return response()->json(
            ['error' => $response->json()],
            $response->status()
        );
    }

    public function processPayment(Request $request)
    {
        // 1) Recupera la suscripción activa del usuario
        $subscription = Subscription::with('plan')
            ->where('status', 'active')
            ->firstOrFail();

        $plan = $subscription->plan;

        // 2) Arma el payload según tu modelo de Plan y Subscription
        $payload = [
            'transaction_amount'   => (float) $plan->price,
            'token'                => $request->input('token'),
            'description'          => "Suscripción: {$plan->name}",
            'installments'         => $request->input('installments', 1),
            'payment_method_id'    => $request->input('payment_method_id'),
            'issuer_id'            => $request->input('issuer_id'),
            'payer' => [
                'email' => $request->input('payer.email'),
                'identification' => [
                    'type'   => $request->input('payer.identification.type'),
                    'number' => $request->input('payer.identification.number'),
                ],
            ],
            'additional_info' => [
                'items' => [
                    [
                        'id'          => (string) $plan->id,
                        'title'       => $plan->name,
                        'description' => "Plan {$plan->slug}",
                        'quantity'    => 1,
                        'unit_price'  => (float) $plan->price,
                    ],
                ],
            ],
            'external_reference' => $subscription->provider_sub_id,
        ];

        // 3) Ejecuta la petición HTTP a Mercado Pago
        $response = Http::withHeaders([
            'Content-Type'        => 'application/json',
            'Authorization'       => 'Bearer ' . config('services.mercadopago.access_token'),
            'X-Idempotency-Key'   => Str::uuid()->toString(),
        ])->post('https://api.mercadopago.com/v1/payments', $payload);

        // 4) Opcional: guardar en tu tabla de pagos
        if ($response->successful()) {
            $data = $response->json();

            // Por ejemplo, si tienes un modelo App\Models\Payment:
            // $subscription->payments()->create([
            //     'provider_payment_id' => $data['id'],
            //     'status'              => $data['status'],
            //     'amount'              => $data['transaction_amount'],
            //     'raw'                 => $data,
            // ]);

            return response()->json($data);
        }

        // En caso de error, reenvía el status y el body
        return response()->json(
            ['error' => $response->json()],
            $response->status()
        );
    }

    public function success(Request $request)
    {
        $mpPaymentId  = $request->query('collection_id');
        $mpStatus     = $request->query('status');           // e.g. "approved"
        $rawParams    = $request->all();
        $token        = $request->query('external_reference');
        // Como sólo hay una suscripción:
        $subscription = Subscription::firstOrFail();

        // Verifica el token y su tiempo de creación
        $paymentToken = PaymentToken::where('subscription_id', $subscription->id)
            ->where('token', $token)
            ->where('created_at', '>=', Carbon::now()->subMinutes(30))
            ->first();

        if (!$paymentToken) {
            return response()->json(['error' => 'Invalid or expired payment token'], 403);
        }

        // Borra el token una vez usado
        $paymentToken->delete();

        // Registra el pago
        Payment::create([
            'subscription_id' => $subscription->id,
            'amount_cents'    => intval($subscription->plan->price * 100),
            'currency'        => $subscription->plan->currency,
            'mp_payment_id'   => $mpPaymentId,
            'status'          => $mpStatus,
            'raw'             => $rawParams,
            'billing_email'   => $request->query('payer_email'),
        ]);

        return Inertia::render('billing/success', [
            'mpPaymentId' => $request->query('collection_id'),
            'mpStatus'    => $request->query('status'),
        ]);
    }

    /**
     * Callback de fallo o cancelación
     */
    public function failure(Request $request)
    {
        $mpPaymentId = $request->query('collection_id');
        $mpStatus    = $request->query('status');   // e.g. "failure" o "cancelled"
        $rawParams   = $request->all();
        $token        = $request->query('external_reference');
        // Como sólo hay una suscripción:
        $subscription = Subscription::firstOrFail();

        // Verifica el token y su tiempo de creación
        $paymentToken = PaymentToken::where('subscription_id', $subscription->id)
            ->where('token', $token)
            ->where('created_at', '>=', Carbon::now()->subMinutes(30))
            ->first();

        if (!$paymentToken) {
            return response()->json(['error' => 'Invalid or expired payment token'], 403);
        }

        // Borra el token una vez usado
        $paymentToken->delete();

        Payment::create([
            'subscription_id' => $subscription->id,
            'amount_cents'    => intval($subscription->plan->price * 100),
            'currency'        => $subscription->plan->currency,
            'mp_payment_id'   => $mpPaymentId,
            'status'          => $mpStatus,
            'raw'             => $rawParams,
            'billing_email'   => $request->query('payer_email'),
        ]);

        return Inertia::render('billing/failure', [
            'mpPaymentId' => $request->query('collection_id'),
            'mpStatus'    => $request->query('status'),
            'error'       => $request->query('error'),
        ]);
    }

    /**
     * Callback de pago pendiente
     */
    public function pending(Request $request)
    {
        $mpPaymentId = $request->query('collection_id');
        $mpStatus    = $request->query('status');   // e.g. "pending"
        $rawParams   = $request->all();
        $token        = $request->query('external_reference');
        // Como sólo hay una suscripción:
        $subscription = Subscription::firstOrFail();

        // Verifica el token y su tiempo de creación
        $paymentToken = PaymentToken::where('subscription_id', $subscription->id)
            ->where('token', $token)
            ->where('created_at', '>=', Carbon::now()->subMinutes(30))
            ->first();

        if (!$paymentToken) {
            return response()->json(['error' => 'Invalid or expired payment token'], 403);
        }

        // Borra el token una vez usado
        $paymentToken->delete();

        Payment::create([
            'subscription_id' => $subscription->id,
            'amount_cents'    => intval($subscription->plan->price * 100),
            'currency'        => $subscription->plan->currency,
            'mp_payment_id'   => $mpPaymentId,
            'status'          => $mpStatus,
            'raw'             => $rawParams,
            'billing_email'   => $request->query('payer_email'),
        ]);

        return Inertia::render('billing/pending', [
            'mpPaymentId' => $request->query('collection_id'),
            'mpStatus'    => $request->query('status'),
        ]);
    }
}
