import { useNavigate } from 'react-router-dom';
import { useBoards } from '../hooks/useBoards';
import Header from '../components/Header';

export default function Boards() {
    const navigate = useNavigate();

    const {
        boards,
        isModalOpen,
        setIsModalOpen,
        newBoardTitle,
        setNewBoardTitle,
        handleCreateBoard,
        editingBoardId,
        editingTitle,
        setEditingTitle,
        handleDeleteBoard,
        startEditing,
        saveBoardTitle,
        handleKeyDown,
        errorMsg
    } = useBoards();

    return (
        <div className="min-h-screen bg-board-gradient p-8 font-sans">

            <Header />

            {/* Контейнер для карточек досок */}
            <main className="max-w-[1096px] mx-auto flex flex-wrap gap-6">
                {boards.map((board) => (
                    <div key={board.id} className="w-64 h-36 bg-white rounded-2xl shadow-board overflow-hidden flex flex-col relative group">

                        <button
                            onClick={(e) => handleDeleteBoard(e, board.id)}
                            className="absolute top-2 right-2 p-1.5 bg-white/20 hover:bg-white/50 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
                            title="Delete board"
                        >
                            <svg className="w-4 h-4 text-white hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>

                        <div className="bg-gradient-to-r from-[#A85EAA] to-[#DD6DBC] h-1/2 flex items-center justify-center relative px-4">

                            {editingBoardId === board.id ? (
                                <input
                                    type="text"
                                    value={editingTitle}
                                    onChange={(e) => setEditingTitle(e.target.value)}
                                    onBlur={() => saveBoardTitle(board.id)} // Сохраняем, если кликнули мимо
                                    onKeyDown={(e) => handleKeyDown(e, board.id)} // Сохраняем по Enter
                                    autoFocus
                                    maxLength={50}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full px-2 py-1 text-center text-[#5B4A82] font-bold text-lg rounded-md focus:outline-none shadow-inner"
                                />
                            ) : (
                                <h3
                                    onClick={(e) => startEditing(e, board)}
                                    className="text-white font-bold text-lg cursor-pointer hover:underline decoration-white/50 underline-offset-4 text-center w-full truncate"
                                    title="Click to edit"
                                >
                                    {board.title}
                                </h3>
                            )}

                        </div>
                        <div className="h-1/2 flex items-center justify-center">
                            <button
                                onClick={() => navigate(`/board/${board.id}`)}
                                className="bg-[#E767C7] hover:bg-[#D45BB5] text-white px-5 py-1.5 rounded-full text-sm font-semibold transition-colors shadow-sm"
                            >
                                Select board
                            </button>
                        </div>
                    </div>
                ))}
                <div
                    onClick={() => setIsModalOpen(true)}
                    className="w-64 h-36 bg-white rounded-2xl shadow-board flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition-shadow border border-white/50"
                >
                    <svg className="w-12 h-12 text-[#E767C7] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    <span className="text-[#D3739B] font-medium">Create new board</span>
                </div>

            </main>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    {/* Белая карточка модалки */}
                    <div className="bg-white rounded-[20px] p-8 w-full max-w-md shadow-2xl relative">

                        {/* Кнопка закрытия*/}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>

                        <h2 className="text-2xl font-bold text-[#5B4A82] mb-6">Create new board</h2>

                        {/* Поле ввода */}
                        <div className="mb-6">
                            <label className="block text-gray-600 text-sm font-medium mb-2">
                                Board title
                            </label>
                            <input
                                type="text"
                                value={newBoardTitle}
                                onChange={(e) => setNewBoardTitle(e.target.value)}
                                placeholder="Enter board title"
                                maxLength={50}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E767C7] focus:border-transparent transition-all"
                                autoFocus
                            />
                        </div>

                        {errorMsg && (
                            <div className="text-red-500 text-sm mb-4 text-center">
                                {errorMsg}
                            </div>
                        )}

                        {/* Кнопки действий */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 rounded-full text-gray-500 hover:bg-gray-100 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateBoard}
                                disabled={!newBoardTitle.trim()} // Выключаем кнопку, если поле пустое
                                className="bg-[#E767C7] hover:bg-[#D45BB5] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-full font-semibold transition-colors shadow-md"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}