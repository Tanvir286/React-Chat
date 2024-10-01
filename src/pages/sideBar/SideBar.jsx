import React, { useState , createRef, useEffect} from 'react';
import Image from '../../component/Image';
import {  toast } from 'react-toastify';
import "./SideBar.css"
import SideBarIcon from '../../component/SideBarIcon';
import { IoHomeOutline , IoNotificationsSharp } from "react-icons/io5";
import { MdOutlinePersonPin } from "react-icons/md";
import { AiFillMessage } from "react-icons/ai";
import { ImProfile } from "react-icons/im";
import { useNavigate,Link,useLocation } from 'react-router-dom';
import { getDatabase,set,ref as databaseRef,onValue } from "firebase/database";
import { getStorage, uploadString , getDownloadURL,ref} from "firebase/storage";
import { getAuth, signOut,updateProfile } from "firebase/auth";
import { ThreeCircles } from 'react-loader-spinner'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { IoSettingsOutline } from "react-icons/io5";
import { useDispatch,useSelector } from 'react-redux';
import { activeUser } from '../../Slices/userSlice';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
  
    bgcolor: 'background.paper',
    border: '2px solid transparent',
    boxShadow: 14,
    p: 4,
  };


  const SideBar = () => {

    const db = getDatabase();
    const auth = getAuth();

    /*Upload file fireBase*/
    const storage = getStorage();
    
    /*Upload file fireBase*/
   
    let dispatch = useDispatch();
    let active = useSelector((state)=>state?.user?.value );
    console.log(active);

    console.log(active.PhotoUrl);
    console.log(active.displayName);
     
    /*  Icon Loadind  */

    const [loading, setLoading] = useState(false);
    const [user,setUser] = useState('');
   
    console.log(user);
    
    useEffect(()=>{
        
    },[])

  
    let location = useLocation();
    let navigate = useNavigate();

    /* First Modal Part Here */
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    /* First Modal Part Here */

    /* Second Modal Part Here */
    const [SecondModal, setSecondModal] = React.useState(false);
    const handleSecondModalOpen = () =>  setSecondModal(true);
    const handleSecondModalClose = () =>  setSecondModal(false);
    /* Second Modal Part Here */

    
    /*👑==========(  Here UserList  Read Here  Start )===========👑*/
     useEffect(() => {
         
      const useRef = databaseRef(db, 'users');
     onValue(useRef, (snapshot) => {
       
      const arr = [];
      snapshot.forEach(item => {
       const data = item.val();
       console.log(data.username);
       if(active.displayName === data.username ){
        arr.push(data.photoURL);
        console.log(arr);
       }

       setUser(arr)
      });
     });

     },[])
    /*==========(  Here UserList  Read Here End )===========*/
     /*👑==========( handle Logout Start )===========👑*/

     let handleLogout = () => {
        signOut(auth).then(() => {
             /* When logut click then local storage and activeUser null  */
             localStorage.removeItem("user");
             dispatch(activeUser(null));
             /* When logut click then local storage and activeUser null  */
             navigate('/login');
            }).catch((error) => {
            // An error happened.
            console.log(error); 
            });
     }
     /*==========( handle Logout end )===========*/
     /*👑==========( Image Crop Item Start )===========👑*/
  
     const [image, setImage] = useState('');
     const cropperRef = createRef();
    
    
     let handleImageUpload = (e) =>{

        let files = e.target.files;
      
        const reader = new FileReader();
        reader.readAsDataURL(files[0]); 
        reader.onload = () => {
          setImage(reader.result);
          console.log(reader);
          console.log(reader.result);
        };
      };

    
      const getCropData = () => {

        /*firebase  64 bit photo upload from String here  */

        setLoading(true);

        const storageRef = ref(storage,`profile-${active.uid}`);

        console.log(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());

        const message4 = cropperRef.current?.cropper.getCroppedCanvas().toDataURL();
        uploadString(storageRef, message4, 'data_url').then((snapshot) => {
         console.log('Uploaded a data_url string!');
         console.log("running");
         

         /*Create a downloable url */

         getDownloadURL(storageRef).then((downloadURL) => {
          console.log('File available at', downloadURL);
                
          updateProfile(auth.currentUser, {
             photoURL:  downloadURL ,            
          }).then(() => {
             set(databaseRef(db,"users/" +active.uid ),{
              username:active.displayName,
              email:active.email,
              photoURL: downloadURL,
             })
          })
           .then(()=>{
            setSecondModal(false)
            setLoading(false)
            console.log('done');
            localStorage.setItem('user',JSON.stringify({...active, photoURL: downloadURL}));
            dispatch( activeUser({...active, photoURL: downloadURL}));
            toast.success('Update A New Profile Picture', {
              position: "top-right",
              autoClose: 2000,
              theme: "light",  
              }); 
          })
          
        });
    
        
        });

        /*firebase 64 bit photo upload here */
      }
    /*==========( Image Crop Item End )===========*/

      console.log(location.pathname);

    return (
        <div className='MainBar'>

              {/*◁==========( Logo Part Start here 🚩)===========*/}     
              <Image imageName="SideBarLogo.png" className="sideLogo" />
              {/*◁==========( DashBorad Part here)===========*/}
             
              {/*◁==========( Icon Part Start here 🚩)===========*/} 
              <div className='Sideicon'>
              
                <Link to="/home/message" className={location.pathname == "/home/message" ? "active" : "" } > <SideBarIcon  Iconname={<AiFillMessage />}  Deatils="Chat" className="SideBarIcon"  /> </Link>
            
                <Link to="/home" className={location.pathname == "/home" ? "active" : "" } > <SideBarIcon  Iconname={<IoHomeOutline />}  Deatils="Friends" className="SideBarIcon"  /> </Link>
          
                <Link to="/home/Group"  className={location.pathname == "/home/Group" ? "active" : "" } > <SideBarIcon  Iconname={<IoSettingsOutline />}  Deatils="Group" className="SideBarIcon"  /> </Link>
              
                <Link to="/home/Profile"  className={location.pathname == "/home/Profile" ? "active" : "" } > <SideBarIcon  Iconname={<MdOutlinePersonPin />}  Deatils="Edit Profile" className="SideBarIcon"  /> </Link>
          
               

              </div>
            
             {/*◁==========( 🔚 Icon Part End here)===========*/}
           
             {/*◁==========( Profile Icon with logout 🚩)===========*/}
                      
             <div className='profile'>

               <div className='profile-flex'>
                 {/* profile picture */}
                 <div className='profile-pic'>                
                   <img src={user} onClick={handleSecondModalOpen} alt="" style={{ width: "60px", height: "60px" , borderRadius: "50%", marginTop: "15px", cursor: "pointer" , border: "1px solid black"}} />
                 </div>
                  {/* profile picture */}
                  {/* Edit profile part*/}
                 <div className='inner-profile'>
                    <h4 style={{ textAlign: "center",color: "green" }}>{active.displayName}</h4>
                   
                 </div>
                  {/* Edit profile part*/}
               </div>

                <h3 className='logout' onClick={handleOpen}>Logout</h3>       
                
             </div>
             {/*◁==========( 🔚 Profile Icon with logout )===========*/} 
          

             {/*◁==========( This is Modal01 part 🚩)===========*/}
            <Modal  open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
              <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">Confirm Logout</Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>Change you made may not be saved</Typography>
        
              <div className='btn-log'>
                <button onClick={handleLogout} className='logout-button'>Confirm</button>
                <button onClick={()=>setOpen(false)} className='cancel-button' >Cancel</button>
              </div>
         
              </Box>
            </Modal>        
            {/*◁==========( 🔚 This is Modal01 part )===========*/} 
            {/*◁==========(  This is Modal02 part 🚩 )===========*/} 
            <Modal open={SecondModal} onClose={handleSecondModalClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
              <Box sx={style}>
              { !loading &&
               <Typography id="modal-modal-title" variant="h6" component="h2">Profile Upload Here</Typography>}
               <Typography id="modal-modal-description" sx={{ mt: 2 }}>
               
              {/* This is Croper Part Start Here */}

              {/* upload picture */}
              {  !loading &&
               <input type="file"  onChange={handleImageUpload} />}
              {/* upload picture */}
        
             { image &&
               <>
               { !loading &&
              <Cropper
                ref={cropperRef}
                style={{ height: 300, width: "100%" }}
                zoomTo={0.5}
                initialAspectRatio={1}
                preview=".img-preview"
                src={image}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false} 
                guides={true}
              />
             }
         
             {/* This is Preview Part */}
         
             <div className="box" style={{ width: "50%", float: "left"   }}> 
               <h1 style={{marginLeft: "15px"}} >Preview</h1>  
               <div className="img-preview" style={{ width: "150px",  height: "150px" ,borderRadius: "50%"}}/>
               <button style={{ float: "left", padding: "10px" , marginTop: "10px" , marginLeft: "15px" , cursor: "pointer" }} onClick={getCropData}> Submit Image</button>
             </div>
         
             {/* This is Preview Part */}

               </>
             }
           {/* Lodar Start */}
            <div className='three-circles'>
             { loading && 
               <ThreeCircles
               visible={true}
               height="200px"
               width="200px"
               color="#4fa94d"
               ariaLabel="three-circles-loading"
               wrapperStyle={{}}
               wrapperClass=""
               className="three-circles"
               />}
            </div>


             {/* This is Croper Part End Here */}
 
               </Typography>
             </Box>
          </Modal>
            {/*◁==========( 🔚 This is Modal02 part )===========*/}



        </div>
    );
};

export default SideBar;