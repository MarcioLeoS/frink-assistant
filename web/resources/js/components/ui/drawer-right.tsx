import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DrawerComponentProps {
    isDrawerOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function DrawerComponent({ isDrawerOpen, onClose, children }: DrawerComponentProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isDrawerOpen && contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
    }, [isDrawerOpen]);

    return (
        <AnimatePresence>
            {isDrawerOpen && (
                <div
                    onClick={onClose}
                    data-state="open"
                    className="fixed inset-0 z-40 bg-black/30 mb-0"
                    style={{ pointerEvents: 'auto', animationDuration: '400ms', animationFillMode: 'backwards' }}
                >
                    <motion.div
                        role="dialog"
                        id="drawer"
                        aria-describedby="drawer-desc"
                        aria-labelledby="drawer-title"
                        data-state="open"
                        className="fixed inset-y-2 z-50 mx-auto md:my-4 md:mr-4 flex w-[95vw] flex-1 flex-col overflow-y-auto rounded-xl border p-4 shadow-lg focus:outline-none max-sm:inset-x-2 sm:inset-y-2 sm:right-2 sm:p-6 border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 sm:max-w-lg"
                        tabIndex={-1}
                        style={{ pointerEvents: 'auto' }}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.4 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-x-4 border-b border-gray-200 pb-4  dark:border-zinc-800">
                            <button
                                onClick={onClose}
                                className="relative inline-flex items-center justify-center whitespace-nowrap rounded-md border text-center text-sm font-medium transition-all duration-100 ease-in-out disabled:pointer-events-none disabled:shadow-none outline outline-offset-2 outline-0 focus-visible:outline-2 outline-blue-500 dark:outline-blue-500 shadow-none border-transparent text-gray-900 dark:text-gray-50 bg-transparent disabled:text-gray-400 disabled:dark:text-gray-600 aspect-square p-1 hover:bg-gray-100 hover:dark:bg-gray-400/10"
                                type="button"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    className="remixicon size-6"
                                >
                                    <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z" />
                                </svg>
                            </button>
                        </div>
                        <div
                            ref={contentRef}
                            className="flex-1 py-4 overflow-y-auto container-y pr-1 space-y-1"
                        >
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
