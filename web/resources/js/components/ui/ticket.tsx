interface TicketProps {
    title: string;
    status: string;
    children: React.ReactNode;
}

type Status = 'all' | 'open' | 'in_progress' | 'resolved' | 'closed'

const STATUS_COLORS: Record<Status, string> = {
    all: 'bg-gray-400/20 text-gray-500 dark:text-gray-400',
    open: 'bg-blue-400/20 text-blue-500 dark:text-blue-400',
    in_progress: 'bg-yellow-400/20 text-yellow-500 dark:text-yellow-400',
    resolved: 'bg-green-400/20 text-green-500 dark:text-green-400',
    closed: 'bg-red-400/20 text-red-500 dark:text-red-400',
};

export default function TicketComponent({ title, status, children }: TicketProps) {
    const statusClass = STATUS_COLORS[status as Status]

    return (
        <div>
            {title && (
                <div className="drop-shadow-md mt-12 max-w-96 mx-auto">
                    <div className="bg-white dark:bg-zinc-800 rounded-t-xl px-5 pb-2.5 pt-10 text-center">
                        <div className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3 uppercase">{title}</div>
                        <div className={`${statusClass} capitalize text-xs inline-flex font-medium rounded-full text-center px-2.5 py-1`}>{status}</div>
                    </div>
                    <div className="flex justify-between items-center" aria-hidden="true">
                        <svg className="fill-white dark:fill-zinc-800" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 20c5.523 0 10-4.477 10-10S5.523 0 0 0h20v20H0Z" />
                        </svg>
                        <div className="grow w-full h-5 bg-white dark:bg-zinc-800 flex flex-col justify-center">
                            <div className="h-px w-full border-t border-dashed border-gray-200 dark:border-zinc-700"></div>
                        </div>
                        <svg className="fill-white dark:fill-zinc-800 rotate-180" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 20c5.523 0 10-4.477 10-10S5.523 0 0 0h20v20H0Z" />
                        </svg>
                    </div>
                    <div className="bg-white dark:bg-zinc-800 rounded-b-xl p-5 pt-2.5 text-sm space-y-3">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}
