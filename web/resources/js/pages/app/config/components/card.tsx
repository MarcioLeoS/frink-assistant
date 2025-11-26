export default function CreditCard() {
    return (
        <div>
            {/* Credit Card */}
            <div className="relative aspect-7/4 bg-linear-to-tr from-gray-900 to-gray-800 p-5 rounded-xl overflow-hidden">
                <div className="relative h-full flex flex-col justify-between">
                    {/* Logo on card */}
                    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                        <defs>
                            <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="icon1-b">
                                <stop stopColor="#E5E7EB" offset="0%" />
                                <stop stopColor="#9CA3AF" offset="100%" />
                            </linearGradient>
                            <linearGradient x1="50%" y1="24.537%" x2="50%" y2="99.142%" id="icon1-c">
                                <stop stopColor="#374151" offset="0%" />
                                <stop stopColor="#374151" stopOpacity="0" offset="100%" />
                            </linearGradient>
                            <path id="icon1-a" d="M16 0l16 32-16-5-16 5z" />
                        </defs>
                        <g transform="rotate(90 16 16)" fill="none" fillRule="evenodd">
                            <mask id="icon1-d" fill="#fff">
                                <use xlinkHref="#icon1-a" />
                            </mask>
                            <use fill="url(#icon1-b)" xlinkHref="#icon1-a" />
                            <path fill="url(#icon1-c)" mask="url(#icon1-d)" d="M16-6h20v38H16z" />
                        </g>
                    </svg>
                    {/* Card number */}
                    <div className="flex justify-between text-lg font-bold text-gray-200 tracking-widest drop-shadow-md">
                        <span>****</span>
                        <span>****</span>
                        <span>****</span>
                        <span>7328</span>
                    </div>
                    {/* Card footer */}
                    <div className="relative flex justify-between items-center z-10 mb-0.5">
                        {/* Card expiration */}
                        <div className="text-sm font-bold text-gray-200 tracking-widest drop-shadow-md space-x-3">
                            <span>EXP 12/24</span>
                            <span>CVC ***</span>
                        </div>
                    </div>
                    {/* Mastercard logo */}
                    <svg className="absolute bottom-0 right-0" width="48" height={28} viewBox="0 0 48 28">
                        <circle fill="#F0BB33" cx="34" cy="14" r="14" fillOpacity=".8" />
                        <circle fill="#FF5656" cx="14" cy="14" r="14" fillOpacity=".8" />
                    </svg>
                </div>
            </div>
        </div>
    )
}