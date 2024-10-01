import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    value: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
   
  },
  reducers: {
    activeUser: (state,action) => {
         state.value = action.payload;
         console.log("ami active",state.value);

    },
  },
})

// Action creators are generated for each case reducer function
export const { activeUser } = userSlice.actions

export default userSlice.reducer