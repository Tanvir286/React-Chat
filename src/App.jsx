import React from 'react';
import { Route,
         RouterProvider, 
         createBrowserRouter, 
         createRoutesFromElements }
       from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Registration from './pages/Registration';
import ForgotPassword from './pages/forgotPassword/ForgotPassword';
import Root from './pages/root/Root';
import Message from './pages/Message/Message';
import FriendPart from './pages/FriendPart/FriendPart';
import GroupPart from './pages/Group/GroupPart';
import ProfileUpdate from './pages/Profile/ProfileUpdate';

const App = () => {

    
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route >
        <Route path="/" element={<Registration/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/forgotpassword" element={<ForgotPassword/>}></Route>
        <Route path="/home" element={<Root/>}> 
          <Route path="/home" element={  <FriendPart/>}></Route>        
          <Route path="Message" element={ <Message/>}></Route>
          <Route path="Profile" element={ <ProfileUpdate/>}></Route>
          <Route path="Group" element={ <GroupPart/>}></Route>
        </Route>                
     </Route>)
  );  
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>  
  );
};
export default App;