import { createSlice } from "@reduxjs/toolkit";

const boardsSlice = createSlice({
    name: "boards",
    initialState: {
        boards: [],
    },
    reducers: {
        setBoards: (state, action) => {
            state.boards = action.payload;
        },
        addBoard: (state, action) => {
            state.boards.push(action.payload);
        },
        deleteBoard: (state, action) => {
            state.boards = state.boards.filter(board => board.id !== action.payload);
        },
        updateBoard: (state, action) => {
            const board = state.boards.find(board => board.id === action.payload.id)
            if (board) {
                board.title = action.payload.title;
            }
        },
    },
});

export const { setBoards, addBoard, deleteBoard, updateBoard } = boardsSlice.actions;
export default boardsSlice.reducer;