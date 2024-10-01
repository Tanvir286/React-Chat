import { configureStore } from '@reduxjs/toolkit';
import userSlice from './Slices/userSlice'; // Ensure this is correct
import activeChatReducer from './Slices/activeChatSlice'; // Ensure you're importing the reducer
import activeGroupChatSlice from './Slices/activeGroupChatSlice';

export default configureStore({
    reducer: {
        user: userSlice,
        activeChat: activeChatReducer,
        activeGroupChat:activeGroupChatSlice 
    },
});
