import { useEffect, useState } from 'react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AlignLeft, EllipsisVertical, Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Integraciones',
        href: '/integrations',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Integraciones" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 lg:py-4 2xl:max-w-6xl w-full mx-auto">
                <h2 className="text-white text-xl font-bold mb-4">Integraciones</h2>

                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div
                        className="w-full cursor-default rounded-lg border p-6 text-left shadow-sm bg-white dark:bg-zinc-800 border-gray-200 dark:border-neutral-800 relative flex flex-col justify-between "
                        data-tremor-id="tremor-raw"
                        style={{ cursor: 'default' }}
                    >
                        <div className="flex items-center space-x-3">
                            <span className="flex size-12 shrink-0 items-center justify-center rounded-md border border-gray-200 p-1 dark:border-neutral-700">
                                <svg
                                    viewBox="0 0 1024 1024"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-8"
                                    aria-hidden="true"
                                >
                                    <circle fill="#0082C9" cx="512" cy="512" r="512" />
                                    <g>
                                        <title>Nextcloud icon</title>
                                        <path
                                            fill="#FFFFFF"
                                            d="M512.5,370.9c-64.6,0-118.8,44.2-135.4,103.7c-14.5-31.8-46.3-54.4-83.3-54.4c-50.6,0.2-91.5,41.2-91.8,91.8
                                                c0.2,50.6,41.2,91.5,91.8,91.8c37,0,68.8-22.6,83.3-54.4c16.6,59.5,70.8,103.7,135.4,103.7c64.2,0,118.2-43.7,135.1-102.7
                                                c14.7,31.3,46.1,53.4,82.6,53.4c50.6-0.2,91.6-41.2,91.8-91.8c-0.2-50.6-41.2-91.6-91.8-91.8c-36.6,0-67.9,22.2-82.6,53.4
                                                C630.7,414.6,576.7,370.8,512.5,370.9z M512.5,424.7c48.5,0,87.3,38.8,87.3,87.3s-38.8,87.3-87.3,87.3c-48,0.2-87-38.5-87.2-86.5
                                                c0-0.3,0-0.5,0-0.8C425.2,463.5,464,424.7,512.5,424.7z M293.8,474.1c21.2,0,37.9,16.7,37.9,37.9c0,21.3-16.6,37.9-37.9,37.9
                                                c-20.7,0.2-37.7-16.4-37.9-37.1c0-0.3,0-0.5,0-0.8C255.9,490.7,272.5,474.1,293.8,474.1L293.8,474.1z M730.2,474.1
                                                c21.3,0,37.9,16.7,37.9,37.9c0,21.3-16.7,37.9-37.9,37.9c-20.7,0.2-37.7-16.4-37.9-37.1c0-0.3,0-0.5,0-0.8
                                                C692.3,490.7,709,474.1,730.2,474.1L730.2,474.1z"
                                        />
                                    </g>
                                </svg>
                            </span>
                            <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">
                                <a href="#" className="focus:outline-none">
                                    <span className="absolute inset-0" aria-hidden="true"></span>
                                    Nextcloud
                                </a>
                            </dt>
                        </div>
                        <div className="mt-4 flex flex-1 flex-col">
                            <div className="flex-1">
                                <dd className="text-sm/6 text-gray-600 dark:text-gray-400">
                                    Automatiza la exportación de tus datos hacia un sitio de archivos seguro y autoadministrado
                                </dd>
                            </div>
                            <div className="mt-6 flex items-center space-x-2">
                                <svg
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    className="remixicon size-5 text-gray-400 dark:text-gray-600"
                                >
                                    <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20ZM13 12H16L12 16L8 12H11V8H13V12Z" />
                                </svg>

                            </div>
                        </div>
                    </div>
                    {/* Google Drive */}
                    <div
                        className="w-full cursor-default rounded-lg border p-6 text-left shadow-sm bg-white dark:bg-zinc-800 border-gray-200 dark:border-neutral-800 relative flex flex-col justify-between "
                        data-tremor-id="tremor-raw"
                        style={{ cursor: 'default' }}
                    >
                        <div className="flex items-center space-x-3">
                            <span className="flex size-12 shrink-0 items-center justify-center rounded-md border border-gray-200 p-1 dark:border-neutral-700">
                                <svg
                                    fill="none"
                                    viewBox="0 0 88 78"
                                    className="size-5"
                                    aria-hidden="true"
                                >
                                    <g clipPath="url(#clip0_6661_2945)">
                                        <path
                                            fill="#0066DA"
                                            d="M6.6 66.85L10.45 73.5C11.25 74.9 12.4 76 13.75 76.8L27.5 53H0C0 54.55 0.4 56.1 1.2 57.5L6.6 66.85Z"
                                        />
                                        <path
                                            fill="#00AC47"
                                            d="M43.65 25.0002L29.9 1.2002C28.55 2.0002 27.4 3.1002 26.6 4.5002L1.2 48.5002C0.414713 49.87 0.00104556 51.4213 0 53.0002H27.5L43.65 25.0002Z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M73.55 76.8C74.9 76 76.05 74.9 76.85 73.5L78.45 70.75L86.1 57.5C86.9 56.1 87.3 54.55 87.3 53H59.798L65.65 64.5L73.55 76.8Z"
                                        />
                                        <path
                                            fill="#00832D"
                                            d="M43.65 25L57.4 1.2C56.05 0.4 54.5 0 52.9 0H34.4C32.8 0 31.25 0.45 29.9 1.2L43.65 25Z"
                                        />
                                        <path
                                            fill="#2684FC"
                                            d="M59.8 53H27.5L13.75 76.8C15.1 77.6 16.65 78 18.25 78H69.05C70.65 78 72.2 77.55 73.55 76.8L59.8 53Z"
                                        />
                                        <path
                                            fill="#FFBA00"
                                            d="M73.4 26.5002L60.7 4.5002C59.9 3.1002 58.75 2.0002 57.4 1.2002L43.65 25.0002L59.8 53.0002H87.25C87.25 51.4502 86.85 49.9002 86.05 48.5002L73.4 26.5002Z"
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_6661_2945">
                                            <rect width="87.3" height="78" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </span>
                            <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">
                                <a href="#" className="focus:outline-none">
                                    <span className="absolute inset-0" aria-hidden="true"></span>
                                    Google Drive
                                </a>
                            </dt>
                        </div>
                        <div className="mt-4 flex flex-1 flex-col">
                            <div className="flex-1">
                                <dd className="text-sm/6 text-gray-600 dark:text-gray-400">
                                    Automatiza la exportación de tus datos hacia la nube de Google
                                </dd>
                            </div>
                            <div className="mt-6 flex items-center space-x-2">
                                <svg
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    className="remixicon size-5 text-gray-400 dark:text-gray-600"
                                >
                                    <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20ZM13 12H16L12 16L8 12H11V8H13V12Z" />
                                </svg>

                            </div>
                        </div>
                    </div>
                    {/* Facebook Ads */}
                    <div
                        className="w-full cursor-default  rounded-lg border p-6 text-left shadow-sm bg-white dark:bg-transparent border-gray-200 dark:border-neutral-700 relative flex flex-col justify-between "
                        data-tremor-id="tremor-raw"
                    >
                        <div className="flex items-center space-x-3">
                            <span className="flex size-12 shrink-0 items-center justify-center rounded-md border border-gray-200 p-1 dark:border-neutral-700">
                                <svg
                                    fill="none"
                                    viewBox="0 0 500 500"
                                    className="size-5"
                                    aria-hidden="true"
                                >
                                    <path
                                        fill="#0866FF"
                                        d="M500 250C500 111.93 388.07 0 250 0C111.93 0 0 111.93 0 250C0 367.24 80.72 465.62 189.61 492.64V326.4H138.06V250H189.61V217.08C189.61 131.99 228.12 92.55 311.66 92.55C327.5 92.55 354.83 95.66 366.01 98.76V168.01C360.11 167.39 349.86 167.08 337.13 167.08C296.14 167.08 280.3 182.61 280.3 222.98V250H361.96L347.93 326.4H280.3V498.17C404.07 483.22 500 377.82 500 250Z"
                                    />
                                </svg>
                            </span>
                            <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">
                                <div className="focus:outline-none">
                                    <span className="absolute inset-0" aria-hidden="true"></span>
                                    Facebook Ads
                                </div>
                            </dt>
                        </div>
                        <div className="mt-4 flex flex-1 flex-col">
                            <div className="flex-1">
                                <dd className="text-sm/6 text-gray-600 dark:text-gray-400">
                                    Próximamente                                </dd>
                            </div>
                            <div className="mt-6 flex items-center space-x-2">
                                <svg
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    className="remixicon size-5 text-gray-400 dark:text-gray-600"
                                >
                                    <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20ZM13 12H16L12 16L8 12H11V8H13V12Z" />
                                </svg>

                            </div>
                        </div>
                    </div>
                    {/* Notion */}
                    <div
                        className="w-full rounded-lg border p-6 text-left shadow-sm bg-white dark:bg-zinc-800 border-gray-200 dark:border-neutral-800 relative flex flex-col justify-between "
                        data-tremor-id="tremor-raw"
                    >
                        <div className="flex items-center space-x-3">
                            <span className="flex size-12 shrink-0 items-center justify-center rounded-md border border-gray-200 p-1 dark:border-neutral-700">
                                <svg
                                    fill="none"
                                    viewBox="0 0 100 100"
                                    className="size-5"
                                    aria-hidden="true"
                                >
                                    <g clipPath="url(#clip0_6661_2956)">
                                        <path
                                            fill="white"
                                            d="M6.017 4.31322L61.35 0.226216C68.147 -0.356784 69.893 0.036216 74.167 3.14322L91.83 15.5862C94.743 17.7262 95.713 18.3092 95.713 20.6392V88.8822C95.713 93.1592 94.16 95.6892 88.723 96.0752L24.467 99.9672C20.387 100.16 18.444 99.5772 16.307 96.8542L3.3 79.9402C0.967 76.8272 0 74.4972 0 71.7732V11.1132C0 7.61622 1.553 4.70022 6.017 4.31322Z"
                                        />
                                        <path
                                            fill="black"
                                            fillRule="evenodd"
                                            d="M61.35 0.227216L6.017 4.31422C1.553 4.70022 0 7.61722 0 11.1132V71.7732C0 74.4962 0.967 76.8262 3.3 79.9402L16.307 96.8532C18.444 99.5762 20.387 100.16 24.467 99.9662L88.724 96.0762C94.157 95.6892 95.714 93.1592 95.714 88.8832V20.6402C95.714 18.4302 94.841 17.7932 92.271 15.9072L74.167 3.14322C69.894 0.036216 68.147 -0.356784 61.35 0.226216V0.227216ZM25.92 19.5232C20.673 19.8762 19.483 19.9562 16.503 17.5332L8.927 11.5072C8.157 10.7272 8.544 9.75422 10.484 9.56022L63.677 5.67322C68.144 5.28322 70.47 6.84022 72.217 8.20022L81.34 14.8102C81.73 15.0072 82.7 16.1702 81.533 16.1702L26.6 19.4772L25.92 19.5232ZM19.803 88.3002V30.3672C19.803 27.8372 20.58 26.6702 22.906 26.4742L86 22.7802C88.14 22.5872 89.107 23.9472 89.107 26.4732V84.0202C89.107 86.5502 88.717 88.6902 85.224 88.8832L24.847 92.3832C21.354 92.5762 19.804 91.4132 19.804 88.3002H19.803ZM79.403 33.4732C79.79 35.2232 79.403 36.9732 77.653 37.1732L74.743 37.7502V80.5232C72.216 81.8832 69.89 82.6602 67.946 82.6602C64.839 82.6602 64.063 81.6872 61.736 78.7732L42.706 48.8332V77.8002L48.726 79.1632C48.726 79.1632 48.726 82.6632 43.869 82.6632L30.479 83.4402C30.089 82.6602 30.479 80.7172 31.836 80.3302L35.333 79.3602V41.0602L30.48 40.6672C30.09 38.9172 31.06 36.3902 33.78 36.1942L48.147 35.2272L67.947 65.5542V38.7242L62.9 38.1442C62.51 36.0012 64.063 34.4442 66.003 34.2542L79.403 33.4732Z"
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_6661_2956">
                                            <rect width="100" height="100" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </span>
                            <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">
                                <a href="#" className="focus:outline-none">
                                    <span className="absolute inset-0" aria-hidden="true"></span>
                                    Notion
                                </a>
                            </dt>
                        </div>
                        <div className="mt-4 flex flex-1 flex-col">
                            <div className="flex-1">
                                <dd className="text-sm/6 text-gray-600 dark:text-gray-400">
                                    Próximamente                                </dd>
                            </div>
                            <div className="mt-6 flex items-center space-x-2">
                                <svg
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    className="remixicon size-5 text-gray-400 dark:text-gray-600"
                                >
                                    <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20ZM13 12H16L12 16L8 12H11V8H13V12Z" />
                                </svg>

                            </div>
                        </div>
                    </div>
                    {/* Slack */}
                    <div
                        className="w-full rounded-lg border p-6 text-left shadow-sm bg-white dark:bg-zinc-800 border-gray-200 dark:border-neutral-800 relative flex flex-col justify-between "
                        data-tremor-id="tremor-raw"
                    >
                        <div className="flex items-center space-x-3">
                            <span className="flex size-12 shrink-0 items-center justify-center rounded-md border border-gray-200 p-1 dark:border-neutral-700">
                                <svg
                                    fill="none"
                                    viewBox="0 0 123 123"
                                    className="size-5"
                                    aria-hidden="true"
                                >
                                    <path
                                        fill="#E01E5A"
                                        d="M25.8 77.6002C25.8 84.7002 20 90.5002 12.9 90.5002C5.8 90.5002 0 84.7002 0 77.6002C0 70.5002 5.8 64.7002 12.9 64.7002H25.8V77.6002Z"
                                    />
                                    <path
                                        fill="#E01E5A"
                                        d="M32.3 77.6002C32.3 70.5002 38.1 64.7002 45.2 64.7002C52.3 64.7002 58.1 70.5002 58.1 77.6002V109.9C58.1 117 52.3 122.8 45.2 122.8C38.1 122.8 32.3 117 32.3 109.9V77.6002Z"
                                    />
                                    <path
                                        fill="#36C5F0"
                                        d="M45.2 25.8C38.1 25.8 32.3 20 32.3 12.9C32.3 5.8 38.1 0 45.2 0C52.3 0 58.1 5.8 58.1 12.9V25.8H45.2Z"
                                    />
                                    <path
                                        fill="#36C5F0"
                                        d="M45.2 32.2998C52.3 32.2998 58.1 38.0998 58.1 45.1998C58.1 52.2998 52.3 58.0998 45.2 58.0998H12.9C5.8 58.0998 0 52.2998 0 45.1998C0 38.0998 5.8 32.2998 12.9 32.2998H45.2Z"
                                    />
                                    <path
                                        fill="#2EB67D"
                                        d="M97 45.1998C97 38.0998 102.8 32.2998 109.9 32.2998C117 32.2998 122.8 38.0998 122.8 45.1998C122.8 52.2998 117 58.0998 109.9 58.0998H97V45.1998Z"
                                    />
                                    <path
                                        fill="#2EB67D"
                                        d="M90.5 45.2C90.5 52.3 84.7 58.1 77.6 58.1C70.5 58.1 64.7 52.3 64.7 45.2V12.9C64.7 5.8 70.5 0 77.6 0C84.7 0 90.5 5.8 90.5 12.9V45.2Z"
                                    />
                                    <path
                                        fill="#ECB22E"
                                        d="M77.6 97C84.7 97 90.5 102.8 90.5 109.9C90.5 117 84.7 122.8 77.6 122.8C70.5 122.8 64.7 117 64.7 109.9V97H77.6Z"
                                    />
                                    <path
                                        fill="#ECB22E"
                                        d="M77.6 90.5002C70.5 90.5002 64.7 84.7002 64.7 77.6002C64.7 70.5002 70.5 64.7002 77.6 64.7002H109.9C117 64.7002 122.8 70.5002 122.8 77.6002C122.8 84.7002 117 90.5002 109.9 90.5002H77.6Z"
                                    />
                                </svg>
                            </span>
                            <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">
                                <a href="#" className="focus:outline-none">
                                    <span className="absolute inset-0" aria-hidden="true"></span>
                                    Slack
                                </a>
                            </dt>
                        </div>
                        <div className="mt-4 flex flex-1 flex-col">
                            <div className="flex-1">
                                <dd className="text-sm/6 text-gray-600 dark:text-gray-400">
                                    Envía las alertas y tareas a tu equipo automáticamente
                                </dd>
                            </div>
                            <div className="mt-6 flex items-center space-x-2">
                                <svg
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    className="remixicon size-5 text-gray-400 dark:text-gray-600"
                                >
                                    <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20ZM13 12H16L12 16L8 12H11V8H13V12Z" />
                                </svg>

                            </div>
                        </div>
                    </div>
                    {/* Dropbox */}
                    <div
                        className="w-full cursor-default  rounded-lg border p-6 text-left shadow-sm bg-white dark:bg-transparent border-gray-200 dark:border-neutral-700 relative flex flex-col justify-between "

                    >
                        <div className="flex items-center space-x-3">
                            <span className="flex size-12 shrink-0 items-center justify-center rounded-md border border-gray-200 p-1 dark:border-neutral-700">
                                <svg
                                    fill="none"
                                    viewBox="0 0 165 140"
                                    className="size-5"
                                    aria-hidden="true"
                                >
                                    <g clipPath="url(#clip0_6661_2986)">
                                        <path
                                            fill="#0061FF"
                                            d="M82.2562 26.2152L41.1334 52.4303L82.2562 78.6455L41.1334 104.861L0 78.4976L41.1334 52.2825L0 26.2152L41.1334 0L82.2562 26.2152ZM40.9117 113.286L82.0451 87.0706L123.168 113.286L82.0451 139.501L40.9117 113.286ZM82.2457 78.4976L123.379 52.2825L82.2457 26.2152L123.168 0L164.301 26.2152L123.168 52.4303L164.301 78.6455L123.168 104.861L82.2457 78.4976Z"
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_6661_2986">
                                            <rect width="164.386" height="139.575" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </span>
                            <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">
                                <div className="focus:outline-none">
                                    <span className="absolute inset-0" aria-hidden="true"></span>
                                    Dropbox
                                </div>
                            </dt>
                        </div>
                        <div className="mt-4 flex flex-1 flex-col">
                            <div className="flex-1">
                                <dd className="text-sm/6 text-gray-600 dark:text-gray-400">
                                    Próximamente
                                </dd>
                            </div>
                            <div className="mt-6 flex items-center space-x-2">
                                <svg
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    className="remixicon size-5 text-gray-400 dark:text-gray-600"
                                >
                                    <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20ZM13 12H16L12 16L8 12H11V8H13V12Z" />
                                </svg>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 lg:py-4 2xl:max-w-6xl w-full mx-auto">
                <h2 className="text-white text-xl font-bold mb-4">Nuestro ecosistema</h2>

                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div
                        className="w-full cursor-default rounded-lg border p-6 text-left shadow-sm bg-white dark:bg-zinc-800 border-gray-200 dark:border-neutral-800 relative flex flex-col justify-between "
                        data-tremor-id="tremor-raw"
                        style={{ cursor: 'default' }}
                    >
                        <div className="flex items-center space-x-3">
                            <span className="flex size-12 shrink-0 items-center justify-center rounded-md border border-gray-200 p-1 dark:border-neutral-700">
                                <svg
                                    viewBox="0 0 1024 1024"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-8"
                                    aria-hidden="true"
                                >
                                    <circle fill="#0082C9" cx="512" cy="512" r="512" />
                                    <g>
                                        <title>Nextcloud icon</title>
                                        <path
                                            fill="#FFFFFF"
                                            d="M512.5,370.9c-64.6,0-118.8,44.2-135.4,103.7c-14.5-31.8-46.3-54.4-83.3-54.4c-50.6,0.2-91.5,41.2-91.8,91.8
                                                c0.2,50.6,41.2,91.5,91.8,91.8c37,0,68.8-22.6,83.3-54.4c16.6,59.5,70.8,103.7,135.4,103.7c64.2,0,118.2-43.7,135.1-102.7
                                                c14.7,31.3,46.1,53.4,82.6,53.4c50.6-0.2,91.6-41.2,91.8-91.8c-0.2-50.6-41.2-91.6-91.8-91.8c-36.6,0-67.9,22.2-82.6,53.4
                                                C630.7,414.6,576.7,370.8,512.5,370.9z M512.5,424.7c48.5,0,87.3,38.8,87.3,87.3s-38.8,87.3-87.3,87.3c-48,0.2-87-38.5-87.2-86.5
                                                c0-0.3,0-0.5,0-0.8C425.2,463.5,464,424.7,512.5,424.7z M293.8,474.1c21.2,0,37.9,16.7,37.9,37.9c0,21.3-16.6,37.9-37.9,37.9
                                                c-20.7,0.2-37.7-16.4-37.9-37.1c0-0.3,0-0.5,0-0.8C255.9,490.7,272.5,474.1,293.8,474.1L293.8,474.1z M730.2,474.1
                                                c21.3,0,37.9,16.7,37.9,37.9c0,21.3-16.7,37.9-37.9,37.9c-20.7,0.2-37.7-16.4-37.9-37.1c0-0.3,0-0.5,0-0.8
                                                C692.3,490.7,709,474.1,730.2,474.1L730.2,474.1z"
                                        />
                                    </g>
                                </svg>
                            </span>
                            <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">
                                <a href="#" className="focus:outline-none">
                                    <span className="absolute inset-0" aria-hidden="true"></span>
                                    Gobox
                                </a>
                            </dt>
                        </div>
                        <div className="mt-4 flex flex-1 flex-col">
                            <div className="flex-1">
                                <dd className="text-sm/6 text-gray-600 dark:text-gray-400">
                                    Gestiona tus rutas, envíos y depositos de forma fácil y rápida
                                </dd>
                            </div>
                            <div className="mt-6 flex items-center space-x-2">
                                <svg
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    className="remixicon size-5 text-gray-400 dark:text-gray-600"
                                >
                                    <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20ZM13 12H16L12 16L8 12H11V8H13V12Z" />
                                </svg>

                            </div>
                        </div>
                    </div>
                    {/* Google Drive */}
                    <div
                        className="w-full cursor-default rounded-lg border p-6 text-left shadow-sm bg-white dark:bg-zinc-800 border-gray-200 dark:border-neutral-800 relative flex flex-col justify-between "
                        data-tremor-id="tremor-raw"
                        style={{ cursor: 'default' }}
                    >
                        <div className="flex items-center space-x-3">
                            <span className="flex size-12 shrink-0 items-center justify-center rounded-md border border-gray-200 p-1 dark:border-neutral-700">
                                <svg
                                    fill="none"
                                    viewBox="0 0 88 78"
                                    className="size-5"
                                    aria-hidden="true"
                                >
                                    <g clipPath="url(#clip0_6661_2945)">
                                        <path
                                            fill="#0066DA"
                                            d="M6.6 66.85L10.45 73.5C11.25 74.9 12.4 76 13.75 76.8L27.5 53H0C0 54.55 0.4 56.1 1.2 57.5L6.6 66.85Z"
                                        />
                                        <path
                                            fill="#00AC47"
                                            d="M43.65 25.0002L29.9 1.2002C28.55 2.0002 27.4 3.1002 26.6 4.5002L1.2 48.5002C0.414713 49.87 0.00104556 51.4213 0 53.0002H27.5L43.65 25.0002Z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M73.55 76.8C74.9 76 76.05 74.9 76.85 73.5L78.45 70.75L86.1 57.5C86.9 56.1 87.3 54.55 87.3 53H59.798L65.65 64.5L73.55 76.8Z"
                                        />
                                        <path
                                            fill="#00832D"
                                            d="M43.65 25L57.4 1.2C56.05 0.4 54.5 0 52.9 0H34.4C32.8 0 31.25 0.45 29.9 1.2L43.65 25Z"
                                        />
                                        <path
                                            fill="#2684FC"
                                            d="M59.8 53H27.5L13.75 76.8C15.1 77.6 16.65 78 18.25 78H69.05C70.65 78 72.2 77.55 73.55 76.8L59.8 53Z"
                                        />
                                        <path
                                            fill="#FFBA00"
                                            d="M73.4 26.5002L60.7 4.5002C59.9 3.1002 58.75 2.0002 57.4 1.2002L43.65 25.0002L59.8 53.0002H87.25C87.25 51.4502 86.85 49.9002 86.05 48.5002L73.4 26.5002Z"
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_6661_2945">
                                            <rect width="87.3" height="78" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </span>
                            <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">
                                <a href="#" className="focus:outline-none">
                                    <span className="absolute inset-0" aria-hidden="true"></span>
                                    Frink erp
                                </a>
                            </dt>
                        </div>
                        <div className="mt-4 flex flex-1 flex-col">
                            <div className="flex-1">
                                <dd className="text-sm/6 text-gray-600 dark:text-gray-400">
                                    Dirige y gestiona tu negocio
                                </dd>
                            </div>
                            <div className="mt-6 flex items-center space-x-2">
                                <svg
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    className="remixicon size-5 text-gray-400 dark:text-gray-600"
                                >
                                    <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20ZM13 12H16L12 16L8 12H11V8H13V12Z" />
                                </svg>

                            </div>
                        </div>
                    </div>
                    {/* Facebook Ads */}
                    <div
                        className="w-full cursor-default  rounded-lg border p-6 text-left shadow-sm bg-white dark:bg-transparent border-gray-200 dark:border-neutral-700 relative flex flex-col justify-between "
                        data-tremor-id="tremor-raw"
                    >
                        <div className="flex items-center space-x-3">
                            <span className="flex size-12 shrink-0 items-center justify-center rounded-md border border-gray-200 p-1 dark:border-neutral-700">
                                <svg
                                    fill="none"
                                    viewBox="0 0 500 500"
                                    className="size-5"
                                    aria-hidden="true"
                                >
                                    <path
                                        fill="#0866FF"
                                        d="M500 250C500 111.93 388.07 0 250 0C111.93 0 0 111.93 0 250C0 367.24 80.72 465.62 189.61 492.64V326.4H138.06V250H189.61V217.08C189.61 131.99 228.12 92.55 311.66 92.55C327.5 92.55 354.83 95.66 366.01 98.76V168.01C360.11 167.39 349.86 167.08 337.13 167.08C296.14 167.08 280.3 182.61 280.3 222.98V250H361.96L347.93 326.4H280.3V498.17C404.07 483.22 500 377.82 500 250Z"
                                    />
                                </svg>
                            </span>
                            <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">
                                <div className="focus:outline-none">
                                    <span className="absolute inset-0" aria-hidden="true"></span>
                                    Administra tus archivos
                                </div>
                            </dt>
                        </div>
                        <div className="mt-4 flex flex-1 flex-col">
                            <div className="flex-1">
                                <dd className="text-sm/6 text-gray-600 dark:text-gray-400">
                                    Próximamente                                </dd>
                            </div>
                            <div className="mt-6 flex items-center space-x-2">
                                <svg
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    className="remixicon size-5 text-gray-400 dark:text-gray-600"
                                >
                                    <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20ZM13 12H16L12 16L8 12H11V8H13V12Z" />
                                </svg>

                            </div>
                        </div>
                    </div>
                    {/* Notion */}
                    <div
                        className="w-full rounded-lg border p-6 text-left shadow-sm bg-white dark:bg-zinc-800 border-gray-200 dark:border-neutral-800 relative flex flex-col justify-between "
                        data-tremor-id="tremor-raw"
                    >
                        <div className="flex items-center space-x-3">
                            <span className="flex size-12 shrink-0 items-center justify-center rounded-md border border-gray-200 p-1 dark:border-neutral-700">
                                <svg
                                    fill="none"
                                    viewBox="0 0 100 100"
                                    className="size-5"
                                    aria-hidden="true"
                                >
                                    <g clipPath="url(#clip0_6661_2956)">
                                        <path
                                            fill="white"
                                            d="M6.017 4.31322L61.35 0.226216C68.147 -0.356784 69.893 0.036216 74.167 3.14322L91.83 15.5862C94.743 17.7262 95.713 18.3092 95.713 20.6392V88.8822C95.713 93.1592 94.16 95.6892 88.723 96.0752L24.467 99.9672C20.387 100.16 18.444 99.5772 16.307 96.8542L3.3 79.9402C0.967 76.8272 0 74.4972 0 71.7732V11.1132C0 7.61622 1.553 4.70022 6.017 4.31322Z"
                                        />
                                        <path
                                            fill="black"
                                            fillRule="evenodd"
                                            d="M61.35 0.227216L6.017 4.31422C1.553 4.70022 0 7.61722 0 11.1132V71.7732C0 74.4962 0.967 76.8262 3.3 79.9402L16.307 96.8532C18.444 99.5762 20.387 100.16 24.467 99.9662L88.724 96.0762C94.157 95.6892 95.714 93.1592 95.714 88.8832V20.6402C95.714 18.4302 94.841 17.7932 92.271 15.9072L74.167 3.14322C69.894 0.036216 68.147 -0.356784 61.35 0.226216V0.227216ZM25.92 19.5232C20.673 19.8762 19.483 19.9562 16.503 17.5332L8.927 11.5072C8.157 10.7272 8.544 9.75422 10.484 9.56022L63.677 5.67322C68.144 5.28322 70.47 6.84022 72.217 8.20022L81.34 14.8102C81.73 15.0072 82.7 16.1702 81.533 16.1702L26.6 19.4772L25.92 19.5232ZM19.803 88.3002V30.3672C19.803 27.8372 20.58 26.6702 22.906 26.4742L86 22.7802C88.14 22.5872 89.107 23.9472 89.107 26.4732V84.0202C89.107 86.5502 88.717 88.6902 85.224 88.8832L24.847 92.3832C21.354 92.5762 19.804 91.4132 19.804 88.3002H19.803ZM79.403 33.4732C79.79 35.2232 79.403 36.9732 77.653 37.1732L74.743 37.7502V80.5232C72.216 81.8832 69.89 82.6602 67.946 82.6602C64.839 82.6602 64.063 81.6872 61.736 78.7732L42.706 48.8332V77.8002L48.726 79.1632C48.726 79.1632 48.726 82.6632 43.869 82.6632L30.479 83.4402C30.089 82.6602 30.479 80.7172 31.836 80.3302L35.333 79.3602V41.0602L30.48 40.6672C30.09 38.9172 31.06 36.3902 33.78 36.1942L48.147 35.2272L67.947 65.5542V38.7242L62.9 38.1442C62.51 36.0012 64.063 34.4442 66.003 34.2542L79.403 33.4732Z"
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_6661_2956">
                                            <rect width="100" height="100" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </span>
                            <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">
                                <a href="#" className="focus:outline-none">
                                    <span className="absolute inset-0" aria-hidden="true"></span>
                                    Dirige tu campaña publicitaria
                                </a>
                            </dt>
                        </div>
                        <div className="mt-4 flex flex-1 flex-col">
                            <div className="flex-1">
                                <dd className="text-sm/6 text-gray-600 dark:text-gray-400">
                                    Próximamente                                </dd>
                            </div>
                            <div className="mt-6 flex items-center space-x-2">
                                <svg
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    className="remixicon size-5 text-gray-400 dark:text-gray-600"
                                >
                                    <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20ZM13 12H16L12 16L8 12H11V8H13V12Z" />
                                </svg>

                            </div>
                        </div>
                    </div>
                    {/* Slack */}
                    <div
                        className="w-full rounded-lg border p-6 text-left shadow-sm bg-white dark:bg-zinc-800 border-gray-200 dark:border-neutral-800 relative flex flex-col justify-between "
                        data-tremor-id="tremor-raw"
                    >
                        <div className="flex items-center space-x-3">
                            <span className="flex size-12 shrink-0 items-center justify-center rounded-md border border-gray-200 p-1 dark:border-neutral-700">
                                <svg
                                    fill="none"
                                    viewBox="0 0 123 123"
                                    className="size-5"
                                    aria-hidden="true"
                                >
                                    <path
                                        fill="#E01E5A"
                                        d="M25.8 77.6002C25.8 84.7002 20 90.5002 12.9 90.5002C5.8 90.5002 0 84.7002 0 77.6002C0 70.5002 5.8 64.7002 12.9 64.7002H25.8V77.6002Z"
                                    />
                                    <path
                                        fill="#E01E5A"
                                        d="M32.3 77.6002C32.3 70.5002 38.1 64.7002 45.2 64.7002C52.3 64.7002 58.1 70.5002 58.1 77.6002V109.9C58.1 117 52.3 122.8 45.2 122.8C38.1 122.8 32.3 117 32.3 109.9V77.6002Z"
                                    />
                                    <path
                                        fill="#36C5F0"
                                        d="M45.2 25.8C38.1 25.8 32.3 20 32.3 12.9C32.3 5.8 38.1 0 45.2 0C52.3 0 58.1 5.8 58.1 12.9V25.8H45.2Z"
                                    />
                                    <path
                                        fill="#36C5F0"
                                        d="M45.2 32.2998C52.3 32.2998 58.1 38.0998 58.1 45.1998C58.1 52.2998 52.3 58.0998 45.2 58.0998H12.9C5.8 58.0998 0 52.2998 0 45.1998C0 38.0998 5.8 32.2998 12.9 32.2998H45.2Z"
                                    />
                                    <path
                                        fill="#2EB67D"
                                        d="M97 45.1998C97 38.0998 102.8 32.2998 109.9 32.2998C117 32.2998 122.8 38.0998 122.8 45.1998C122.8 52.2998 117 58.0998 109.9 58.0998H97V45.1998Z"
                                    />
                                    <path
                                        fill="#2EB67D"
                                        d="M90.5 45.2C90.5 52.3 84.7 58.1 77.6 58.1C70.5 58.1 64.7 52.3 64.7 45.2V12.9C64.7 5.8 70.5 0 77.6 0C84.7 0 90.5 5.8 90.5 12.9V45.2Z"
                                    />
                                    <path
                                        fill="#ECB22E"
                                        d="M77.6 97C84.7 97 90.5 102.8 90.5 109.9C90.5 117 84.7 122.8 77.6 122.8C70.5 122.8 64.7 117 64.7 109.9V97H77.6Z"
                                    />
                                    <path
                                        fill="#ECB22E"
                                        d="M77.6 90.5002C70.5 90.5002 64.7 84.7002 64.7 77.6002C64.7 70.5002 70.5 64.7002 77.6 64.7002H109.9C117 64.7002 122.8 70.5002 122.8 77.6002C122.8 84.7002 117 90.5002 109.9 90.5002H77.6Z"
                                    />
                                </svg>
                            </span>
                            <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">
                                <a href="#" className="focus:outline-none">
                                    <span className="absolute inset-0" aria-hidden="true"></span>
                                    Frink finanzas
                                </a>
                            </dt>
                        </div>
                        <div className="mt-4 flex flex-1 flex-col">
                            <div className="flex-1">
                                <dd className="text-sm/6 text-gray-600 dark:text-gray-400">
                                    Dirige tus finanzas
                                </dd>
                            </div>
                            <div className="mt-6 flex items-center space-x-2">
                                <svg
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    className="remixicon size-5 text-gray-400 dark:text-gray-600"
                                >
                                    <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20ZM13 12H16L12 16L8 12H11V8H13V12Z" />
                                </svg>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
