interface AlertProps {
    isVisible: boolean;
    type: string;
    message: string;
    onClose: () => void;
  }
  
  export default function Alert({ isVisible, type, message, onClose }: AlertProps) {
    if (!isVisible) return null;
  
    return (
      <div className="fixed bottom-4 md:left-64 md:pl-2 mx-4 md:mx-0 z-50">
        <div className="bg-white dark:bg-zinc-950 border opacity-95 border-gray-200 dark:border-zinc-700 rounded-xl p-4 shadow-lg">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100">
              {type === 'error' ? 'Error' : 'Alerta'}
            </h4>
            <button
              className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
              onClick={onClose}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
              </svg>
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {message}
          </p>
        </div>
      </div>
    );
  }