import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export const useBoards = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBoardTitle, setNewBoardTitle] = useState('');
    const [boards, setBoards] = useState([]);
    const [editingBoardId, setEditingBoardId] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');

    const fetchBoards = async (userId) => {
        try {
            const response = await api.get(`/boards/all/${userId}`);

            console.log("Пришли доски с бэкенда:", response.data.boards);
            setBoards(response.data.boards);
        } catch (error) {
            console.error("Ошибка загрузки досок:", error);
        }
    };

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedName = localStorage.getItem('username');

        if (storedUserId) {
            setUserId(storedUserId);
            setUsername(storedName || 'User');
            fetchBoards(storedUserId);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleCreateBoard = async (e) => {
        if (e) e.preventDefault();

        if (newBoardTitle.trim().length < 5) {
            alert("Название доски должно состоять минимум из 5 символов!");
            return;
        }

        try {
            const response = await api.post(`/boards/create/${userId}`, {
                title: newBoardTitle
            });

            console.log("Доска успешно создана:", response.data);

            // Закрываем окно и очищаем инпут
            setIsModalOpen(false);
            setNewBoardTitle('');

            setBoards(prevBoards => [...prevBoards, response.data]);

        } catch (error) {
            console.error('Ошибка при создании доски:', error);
            const errorMsg = error.response?.data?.detail || 'Не удалось создать доску.';
            alert(`Ошибка: ${JSON.stringify(errorMsg)}`);
        }
    };

    const handleDeleteBoard = async (e, boardId) => {
        e.stopPropagation();

        if (!window.confirm('Вы точно хотите удалить эту доску?')) return;

        try {
            await api.delete(`/boards/${userId}/${boardId}`);
            setBoards(prevBoards => prevBoards.filter(board => board.id !== boardId));
        } catch (error) {
            console.error('Ошибка при удалении:', error);
            alert('Не удалось удалить доску');
        }
    };

    const startEditing = (e, board) => {
        e.stopPropagation();
        setEditingBoardId(board.id);
        setEditingTitle(board.title);
    };

    const saveBoardTitle = async (boardId) => {
        // Если имя стерли полностью, то отменяем редактирование
        if (!editingTitle.trim()) {
            setEditingBoardId(null);
            return;
        }

        try {
            const response = await api.put(`/boards/${userId}/${boardId}`, {
                title: editingTitle
            });

            // Обновляем название доски в нашем массиве
            setBoards(prevBoards => prevBoards.map(board =>
                board.id === boardId ? { ...board, title: response.data.title } : board
            ));

            // Выходим из режима редактирования
            setEditingBoardId(null);
        } catch (error) {
            console.error('Ошибка при обновлении:', error);
            alert('Не удалось обновить название');
            setEditingBoardId(null);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.target.blur();
        } else if (e.key === 'Escape') {
            setEditingBoardId(null);
        }
    };

    return {
        username,
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
        handleKeyDown
    };
};