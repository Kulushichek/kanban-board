import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

export const useColumns = (boardId) => {

    const [columns, setColumns] = useState([]);
    const [boardTitle, setBoardTitle] = useState('');
    const [newColumnTitle, setNewColumnTitle] = useState('');
    const { userId, userName } = useSelector((state) => state.user)

    const [editingColumnId, setEditingColumnId] = useState(null);
    const [editingColumnTitle, setEditingColumnTitle] = useState('');

    const getErrorMessage = (error, defaultMsg) => {
        const responseData = error?.response?.data;

        if (responseData?.details && responseData.details.length > 0) {
            let msg = responseData.details[0].message;
            return msg;
        }

        if (responseData?.detail) {
            return responseData.detail;
        }

        return defaultMsg;
    };

    const fetchBoardInfo = async () => {
        try {
            const response = await api.get(`/boards/${userId}/${boardId}`);
            setBoardTitle(response.data.title);
        } catch (error) {
            console.error("Error loading information about the board:", error);
            setBoardTitle(`Board #${boardId}`);
        }
    };

    // Загрузка колонок
    const fetchColumns = async () => {
        if (!userId || !boardId) return;
        try {
            const response = await api.get(`/columns/all/${userId}/${boardId}`);
            setColumns(response.data.columns);
        } catch (error) {
            console.error("Error loading columns:", error);
        }
    };

    // Скачивание колонок при открытии страницы
    useEffect(() => {
        fetchBoardInfo();
        fetchColumns();
    }, [boardId]);

    const handleCreateColumn = async (e) => {
        if (e) e.preventDefault();

        try {
            const response = await api.post(`/columns/create/${userId}/${boardId}`, {
                title: newColumnTitle
            });

            setColumns(prev => [...prev, response.data]);
            setNewColumnTitle('');
        } catch (error) {
            console.error('Error when creating a column:', error);
            const errorMsg = getErrorMessage(error, 'Failed to create a column.');
            toast.error(errorMsg);
        }
    };

    const handleDeleteColumn = async (columnId) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this column?");
        if (!isConfirmed) return;

        try {
            await api.delete(`/columns/${userId}/${columnId}`);
            setColumns(prev => prev.filter(col => col.id !== columnId));
        } catch (error) {
            console.error('Error deleting a column:', error);
            toast.error('Could not delete column');
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

        try {
            const response = await api.put(`/columns/${userId}/${columnId}`, {
                title: trimmedTitle
            });

            setColumns(prev => prev.map(col =>
                col.id === columnId ? { ...col, title: response.data.title } : col
            ));
            setEditingColumnId(null);
        } catch (error) {
            console.error('Error updating the name:', error);
            const errorMsg = getErrorMessage(error, 'Could not update the name.');
            toast.error(errorMsg);
        }
    };

    const handleCreateCard = async (columnId, title) => {
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
            console.error('Error when creating the card:', error);
            const errorMsg = getErrorMessage(error, 'Failed to create the card.');
            toast.error(errorMsg);
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
            console.error('Error when updating the card:', error);
            const errorMsg = getErrorMessage(error, 'Failed to update the card.');
            toast.error(errorMsg);
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
            console.error("Error when saving the position", error);
        }
    };


    const handleDeleteCard = async (columnId, cardId) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this card?");
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
            console.error('Error when deleting the card:', error);
            toast.error('Failed to delete the card');
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
            console.error('Error when uploading the image:', error);
            toast.error('Failed to upload the image');
            return null;
        }
    };

    const handleGetImages = async (cardId) => {
        try {
            const response = await api.get(`/cards/${userId}/${cardId}/images`);
            return response.data;
        } catch (error) {
            console.error('Error when loading the list of images:', error);
            return [];
        }
    };

    const handleDeleteImage = async (cardId, imageId) => {
        try {
            await api.delete(`/cards/${userId}/${cardId}/images/${imageId}`);
            return true;
        } catch (error) {
            console.error('Error when deleting the image:', error);
            toast.error('Failed to delete the image');
            return false;
        }
    };

    return {
        columns,
        boardTitle,
        newColumnTitle,
        userName,
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