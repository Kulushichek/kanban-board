import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userId: localStorage.getItem('userId') || null,
        userName: localStorage.getItem('userName') || '',
    },
    reducers: {
        setUser: (state, action) => {
            state.userId = action.payload.userId;
            state.userName = action.payload.userName;

            localStorage.setItem('userId', action.payload.userId);
            localStorage.setItem('userName', action.payload.userName);
        },
        logout: (state) => {
            state.userId = null;
            state.userName = '';

            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
        }
    },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;