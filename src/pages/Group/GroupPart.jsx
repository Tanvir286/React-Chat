import "./Group.css"
import { getDatabase, ref, push,set } from "firebase/database";
import React, { useState } from 'react';
import MyGroup from "../../component/GroupItem/MyGroup";
import OthersGroup from "../../component/GroupItem/OthersGroup";
import GroupInvition from './../../component/GroupItem/GroupInvition';
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { GrGroup } from "react-icons/gr";
import { AiOutlineGroup } from "react-icons/ai";
import { RiCommunityLine } from "react-icons/ri";
import { IoIosArrowDropright } from "react-icons/io";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useSelector } from 'react-redux';
import { Hourglass } from 'react-loader-spinner'
import complete from "../../assets/Done.png"

const GroupPart = () => {
   // This is Modal part start
   const style = {
   position: 'absolute',
   top: '50%',
   left: '50%',
   transform: 'translate(-50%, -50%)',
   width: 400,
   bgcolor: 'background.paper',
   borderRadius: '10px',
   boxShadow: 24,
   pt: 2,
   px: 4,
   pb: 3
   }
     
   const db = getDatabase();
   const [isHovered, setIsHovered] = useState(false);
   const [activeIndex, setActiveIndex] = useState(null);
   const [inputValue, setInputValue] = useState('');
   const [loading, setLoading] = useState(false);
   const [view,setView] = useState(true);
   const [groupDone,setgroupDone] = useState(false);
   const [open, setOpen] = React.useState(false);
   const handleClose = () => setOpen(false);
   const handleInputChange = (e) => setInputValue(e.target.value);

   /*======= Active User ==========*/
   let ActiveUser = useSelector(state=>state.user.value)
   console.log(ActiveUser); 
   console.log(ActiveUser); 
   /*======= Active User ==========*/
 
   const icons = [
    <GrGroup />,
    <AiOutlineGroup />,
    <RiCommunityLine />,           
   ];

   const handleOpen = () => {
        setOpen(true);
        setgroupDone(false);
        setView(true);
    }

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    
    const handleSetActive = (index) => {
        setActiveIndex(index);
    };

    const renderComponent = () => {
        switch (activeIndex) {
            case 0:
                return <MyGroup/>;
            case 1:
                return <OthersGroup />;    
            case 2:
                return <GroupInvition />;
            default:
                return <MyGroup/>;
        }
    };
    /* ===========================
         Create Group  Strat
    =============================*/
    console.log(ActiveUser.PhotoUrl);

    let CreateGroup = () => {
        // Ensure adminPhoto exists
        if (!ActiveUser.PhotoUrl || !isValidUrl(ActiveUser.PhotoUrl)) {
            alert('Admin photo not found. Please provide a valid photo URL.');
            return; // Stop execution if the photo URL is not valid
        }
    
        setgroupDone(false);
        setLoading(true);
        setView(false);
        
        set(push(ref(db, 'groups/')), {       
            groupName: inputValue,
            groupPhoto: 'https://firebasestorage.googleapis.com/v0/b/fancode-3cc57.appspot.com/o/avater%2Fgroup-young-men-women-standing-600nw-1130032799.webp?alt=media&token=7410fcaf-3180-4143-8be1-888d01c2d1aa',
            adminName: ActiveUser.displayName,
            adminID: ActiveUser.uid,
            adminPhoto: ActiveUser.PhotoUrl
        }).then(() => {
            setTimeout(() => {
                setLoading(false);
                setInputValue('');  
                setgroupDone(true);     
            }, 2000);
        });        
    }
    
    // Function to validate if a URL is properly formatted
    const isValidUrl = (urlString) => {
        try {
            new URL(urlString);
            return true;
        } catch (error) {
            return false;
        }
    }
    
    /* =========================
          Create Group  End
    ==========================*/
    return (
        <div className='Main'>
            <div className="left">
             {/* Left Upper  or top part */}
             <div className='left-upper'>
                 <div className="one">
                    <h2>Groups</h2>
                 </div>
                 <div className="two" 
                    onMouseEnter={handleMouseEnter} 
                    onMouseLeave={handleMouseLeave}>
                    <AiOutlineUsergroupAdd className='icon-left-one-friend'
                     onClick={handleOpen} 
                    />
                 </div>
                 {isHovered && 
                  <span className="show">Create a new group</span>}
             </div>
             {/* Left Upper or top part*/}
             {/* Left Down  or bottom part*/}
             {['My Groups', 'Others Group', 'Group invitation'].map((item, index) => {
              return (
              <div 
               key={index} 
               className="left-down"
               style={activeIndex === index ? { backgroundColor: '#becde6' } : {}}
               onClick={() => handleSetActive(index)}>
                           
               <div className='left-down-firstpart'>
                 <div className='left-down-partone'>
                     <div className="icon-left-down1">{icons[index] }</div>                                 
                       <h4 className="left-down-title">{item}</h4>
                    </div>                           
                    <IoIosArrowDropright className='icon-left-down' />                              
                 </div>
              </div>
                 );
                })}
           </div>
            {/* Left Down or bottom part*/}
            <div className='right'>
              {renderComponent()}
            </div>
          {/* ===========================
              This is Modal Box Start
          ==============================*/}

            <Modal
             open={open}
             onClose={handleClose}>
  
            <Box sx={style}>
             {view &&
             <Typography 
              id="modal-modal-title" 
              variant="h6" 
              component="h2" 
              className="modal-title">
                   Create A New Group
              </Typography>
              }
              
              {view &&
               <div> 
                   <input type="text" 
                    className="modal-input" 
                    onChange={handleInputChange}
                    value={inputValue} />        

                    <div className="grouppartbtn">         
                    <button className="button-34" 
                     onClick={CreateGroup} >
                    Add Group
                    </button>

                    <button className="button-35"
                     onClick={handleClose} >
                     Cancle
                    </button>
                    </div>
                </div>
                }
              
             {/* Loading Part Start */}
             <div style={{textAlign: "center"}}>
              { loading &&
                 <Hourglass
                 visible={true}
                 height="180"
                 width="180"
                 textAlign="center"
                 colors={['#306cce', '#72a1ed']}/> }             
               { loading &&
                <h1>Wait A few Moment</h1>
                }
            </div>       
            {/* Loading Part Start */}


            {/* Complete Box start */}
            { groupDone &&
              <div className="completeBox">
                  <img src={complete}   
                   className="completeImg" />
                  <h2 className="complete-title">
                   You have successfully create a group
                  </h2>
                  <button className="button-36" 
                   onClick={handleClose}>
                   Close
                  </button>
              </div>
            }
            {/* Complete Box end*/}

            </Box>

           </Modal>

          {/* ============================
                This is Modal Box End
           ============================*/}




        </div>
    );
};

export default GroupPart;