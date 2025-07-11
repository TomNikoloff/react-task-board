// src/components/Modal.jsx

const Modal = ({
    onClose,
    onSave,
    title = "Modal Title",
    error,
    children
}) => {

    const handleSave = () => {
        onSave();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-invert backdrop-opacity-10 flex items-center justify-center p-6 sm:p-10 overflow-auto z-50">
			<div className={`bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[calc(100vh-5rem)]`}>
				{/* Header */}
				<div className="px-6 py-4 border-b border-gray-300 flex justify-between items-center">
					<h2 className="text-lg font-bold">{title}</h2>
					<div className="flex items-center gap-4">
						{error && <div className="mt-1 text-sm text-red-600 font-medium">* {error}</div>}
						<button
							type="button"
							className="text-2xl text-gray-600 hover:text-red-600"
							onClick={onClose}
						>
							<i className="bi bi-x-lg"></i>
						</button>
					</div>
				</div>
				{/* Body */}
				<div className={`flex-1 overflow-y-auto p-6 sm:p-8`}>
                    {children}
				</div>
				{/* Footer */}
				<div className="px-6 py-4 border-t border-gray-300 flex justify-end">
					<button
						onClick={onClose}
						className="px-6 py-2 mr-4 rounded border-2 border-red-500 text-red-500 font-medium"
					>
						Close
					</button>
					<button
						onClick={handleSave}
						className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
					>
						Save &amp; Close
					</button>
				</div>
			</div>
		</div>
    );
};

export default Modal;