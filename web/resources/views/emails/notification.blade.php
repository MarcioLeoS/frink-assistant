<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>{{ $notification->title }}</title>
</head>

<body style="background:#f9fafb; margin:0; padding:0;">
    <section style="max-width:600px; margin:40px auto; padding:32px 24px; background:#fff; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
        <header style="text-align:center;">
            <a href="#">
                <img style="height:32px;" src="/favicon.jpg" alt="">
            </a>
        </header>

        <main style="margin-top:32px;">
            <h2 style="color:#374151; font-size:24px; margin-bottom:16px;">Hola, {{$user->name}},</h2>

            <p style="font-weight:bold; color:#374151;">{{ $notification->title }}</p>

            <p style="margin-top:16px; color:#4b5563;">
                {{ $notification->message }}
            </p>

            <small style="display:block; margin-top:16px; color:#6b7280;">Fecha: {{ date('d/m/Y H:i', strtotime($notification->created_at)) }}</small>
        </main>

        <footer style="margin-top:32px; font-size:13px;">
            <p style="color:#6b7280;">
                This email was sent to <a href="#" style="color:#2563eb; text-decoration:underline;" target="_blank">contact@merakiui.com</a>.
                If you'd rather not receive this kind of email, you can <a href="#" style="color:#2563eb; text-decoration:underline;">unsubscribe</a> or <a href="#" style="color:#2563eb; text-decoration:underline;">manage your email preferences</a>.
            </p>
            <p style="margin-top:12px; color:#6b7280;">© 2025 Meraki UI. All Rights Reserved.</p>
        </footer>
    </section>
</body>

</html>