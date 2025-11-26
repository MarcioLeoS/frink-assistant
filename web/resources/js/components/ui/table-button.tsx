import React from 'react';

interface DefaultButtonProps {
    children: React.ReactNode,
    action?: string,
    handleAction: () => void,
}

function DefaultButton({ children, action, handleAction }: DefaultButtonProps) {
    return (
        <span
            className="inline-flex overflow-hidden rounded-md ml-auto mt-1 bg-gray-200 dark:bg-zinc-700 shadow-sm">
            <button onClick={handleAction} title={action}
                className="cursor-pointer inline-block px-2 py-1 hover:bg-gray-300 dark:hover:bg-zinc-600 focus:relative"
            >
                {children}
            </button>
        </span >
    )
}

export default DefaultButton;

