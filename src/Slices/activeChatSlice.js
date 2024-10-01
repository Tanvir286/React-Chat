import { createSlice } from '@reduxjs/toolkit';

export const activeChatSlice = createSlice({
    name: 'activeChat', // Ensure the name is correct
    initialState: {
        value: null,
    },
    reducers: {
        activeChatUser: (state, action) => {
            state.value = action.payload;
            console.log("Active chat updated:", state.value);
        },
    },
});

// Export action creators and the reducer
export const { activeChatUser } = activeChatSlice.actions;
export default activeChatSlice.reducer; // Ensure default export
