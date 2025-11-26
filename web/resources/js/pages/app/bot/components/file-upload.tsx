import { useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { BASE_URL } from "@/config/env";

export default function FileUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleRemove = () => {
        setFile(null);
        setProgress(0);
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;
        setUploading(true);
        setProgress(0);

        const formData = new FormData();
        formData.append("file", file);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", BASE_URL + "/enterprise-config/files", true);
        xhr.setRequestHeader(
            "X-CSRF-TOKEN",
            (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ""
        );

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                setProgress(percent);
            }
        };

        xhr.onload = () => {
            setUploading(false);
            setProgress(100);
            if (xhr.status >= 200 && xhr.status < 300) {
                // Opcional: notificación de éxito
                setTimeout(() => {
                    setFile(null);
                    setProgress(0);
                    if (inputRef.current) inputRef.current.value = "";
                }, 500);
            } else {
                alert("Hubo un error al subir el archivo.");
            }
        };

        xhr.onerror = () => {
            setUploading(false);
            alert("Hubo un error al subir el archivo.");
        };

        xhr.send(formData);
    };

    return (
        <div className="mt-6 sm:max-w-lg">
            <form onSubmit={handleUpload}>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    Cargar documentación
                </h3>
                {!file ? (
                    <div
                        className="mt-4 flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-20 dark:border-gray-700 cursor-pointer"
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        <div>
                            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                            </svg>
                            <div className="mt-4 flex text-base leading-6 text-gray-600 dark:text-gray-300">
                                <p>Arrastrar y soltar o</p>
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer pl-1 font-medium text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    <span>elegir de tu computadora</span>
                                    <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        className="sr-only"
                                        accept=".docx,.pdf,.txt,.md"
                                        ref={inputRef}
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="relative mt-8 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                        <div className="absolute right-1 top-1">
                            <button
                                type="button"
                                className="rounded p-2 text-gray-400 hover:text-gray-700 dark:text-gray-500 hover:dark:text-gray-200"
                                aria-label="Remove"
                                onClick={handleRemove}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex items-center space-x-2.5">
                            <span className="flex h-10 w-10 items-center justify-center rounded bg-white shadow ring-1 ring-inset ring-gray-200 dark:bg-gray-900 dark:ring-gray-700">
                                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth={2} />
                                    <path stroke="currentColor" strokeWidth={2} d="M8 8l8 8M16 8l-8 8" />
                                </svg>
                            </span>
                            <div>
                                <p className="font-medium text-gray-800 dark:text-gray-100">
                                    {file.name}
                                </p>
                                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                                    {(file.size / 1024 / 1024).toFixed(1)} MB
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center space-x-3">
                            <Progress value={progress} className="h-2 w-full" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                {progress}%
                            </span>
                        </div>
                    </div>
                )}
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex justify-between">
                    <span>Tipos aceptados: TXT, PDF, DOCX o MD.</span>
                    <span>Tamaño max: 10MB</span>
                </p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex justify-between">
                    Puedes cargar la documentación de tu empresa, como manuales, políticas o guías de uso, para que el asistente pueda responder preguntas relacionadas con ella.
                </p>
                <div className="mt-8 flex items-center justify-end space-x-3">
                    <button
                        type="button"
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-base font-medium text-gray-700 shadow transition-all hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                        onClick={handleRemove}
                        disabled={!file}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-base font-medium text-white shadow transition-all hover:bg-blue-700"
                        disabled={!file || uploading}
                    >
                        Subir
                    </button>
                </div>
            </form>
        </div>
    );
}