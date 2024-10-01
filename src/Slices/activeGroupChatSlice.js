import { createSlice } from '@reduxjs/toolkit';

export const activeGroupChatSlice = createSlice({
    name: 'activeGroupChat', // Ensure the name is correct
    initialState: {
        value: null,
    },
    reducers: {
        activeGroupChatUser: (state, action) => {
            state.value = action.payload;
            console.log("Active chat updated:", state.value);
        },
    },
});

// Export action creators and the reducer
export const { activeGroupChatUser } = activeGroupChatSlice.actions;
export default activeGroupChatSlice.reducer; // Ensure default export
