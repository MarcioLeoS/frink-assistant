<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Pago requerido</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-neutral-950 text-white min-h-screen flex flex-col items-center justify-center">
    <h1 class="text-3xl font-bold mb-2">Pago requerido</h1>
    <p class="text-neutral-400 mb-6 text-center max-w-md">
        Necesitas completar el pago para acceder a esta sección.<br>
        Por favor, realiza el pago para continuar.
    </p>
    <a href="{{ route('config') }}" class="inline-block px-6 py-2 rounded-md bg-[#4a2d87] text-white font-medium transition">
        Ir a la página de configuración
    </a>
</body>

</html>