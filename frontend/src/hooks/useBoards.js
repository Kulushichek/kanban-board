import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

import { useSelector, useDispatch } from 'react-redux';
import { setBoards, addBoard, deleteBoard, updateBoard } from '../store/boardsSlice';
import { setUser } from '../store/userSlice';

export const useBoards = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const boards = useSelector((state) => state.boards.boards)
    const { userId, userName } = useSelector((state) => state.user)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBoardTitle, setNewBoardTitle] = useState('');
    const [editingBoardId, setEditingBoardId] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const getErrorMessage = (error, defaultMsg) => {
        const responseData = error?.response?.data;

        if (responseData?.details && responseData.details.length > 0) {
            let msg = responseData.details[0].message;
            return msg;
        }

        if (responseData?.detail) return responseData.detail;
        return defaultMsg;
    };

    const fetchBoards = async (userId) => {
        try {
            const response = await api.get(`/boards/all/${userId}`);

            console.log("The boards came from the backend:", response.data.boards);
            dispatch(setBoards(response.data.boards));
        } catch (error) {
            console.error("Error loading boards:", error);
        }
    };

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedName = localStorage.getItem('userName');

        if (storedUserId) {
            dispatch(setUser({ userId: storedUserId, userName: storedName || 'User' }))
            fetchBoards(storedUserId);
        } else {
            navigate('/login');
        }
    }, [navigate, dispatch]);

    const handleCreateBoard = async (e) => {
        if (e) e.preventDefault();
        setErrorMsg('');

        try {
            const response = await api.post(`/boards/create/${userId}`, {
                title: newBoardTitle
            });

            console.log("The board was created successfully:", response.data);
            // Закрываем окно и очищаем инпут
            setIsModalOpen(false);
            setNewBoardTitle('');

            dispatch(addBoard(response.data));

        } catch (error) {
            console.error('Error when creating the board:', error);
            const errorMsg = getErrorMessage(error, 'Could not create a board.');
            setErrorMsg(errorMsg);
        }
    };

    const handleDeleteBoard = async (e, boardId) => {
        e.stopPropagation();

        if (!window.confirm('Are you sure you want to delete this board?')) return;

        try {
            await api.delete(`/boards/${userId}/${boardId}`);
            dispatch(deleteBoard(boardId));
        } catch (error) {
            console.error('Error when deleting:', error);
            const errorMsg = getErrorMessage(error, 'Could not delete the board.');
            toast.error(errorMsg);
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
            dispatch(updateBoard({ id: boardId, title: response.data.title }))

            // Выходим из режима редактирования
            setEditingBoardId(null);
        } catch (error) {
            console.error('Error during the update:', error);
            const errorMsg = getErrorMessage(error, 'Could not update the name.');
            toast.error(errorMsg);
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
        userName,
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
    };
};