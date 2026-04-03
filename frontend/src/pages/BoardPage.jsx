import { useParams, useNavigate } from 'react-router-dom';
import { useColumns } from '../hooks/useColumns';
import { useState } from 'react';
import Header from '../components/Header';

export default function BoardPage() {
    const { id: boardId } = useParams();
    const navigate = useNavigate();

    const {
        columns,
        boardTitle,
        newColumnTitle,
        setNewColumnTitle,
        handleCreateColumn,
        handleDeleteColumn,
        editingColumnId,
        editingColumnTitle,
        setEditingColumnTitle,
        startEditingColumn,
        saveColumnTitle,
        handleColumnKeyDown,
        handleCreateCard,
        handleUpdateCard,
        handleDeleteCard
    } = useColumns(boardId);

    const [addingCardToColumn, setAddingCardToColumn] = useState(null);
    const [newCardTitle, setNewCardTitle] = useState("");

    const [activeCard, setActiveCard] = useState(null); // Хранит { columnId, card } открытой карточки
    const [editCardData, setEditCardData] = useState({ title: '', description: '', deadline: '' });

    const openCardModal = (columnId, card) => {
        setActiveCard({ columnId, cardId: card.id });
        setEditCardData({
            title: card.title || '',
            description: card.description || '',
            deadline: card.deadline ? card.deadline.split('T')[0] : ''
        });
    };

    const saveCardModal = async () => {
        if (editCardData.title.trim().length < 3) {
            alert("Название должно быть не короче 3 символов!");
            return;
        }
        const dataToSend = {
            ...editCardData,
            deadline: editCardData.deadline === "" ? null : editCardData.deadline
        };
        const success = await handleUpdateCard(activeCard.columnId, activeCard.cardId, dataToSend);
        if (success) setActiveCard(null);
    };

    const submitNewCard = async (columnId) => {
        const success = await handleCreateCard(columnId, newCardTitle);
        if (success) {
            setNewCardTitle("");
            setAddingCardToColumn(null);
        }
    };

    return (
        <div className="min-h-screen bg-workspace-gradient pt-8 pb-6 font-sans flex flex-col">

            <Header />

            <div className="w-full bg-white/90 shadow-[0_4px_4px_0_rgba(255,255,255,0.40)] py-3 mb-8 flex justify-center">
                <h2 className="text-[#5B4A82] text-xl font-bold">{boardTitle || "Загрузка..."}</h2>
            </div>

            <main className="flex-1 overflow-x-auto pb-6 max-w-[95%] w-full mx-auto px-4 lg:px-0 scrollbar-custom">
                <div className="flex gap-6 items-start h-full">

                    {columns.map(column => (
                        <div key={column.id} className="bg-[#A3A7F9] rounded-xl w-72 flex-shrink-0 p-4 shadow-sm flex flex-col max-h-full border-2 border-white group">

                            <div className="flex justify-between items-center mb-4 px-1 group">
                                {editingColumnId === column.id ? (
                                    <input
                                        type="text"
                                        value={editingColumnTitle}
                                        onChange={(e) => setEditingColumnTitle(e.target.value)}
                                        onBlur={() => saveColumnTitle(column.id)}
                                        onKeyDown={handleColumnKeyDown}
                                        autoFocus
                                        className="w-full bg-white/30 text-white placeholder-white/70 font-medium rounded px-2 py-1 outline-none focus:ring-2 focus:ring-white/50"
                                    />
                                ) : (
                                    <h3
                                        onClick={(e) => startEditingColumn(e, column)}
                                        className="text-white text-[18px] font-medium cursor-pointer hover:opacity-80 transition-opacity truncate flex-1"
                                        title="Нажмите, чтобы изменить"
                                    >
                                        {column.title}
                                    </h3>
                                )}

                                {/* Иконка корзины */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteColumn(column.id);
                                    }}
                                    className="text-white/40 hover:text-[#E61383] transition-colors ml-2 opacity-0 group-hover:opacity-100"
                                    title="Удалить колонку"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-1">
                                {column.cards && column.cards.map(card => (
                                    <div
                                        key={card.id}
                                        onClick={() => openCardModal(column.id, card)}
                                        className="bg-white rounded-[15px] p-3 shadow-sm border border-white/50 cursor-pointer hover:shadow-md transition-shadow">
                                        {/* Название */}
                                        <div className="bg-[#9DB2F5] rounded-[8px] px-3 py-1.5 mb-2">
                                            <p className="text-white text-[14px] font-bold truncate">{card.title}</p>
                                        </div>
                                        {/* Описание */}
                                        <div className="bg-[#9DB2F5]/40 rounded-[8px] px-3 py-4 mb-2">
                                            <p className="text-[#632289] text-[12px] leading-tight">
                                                {card.description
                                                    ? (card.description.length > 20 ? card.description.substring(0, 20) + '...' : card.description)
                                                    : "No description..."
                                                }
                                            </p>
                                        </div>
                                        {/* Дата */}
                                        <div className="flex items-center gap-1.5 ml-1">
                                            <div className="w-4 h-4 text-[#9DB2F5]">
                                                <svg fill="currentColor" viewBox="0 0 20 20"><path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" /></svg>
                                            </div>
                                            <span className="text-[#9DB2F5] text-[10px] font-bold">
                                                {card.deadline ? new Date(card.deadline).toLocaleDateString() : 'date'}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {/* Поле ввода при создании */}
                                {addingCardToColumn === column.id && (
                                    <div className="bg-white rounded-[15px] p-2 shadow-inner border-2 border-[#9DB2F5]">
                                        <input
                                            autoFocus
                                            className="w-full bg-transparent outline-none text-[#632289] text-sm p-1"
                                            placeholder="Card name..."
                                            value={newCardTitle}
                                            onChange={(e) => setNewCardTitle(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') submitNewCard(column.id);
                                                if (e.key === 'Escape') {
                                                    setAddingCardToColumn(null);
                                                    setNewCardTitle("");
                                                }
                                            }}

                                            onBlur={() => {
                                                if (!newCardTitle.trim()) {
                                                    setAddingCardToColumn(null);
                                                    setNewCardTitle("");
                                                }
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setAddingCardToColumn(column.id)}
                                className="bg-[#CDBBFF] hover:bg-[#B296FF] text-white w-full py-2 rounded-lg flex items-center justify-center gap-1 font-bold transition-colors shadow-sm text-sm"
                            >
                                + create card
                            </button>
                        </div>
                    ))}

                    <div className="bg-[#CDBBFF]/80 hover:bg-[#B296FF] transition-colors rounded-xl w-72 flex-shrink-0 p-2 border-dashed border-2 border-white">
                        <form onSubmit={handleCreateColumn}>
                            <input
                                type="text"
                                value={newColumnTitle}
                                onChange={(e) => setNewColumnTitle(e.target.value)}
                                placeholder="+ create column"
                                className="w-full px-4 py-2 bg-transparent border-none outline-none text-white placeholder-white/80 font-medium text-center"
                            />
                        </form>
                    </div>

                </div>
            </main>

            <footer className="max-w-[95%] w-full mx-auto mt-auto pt-2 px-4 lg:px-0 flex flex-col items-center">
                <button
                    onClick={() => navigate('/')}
                    className="bg-gradient-to-r from-[#E82260]/[.17] to-[#E82260]/[.83] ring-[3px] ring-[#EA63AB] hover:opacity-90 text-white px-25 py-[2.4px] rounded-full font-medium transition-all"
                >
                    Back to main page
                </button>
            </footer>

            {activeCard && (
                <div className="fixed inset-0 bg-[#5B4A82]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-[500px] rounded-[24px] shadow-2xl p-6 flex flex-col gap-4">

                        <div className="flex justify-between items-start gap-4">
                            <input
                                type="text"
                                value={editCardData.title}
                                onChange={(e) => setEditCardData({ ...editCardData, title: e.target.value })}
                                className="text-2xl font-bold text-[#632289] w-full bg-transparent border-b-2 border-transparent hover:border-[#9DB2F5]/50 focus:border-[#8DA6F1] outline-none transition-colors px-1"
                                placeholder="Card Title"
                            />
                            <button
                                onClick={async () => {
                                    const success = await handleDeleteCard(activeCard.columnId, activeCard.cardId);
                                    if (success) setActiveCard(null);
                                }}
                                className="text-gray-400 hover:text-[#E61383] transition-colors p-2"
                                title="Удалить карточку"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>

                        {/* Описание */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-bold text-[#9DB2F5] px-1">Description</label>
                            <textarea
                                value={editCardData.description}
                                onChange={(e) => setEditCardData({ ...editCardData, description: e.target.value })}
                                className="w-full bg-[#9DB2F5]/10 rounded-[12px] p-3 text-[#632289] text-sm outline-none border border-transparent focus:border-[#9DB2F5] min-h-[120px] resize-none"
                                placeholder="Add a more detailed description..."
                            />
                        </div>

                        {/* Дата */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-bold text-[#9DB2F5] px-1">Deadline</label>
                            <input
                                type="date"
                                value={editCardData.deadline}
                                onChange={(e) => setEditCardData({ ...editCardData, deadline: e.target.value })}
                                className="w-fit bg-[#9DB2F5]/10 rounded-[12px] px-3 py-2 text-[#632289] text-sm outline-none border border-transparent focus:border-[#9DB2F5]"
                            />
                        </div>

                        {/* Кнопки внизу */}
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => setActiveCard(null)}
                                className="px-5 py-2 rounded-full font-medium text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveCardModal}
                                className="bg-gradient-to-r from-[#E82260]/[.8] to-[#E82260] text-white px-8 py-2 rounded-full font-medium transition-all shadow-md hover:shadow-lg"
                            >
                                Save
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}