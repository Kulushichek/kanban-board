import { useParams, useNavigate } from 'react-router-dom';
import { useColumns } from '../hooks/useColumns';
import { useState } from 'react';
import Header from '../components/Header';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useBoards } from '../hooks/useBoards';

export default function BoardPage() {
    const { id: boardId } = useParams();
    const navigate = useNavigate();

    const { boards, editingBoardId, editingTitle, setEditingTitle, startEditing, saveBoardTitle, handleKeyDown } = useBoards();
    const numericBoardId = Number(boardId);
    const currentBoard = boards.find(b => b.id === numericBoardId);

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
        handleDragCard,
        handleDeleteCard,
        handleAddImage,
        handleGetImages,
        handleDeleteImage
    } = useColumns(boardId);

    const [addingCardToColumn, setAddingCardToColumn] = useState(null);
    const [newCardTitle, setNewCardTitle] = useState("");

    const [cardImages, setCardImages] = useState([]);

    const [activeCard, setActiveCard] = useState(null); // Хранит { columnId, card } открытой карточки
    const [editCardData, setEditCardData] = useState({ title: '', description: '', deadline: '' });

    const openCardModal = async (columnId, card) => {
        setActiveCard({ columnId, cardId: card.id });
        setEditCardData({
            title: card.title || '',
            description: card.description || '',
            deadline: card.deadline ? card.deadline.split('T')[0] : ''
        });

        const images = await handleGetImages(card.id);
        setCardImages(images);
    };

    const closeCardModal = () => {
        setActiveCard(null);
        setCardImages([]);
    };

    const saveCardModal = async () => {
        const dataToSend = {
            ...editCardData,
            deadline: editCardData.deadline === "" ? null : editCardData.deadline
        };
        const success = await handleUpdateCard(activeCard.columnId, activeCard.cardId, dataToSend);

        if (success) closeCardModal();
    };

    const onImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const newImage = await handleAddImage(activeCard.cardId, file);
        if (newImage) {
            setCardImages(prev => [...prev, newImage]);
        }
    };

    const onRemoveImage = async (imageId) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this picture?");
        if (!isConfirmed) return;

        const success = await handleDeleteImage(activeCard.cardId, imageId);
        if (success) {
            setCardImages(prev => prev.filter(img => img.id !== imageId));
        }
    };

    const submitNewCard = async (columnId) => {
        const success = await handleCreateCard(columnId, newCardTitle);
        if (success) {
            setNewCardTitle("");
            setAddingCardToColumn(null);
        }
    };

    const onDragEnd = (result) => {
        console.log("The result of the drag and drop:", result);

        const { destination, source } = result;

        if (!destination) return;

        // Если бросили в то же самое место — ничего не делаем
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        handleDragCard(source, destination);
    };

    return (
        <div className="h-screen bg-workspace-gradient pt-8 pb-6 font-sans flex flex-col overflow-hidden">

            <Header />
            <div className="w-full bg-white/90 shadow-[0_4px_4px_0_rgba(255,255,255,0.40)] py-3 mb-8 flex justify-center items-center min-h-[56px]">
                {editingBoardId === numericBoardId ? (
                    <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onBlur={() => saveBoardTitle(numericBoardId)}
                        onKeyDown={(e) => handleKeyDown(e, numericBoardId)}
                        autoFocus
                        maxLength={50}
                        onClick={(e) => e.stopPropagation()}
                        className="w-[300px] px-3 py-1 text-center text-[#5B4A82] font-bold text-xl rounded-md focus:outline-none shadow-inner bg-[#9DB2F5]/10 border border-[#9DB2F5] transition-colors"
                    />
                ) : (
                    <h2
                        onClick={(e) => {
                            if (currentBoard) startEditing(e, currentBoard);
                        }}
                        className="text-[#5B4A82] text-xl font-bold cursor-pointer hover:opacity-70 transition-opacity"
                        title="Click to edit"
                    >
                        {currentBoard ? currentBoard.title : (boardTitle || "Loading...")}
                    </h2>
                )}
            </div>

            <main className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden pb-6 max-w-[95%] w-full mx-auto px-4 lg:px-0 scrollbar-custom">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-6 items-start h-full">
                        {columns.map(column => (
                            <div key={column.id} className="bg-[#A3A7F9] rounded-xl w-72 flex-shrink-0 p-4 shadow-sm flex flex-col max-h-full border-2 border-white group">
                                <div className="flex justify-between items-start mb-4 px-1 group">
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
                                            className="max-w-[180px] w-full text-white text-[18px] font-medium cursor-pointer hover:opacity-80 transition-opacity flex-1 break-words"
                                            title="Click to change"
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
                                        className="text-white/40 hover:text-[#E61383] transition-colors ml-2 mt-1 opacity-0 group-hover:opacity-100"
                                        title="Delete column"
                                    >
                                        <svg width="20px" height="20px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                            <title>Trash</title>
                                            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                <g id="Trash">
                                                    <rect id="Rectangle" fillRule="nonzero" x="0" y="0" width="24" height="24">

                                                    </rect>
                                                    <path d="M6,6 L6.96683,19.5356 C6.98552,19.7973 7.20324,20 7.46556,20 L16.5344,20 C16.7968,20 17.0145,19.7973 17.0332,19.5356 L18,6" id="Path" stroke="#d9356fff" strokeWidth="2" strokeLinecap="round">

                                                    </path>
                                                    <line x1="4" y1="6" x2="20" y2="6" id="Path" stroke="#d9356fff" strokeWidth="2" strokeLinecap="round">

                                                    </line>
                                                    <line x1="10" y1="10" x2="10" y2="16" id="Path" stroke="#d9356fff" strokeWidth="2" strokeLinecap="round">

                                                    </line>
                                                    <line x1="14" y1="10" x2="14" y2="16" id="Path" stroke="#d9356fff" strokeWidth="2" strokeLinecap="round">

                                                    </line>
                                                    <path d="M15,6 C15,4.34315 13.6569,3 12,3 C10.3431,3 9,4.34315 9,6" id="Path" stroke="#d9356fff" strokeWidth="2" strokeLinecap="round">

                                                    </path>
                                                </g>
                                            </g>
                                        </svg>
                                    </button>
                                </div>

                                <Droppable droppableId={String(column.id)}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className="flex-1 overflow-y-auto space-y-3 scrollbar-custom mb-4 pr-1"
                                        >
                                            {column.cards && column.cards.map((card, index) => (
                                                <Draggable key={card.id} draggableId={String(card.id)} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            key={card.id}
                                                            onClick={() => openCardModal(column.id, card)}
                                                            className="bg-white rounded-[15px] p-3 shadow-sm border border-white/50 cursor-pointer hover:shadow-md transition-shadow"
                                                        >
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
                                                    )}
                                                </Draggable>
                                            ))}

                                            {provided.placeholder} {/* Бронируем место для перетаскивания */}
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
                                    )}
                                </Droppable>

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
                </DragDropContext>
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
                                    if (success) closeCardModal();
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

                        <div className="flex flex-col gap-2 mt-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-sm font-bold text-[#9DB2F5]">Attachments</label>

                                <label className="cursor-pointer bg-[#9DB2F5]/20 hover:bg-[#9DB2F5]/40 text-[#632289] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                                    + Add Image
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={onImageUpload}
                                    />
                                </label>
                            </div>
                            {cardImages.length > 0 && (
                                <div className="grid grid-cols-3 gap-3 bg-[#9DB2F5]/5 rounded-[12px] p-3 border border-[#9DB2F5]/20 max-h-[250px] overflow-y-auto scrollbar-custom pr-1">
                                    {cardImages.map(img => (
                                        <div key={img.id} className="relative group rounded-lg overflow-hidden border border-[#9DB2F5]/30 aspect-video bg-gray-100">

                                            <img
                                                src={`http://localhost:8000${img.file_path}`}
                                                alt="attachment"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                onClick={() => onRemoveImage(img.id)}
                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                                                title="Удалить картинку"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={closeCardModal}
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