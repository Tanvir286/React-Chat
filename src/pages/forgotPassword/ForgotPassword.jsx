import React, {useState} from 'react';
import "./ForgotPassword.css"
import TextField from '@mui/material/TextField';
import {  useNavigate , Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import {  toast } from 'react-toastify';

import ForgotPic from "../../assets/forgotPassword.png"
import Logo from '../../assets/logo.png'

const ForgotPassword = () => {
 
    const auth = getAuth();
    let navigate = useNavigate();
    const [email, setEmail] = useState("");

    let handleSubmit = () => {

        sendPasswordResetEmail(auth, email)
        .then(() => {
            toast.success('Please check your email', {
                position: "top-right",
                autoClose: 5000,
                theme: "light",  
                });

                setTimeout(() => {
                    navigate('/login');
                }, 2000);
        })
        .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error.message);
     });
    }


    return (
        <div className='forgotBox'>
  
              <div className='right-forgot'>
                    <div className="shadow">

                         <img src={Logo} alt="" />
                         <h1 style={{color:"#20415c",marginBottom:"10px"}} >Forgot your password</h1>
                         <p  style={{color:"#20415c",marginBottom:"10px",width:"330px"}} >Please enter the email address you'd like your password reset own your email.</p>
                         
                        {/* Input Field Here  */}
                         <TextField id="outlined-basic" label="Enter your Email" variant="outlined" onChange={(e)=>setEmail(e.target.value)}  />
                         {/* Input Field Here  */}
                         {/* Button part Here  */}
                         <button className='forgot_submit' onClick={handleSubmit} >Request reset link</button>
                         {/* Button part Here  */}
                         <div className='Forgot-link'>
                             <Link to="/login" > Back To Login  </Link>
                         </div>
                    </div>
              </div>
             
        </div>
    );
};

export default ForgotPassword;