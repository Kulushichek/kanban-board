import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userId: localStorage.getItem('userId') || null,
        username: localStorage.getItem('username') || '',
    },
    reducers: {
        setUser: (state, action) => {
            state.userId = action.payload.userId;
            state.username = action.payload.username;

            localStorage.setItem('userId', action.payload.userId);
            localStorage.setItem('username', action.payload.username);
        },
        logout: (state) => {
            state.userId = null;
            state.username = '';

            localStorage.removeItem('userId');
            localStorage.removeItem('username');
        }
    },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;