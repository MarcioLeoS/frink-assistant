import React from 'react';

interface DefaultButtonProps {
    children: React.ReactNode,
    handleAction: () => void,
}

function DefaultButton({ children, handleAction }: DefaultButtonProps) {
    return (
        <button onClick={handleAction} type="button" className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50 outline-none border border-input bg-background shadow-xs h-9 px-2.5 py-1 hover:bg-accent hover:text-accent-foreground">
            {children}
        </button>
    )
}

export default DefaultButton;