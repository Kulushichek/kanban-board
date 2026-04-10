import { useState, useEffect } from 'react';
import api from '../api/axios';

export const useColumns = (boardId) => {

    const [columns, setColumns] = useState([]);
    const [boardTitle, setBoardTitle] = useState('');
    const [newColumnTitle, setNewColumnTitle] = useState('');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username') || 'User';

    const [editingColumnId, setEditingColumnId] = useState(null);
    const [editingColumnTitle, setEditingColumnTitle] = useState('');

    const fetchBoardInfo = async () => {
        try {
            const response = await api.get(`/boards/${userId}/${boardId}`);
            setBoardTitle(response.data.title);
        } catch (error) {
            console.error("Ошибка загрузки информации о доске:", error);
            setBoardTitle(`Доска #${boardId}`);
        }
    };

    // Загрузка колонок
    const fetchColumns = async () => {
        if (!userId || !boardId) return;
        try {
            const response = await api.get(`/columns/all/${userId}/${boardId}`);
            setColumns(response.data.columns);
        } catch (error) {
            console.error("Ошибка загрузки колонок:", error);
        }
    };

    // Скачивание колонок при открытии страницы
    useEffect(() => {
        fetchBoardInfo();
        fetchColumns();
    }, [boardId]);

    const handleCreateColumn = async (e) => {
        if (e) e.preventDefault();

        if (newColumnTitle.trim().length < 3) {
            alert("Название колонки не должно быть короче 3 символов!");
            return;
        }

        try {
            const response = await api.post(`/columns/create/${userId}/${boardId}`, {
                title: newColumnTitle
            });

            setColumns(prev => [...prev, response.data]);
            setNewColumnTitle('');
        } catch (error) {
            console.error('Ошибка при создании колонки:', error);
            alert('Не удалось создать колонку');
        }
    };

    const handleDeleteColumn = async (columnId) => {
        const isConfirmed = window.confirm("Точно удалить эту колонку?");
        if (!isConfirmed) return;

        try {
            await api.delete(`/columns/${userId}/${columnId}`);
            setColumns(prev => prev.filter(col => col.id !== columnId));
        } catch (error) {
            console.error('Ошибка при удалении колонки:', error);
            alert('Не удалось удалить колонку');
        }
    };

    const handleColumnKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.target.blur();
        } else if (e.key === 'Escape') {
            setEditingColumnId(null);
        }
    };

    const startEditingColumn = (e, column) => {
        e.stopPropagation();
        setEditingColumnId(column.id);
        setEditingColumnTitle(column.title);
    };

    const saveColumnTitle = async (columnId) => {
        const trimmedTitle = editingColumnTitle.trim();

        if (!trimmedTitle) {
            setEditingColumnId(null);
            return;
        }
        if (trimmedTitle.length < 3) {
            alert("Название колонки должно быть не короче 3 символов!");
            const oldTitle = columns.find(c => c.id === columnId)?.title || '';
            setEditingColumnTitle(oldTitle);
            return;
        }

        try {
            const response = await api.put(`/columns/${userId}/${columnId}`, {
                title: trimmedTitle
            });

            setColumns(prev => prev.map(col =>
                col.id === columnId ? { ...col, title: response.data.title } : col
            ));
            setEditingColumnId(null);
        } catch (error) {
            console.error('Ошибка при обновлении:', error);
            alert('Не удалось обновить название');
            setEditingColumnId(null);
        }
    };

    const handleCreateCard = async (columnId, title) => {
        if (title.trim().length < 3) {
            alert("Название карточки должно быть не короче 3 символов!");
            return;
        }

        try {
            const response = await api.post(`/cards/create/${userId}/${columnId}`, {
                title: title
            });

            // Обновляем список колонок, добавляя новую карточку в нужную колонку
            setColumns(prev => prev.map(col =>
                col.id === columnId
                    ? { ...col, cards: [...(col.cards || []), response.data] }
                    : col
            ));
            return true;
        } catch (error) {
            console.error('Ошибка при создании карточки:', error);
            alert('Не удалось создать карточку');
            return false;
        }
    };

    const handleUpdateCard = async (columnId, cardId, updatedData) => {
        try {
            const response = await api.put(`/cards/${userId}/${cardId}`, updatedData);

            setColumns(prev => prev.map(col => {
                if (col.id === columnId) {
                    return {
                        ...col,
                        cards: col.cards.map(card => card.id === cardId ? { ...card, ...response.data } : card)
                    };
                }
                return col;
            }));
            return true;
        } catch (error) {
            console.error('Ошибка при обновлении карточки:', error);
            alert('Не удалось сохранить изменения карточки');
            return false;
        }
    };

    const handleDragCard = async (source, destination) => {
        const newColumns = [...columns];
        const sourceColIndex = newColumns.findIndex(c => String(c.id) === source.droppableId);
        const destColIndex = newColumns.findIndex(c => String(c.id) === destination.droppableId);
        const sourceCol = newColumns[sourceColIndex];
        const destCol = newColumns[destColIndex];
        const [movedCard] = sourceCol.cards.splice(source.index, 1);

        destCol.cards.splice(destination.index, 0, movedCard);

        setColumns(newColumns);

        try {
            await api.put(`/cards/${userId}/${movedCard.id}/move`, {
                column_id: destCol.id,
                position: destination.index
            });
        } catch (error) {
            console.error("Ошибка при сохранении позиции", error);
        }
    };


    const handleDeleteCard = async (columnId, cardId) => {
        const isConfirmed = window.confirm("Точно удалить эту карточку?");
        if (!isConfirmed) return false;

        try {
            await api.delete(`/cards/${userId}/${cardId}`);

            setColumns(prev => prev.map(col => {
                if (col.id === columnId) {
                    return { ...col, cards: col.cards.filter(card => card.id !== cardId) };
                }
                return col;
            }));
            return true;
        } catch (error) {
            console.error('Ошибка при удалении карточки:', error);
            alert('Не удалось удалить карточку');
            return false;
        }
    };

    const handleAddImage = async (cardId, file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post(`/cards/${userId}/${cardId}/images`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Ошибка при загрузке картинки:', error);
            alert('Не удалось загрузить картинку');
            return null;
        }
    };

    const handleGetImages = async (cardId) => {
        try {
            const response = await api.get(`/cards/${userId}/${cardId}/images`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при загрузке списка картинок:', error);
            return [];
        }
    };

    const handleDeleteImage = async (cardId, imageId) => {
        try {
            await api.delete(`/cards/${userId}/${cardId}/images/${imageId}`);
            return true;
        } catch (error) {
            console.error('Ошибка при удалении картинки:', error);
            alert('Не удалось удалить картинку');
            return false;
        }
    };

    return {
        columns,
        boardTitle,
        newColumnTitle,
        username,
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
    };
};