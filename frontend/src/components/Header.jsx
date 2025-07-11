// src/components/Header.jsx

const Header = ({ onAddList }) => {
    return (
		<header className="flex items-center justify-between px-8 py-4 bg-gray-50 border-b border-gray-200 min-h-[60px]">
			<div className="flex items-center gap-4">
				<button
                    type="button"
					onClick={onAddList}
					className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
				>
					+ Add List
				</button>
			</div>
			<h1 className="text-2xl font-bold m-0">
                Task Board
            </h1>

			<div />
		</header>
    );
};

export default Header;