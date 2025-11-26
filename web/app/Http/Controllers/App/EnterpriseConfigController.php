<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Models\EnterpriseConfig;
use App\Services\EnterpriseConfigService;
use Smalot\PdfParser\Parser as PdfParser;
use PhpOffice\PhpWord\IOFactory as WordIOFactory;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpWord\Element\Text;
use PhpOffice\PhpWord\Element\TextRun;
use Illuminate\Support\Facades\Validator;

class EnterpriseConfigController extends Controller
{
    protected $enterpriseConfigService;

    public function __construct(EnterpriseConfigService $enterpriseConfigService)
    {
        $this->enterpriseConfigService = $enterpriseConfigService;
    }

    /**
     * Obtiene la configuración de la empresa
     */
    public function getConfiguration()
    {
        try {
            $configuration = $this->enterpriseConfigService->getConfiguration();
            $stats = $this->enterpriseConfigService->getConfigurationStats();

            return response()->json([
                'success' => true,
                'data' => [
                    'configuration' => $configuration,
                    'stats' => $stats
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener la configuración de la empresa.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualiza la configuración de la empresa
     */
    public function updateConfiguration(Request $request)
    {
        try {
            // Validar los datos de entrada
            $validationRules = $this->enterpriseConfigService->validateConfigurationData($request->all());
            $validator = Validator::make($request->all(), $validationRules);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Datos de validación incorrectos.',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Actualizar la configuración
            $configuration = $this->enterpriseConfigService->updateConfiguration($request->all());
            $stats = $this->enterpriseConfigService->getConfigurationStats();

            return response()->json([
                'success' => true,
                'message' => 'Configuración actualizada correctamente.',
                'data' => [
                    'configuration' => $configuration,
                    'stats' => $stats
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la configuración de la empresa.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function uploadDocumentation(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240|mimes:txt,pdf,docx,md',
        ]);

        $file = $request->file('file');
        $extension = $file->getClientOriginalExtension();
        $text = '';

        if ($extension === 'txt' || $extension === 'md') {
            $text = file_get_contents($file->getRealPath());
        } elseif ($extension === 'pdf') {
            $parser = new PdfParser();
            $pdf = $parser->parseFile($file->getRealPath());
            $text = $pdf->getText();
        } elseif ($extension === 'docx') {
            $phpWord = WordIOFactory::load($file->getRealPath());
            foreach ($phpWord->getSections() as $section) {
                foreach ($section->getElements() as $element) {
                    if ($element instanceof Text) {
                        $text .= $element->getText() . "\n";
                    } elseif ($element instanceof TextRun) {
                        foreach ($element->getElements() as $subElement) {
                            if ($subElement instanceof Text) {
                                $text .= $subElement->getText();
                            }
                        }
                        $text .= "\n";
                    }
                }
            }
        }

        // Limita el texto si es necesario (opcional)
        $text = mb_substr($text, 0, 65535);

        // Busca el primer registro o crea uno nuevo si no existe
        $enterprise = EnterpriseConfig::first();
        if (!$enterprise) {
            $enterprise = new EnterpriseConfig();
        }
        $enterprise->enterprise_documentation_text = $text;
        $enterprise->save();

        return response()->json([
            'success' => true,
            'message' => 'Documentación cargada y procesada correctamente.',
        ]);
    }
}
