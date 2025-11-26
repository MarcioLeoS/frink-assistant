{{-- filepath: resources/views/errors/404.blade.php --}}
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Página no encontrada</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-neutral-950 text-white min-h-screen flex flex-col items-center justify-center">
    <img src="{{ asset('icons/404.svg') }}" alt="404" class="w-64 h-64 mb-8" draggable="false">
    <h1 class="text-3xl font-bold mb-2">404 - Página no encontrada</h1>
    <p class="text-neutral-400 mb-6 text-center max-w-md">
        Lo sentimos, la página que buscas no existe o fue movida.<br>
        Por favor, verifica la URL o vuelve al inicio.
    </p>
    <a href="{{ url('/') }}" class="inline-block px-6 py-2 rounded-md bg-[#4a2d87] text-white font-medium transition">
        Volver al inicio
    </a>
</body>
</html>