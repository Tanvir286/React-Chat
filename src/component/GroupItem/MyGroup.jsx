import React, { useState , createRef, useEffect} from 'react';
import { getDatabase, ref as refOne, onValue, set, push, remove, ref as databasaRef } from "firebase/database"; // Added update for editing
import { getAuth, updateProfile } from "firebase/auth";
import { getStorage, uploadString , getDownloadURL,ref } from "firebase/storage";
import { useSelector } from 'react-redux';
import {  toast } from 'react-toastify';
import { ThreeCircles } from 'react-loader-spinner'
import { AiTwotoneDelete } from "react-icons/ai";
import "./GroupItem.css"
import { PiDotsThreeOutlineVerticalLight } from "react-icons/pi";
import { GrGroup } from "react-icons/gr";
import Nature from "../../assets/Nature.jpg"
import { FaEdit } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { MdOutlinePhotoCameraBack } from "react-icons/md";
import { RiFileSearchLine } from "react-icons/ri";
import { MdDone } from "react-icons/md";

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";


const MyGroup = () => {

  const style = {
    position: 'absolute',
    top: '50%',
    left: '55%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height: '70%', 
    bgcolor: 'background.paper',
    boxShadow: 12,
    p: 2,
    overflowY: 'auto', 
  };

  const style2 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height: '40%', 
    bgcolor: 'background.paper',
    boxShadow: 12,
    p: 2,
    overflowY: 'auto', 
  };

  const style3 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 12,
    p: 2,
    overflowY: 'auto', 
  };

  
  
    const db = getDatabase();
    const auth = getAuth();
    const storage = getStorage();

     /*Upload file fireBase*/
   
     let active = useSelector((state)=>state.user.value );
     console.log(active.uid);

    const [grouplist,setGrouplist] = useState([]);
    const [groupMembers,setGroupMembers] = useState([]);
    const [groupRequestlist,setgroupRequestlist] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState([]);
    const [loader,setLoader] = useState(false);
    const [deleteGroupId, setDeleteGroupId] = useState();
    const [sob,setSob] = useState([]);



    console.log(sob.groupPhoto);
    
    // console.log(selectedGroupId);
    // console.log(sob.groupId);
    // console.log(grouplist);
    

    const [clickgroup,setClickgroup] = useState("");

    // const [AllMembers, setAllMembers] = useState(true);
    const [membersRequest, setmembersRequest] = useState(false);
    const [memberlistShow, setmemberlistShow] = useState(true);
    const [activeButton, setActiveButton] = useState('AllMember');
    // const [groupInvitation, setgroupInvitation] = useState(true);
         
    /* Modal Part Start*/
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    /* Modal Part End*/
    /* Edit Modal Part Start*/
    const [editOpen, setEditOpen] = React.useState(false);
    const handleEditOpen = () => setEditOpen(true);
    const handleEditClose = () => setEditOpen(false);
    const [editGroupName, setEditGroupName] = useState("");
    /* Edit Modal Part End*/
    /* Third Modal Part Start */
    const [open3, setOpen3] = React.useState(false);
    const handleOpen3 = () => setOpen3(true);
    const handleClose3 = () => setOpen3(false);
    /* Third Modal Part End */
    /* Fourth Modal Part Start */
    const [open4, setOpen4] = React.useState(false);
    const handleOpen4 = () => setOpen4(true);
    const handleClose4 = () => setOpen4(false);

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

    const getCropData2 = () => {

        /*firebase  64 bit photo upload from String here  */
        setLoader(true);
       
       const storageRef = ref(storage,`profile-${active.uid}`);

        console.log(storageRef);
        
        console.log(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());

        const groupPhoto = cropperRef.current?.cropper.getCroppedCanvas().toDataURL();
        const groupPhotoRef = ref(storage, "group photo/" + `groupphoto-${selectedGroupId}`);
        uploadString(groupPhotoRef, groupPhoto, 'data_url').then((snapshot) => {
      
         getDownloadURL(groupPhotoRef).then((downloadURL2) => {          
            console.log(downloadURL2);         
            set(databasaRef(db, "groups/" + selectedGroupId),{
              adminID:sob.adminID,
              adminName:sob.adminName,
              adminPhoto:sob.adminPhoto,
              groupName:sob.groupName,
              groupPhoto: downloadURL2
            })
         
           .then(()=>{
            handleClose();
            handleClose3();
            setLoader(false);
            console.log('done');
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
     /*==========( Image Crop Item Start )===========*/

    /*================================== 
            Handle View Group    
    ===================================*/
    const handleGroupView = (item) => {
      console.log(item);
      setSelectedGroup([item]);
      setClickgroup(item.groupName);
      setmemberlistShow(true);
      setmembersRequest(false);
      handleOpen(); 
      setActiveButton('AllMember');
      };
     /*================================== 
             Handle View Group    
    ===================================*/
     /*================================== 
            Handle Group Member Request    
    ===================================*/
    const handleGroupRequest = (item) => {
      setgroupRequestlist([item]);
      setmembersRequest(true);
      setmemberlistShow(false);
      setActiveButton('Request');
      };
     /*================================== 
             Handle Group
  
    /* =======(Active User  Start)=======*/
    
     let ActiveUser = useSelector(state=>state.user.value)
     console.log(ActiveUser);
     /* =======(Active User  End)========*/  

    /*================================== 
            Groups  List Read   
    ===================================*/          
    console.log(grouplist);
    useEffect(() =>{
      const groupRef = refOne(db, "groups");
      onValue(groupRef, (snapshot) => {
        const arr = []
        snapshot.forEach(item => {     
           if(ActiveUser.displayName == item.val().adminName){
               const data = item.val();
               arr.push({...item.val(),groupId:item.key}) 
           }
           });
      setGrouplist(arr)
     })
    },[])
   /*================================== 
            Groups  List Read   
    ===================================*/
   /*================================== 
         View   GroupsMember  List    
    ===================================*/
     console.log(groupMembers);
     useEffect(() => {
      const groupMemberRef = refOne(db, "groupMember");
      onValue(groupMemberRef, (snapshot) => {
        const arr = [];
        snapshot.forEach(item => {      
          const data = item.val();             
            arr.push({...data, id: item.key});           
          });
        setGroupMembers(arr);
        });   
     }, []); 
     /*================================== 
          View   GroupsMember  List    
     ===================================*/
     /*================================== 
        View   GroupsRequest  List Read   
     ===================================*/
    console.log(groupRequestlist);
    useEffect(() =>{
      const groupRequestRef = refOne(db, "groupRequest");
      onValue(groupRequestRef, (snapshot) => {
        const arr = []
        snapshot.forEach(item => { 
          const data = item.val();
          console.log(data);
           if(ActiveUser.displayName == item.val().adminName){
              arr.push({...item.val(),groupId:item.key}) 
           }
       });
      setgroupRequestlist(arr)
      })
    },[])
          
     /*================================== 
        View GroupsRequest  List Read  
     ===================================*/
     /*================================== 
              Handle View Group  
     ===================================*/ 
     
     const handleViewGroup = (item) => {
      console.log(item);
      setSob(item)
      setSelectedGroup([item]);
      setSelectedGroupId(item.groupId)
      setClickgroup(item.groupName);
      setmemberlistShow(true);
      setmembersRequest(false);
      handleOpen(); 
      setActiveButton('AllMember');
      };
     /*================================== 
             Handle View Group     
     ===================================*/
     /*================================== 
             Handle Start Group     
     ===================================*/
     /*================================== 
             Handle Start Group     
     ===================================*/
     let handleStart =(item) =>{
         console.log(item);
         handleOpen4()
         setDeleteGroupId(item.groupId)
     }
     /*================================== 
             Group Delete Start   
     ===================================*/
     let handleGroupRemove = () => {
        
        remove(refOne(db, 'groups/' +deleteGroupId ))
            .then(() => {

                toast.success('Group Delete Succesfully', {
                    position: "top-right",
                    autoClose: 2000,
                    theme: "light",  
                    }); 
            })
            handleClose4()
    }
    
     /*================================== 
              Group Delete End   
     ===================================*/
     /*================================== 
             Handle Member  Accept   
     ===================================*/
     const handleMemberAccept = (item) => {
        console.log(item); 
        set(push(refOne(db, 'groupMember' )), {       
            ...item,
        }).then(() => { 
          remove(refOne(db, 'groupRequest/' + item.groupId));
        })
     }
     /*================================== 
             Handle Member  Accept   
     ===================================*/
     /*================================== 
           Handle Member RejectList   
     ===================================*/
     let handleMemberReject = (item) => {
      console.log(item);
      remove(refOne(db, 'groupRequest/' + item.groupId));
     }
     /*================================== 
           Handle Member RejectList   
     ===================================*/
     /*================================== 
           click member request part   
     ===================================*/
     let clickMemberRequest = () =>{
     setActiveButton('MemberRequest');
     setmembersRequest(!membersRequest);
     setmemberlistShow(false);
     }
     /*================================== 
           click member request part   
     ===================================*/
     /*================================== 
          click member list show part   
     ===================================*/
     let clickMemberListShow = () =>{
     setActiveButton('AllMember');
     setmemberlistShow(!memberlistShow);
     setmembersRequest(false);
     }
     /*================================== 
          click member list show part   
     ===================================*/
    
     /*================================== 
          Second modal with edit part  
     ===================================*/
     const handleEditGroup = (e) => {
      setEditGroupName(e.target.value);
    };
    
    const handleSaveChanges = () => {
      
      updateProfile(auth.currentUser, {
        groupName: editGroupName,            
      }).then(() => {
        return set(databasaRef(db, "groups/" + selectedGroupId), {
          adminID:sob.adminID,
          adminName:sob.adminName,
          groupName:editGroupName,
          groupPhoto: sob.groupPhoto
             });
      }).then(() => {
        toast.success('Update A New Groupname', {
            position: "top-right",
            autoClose: 2000,
            theme: "light",  
            }); 
        // Handle successful save, e.g., show a success message
        console.log('Profile updated successfully!');
        handleClose()
        handleEditClose(); 
      }).catch((error) => {
        // Handle errors here
        console.error('Error updating profile:', error);
      });
    };
    
   /*================================== 
          Second modal with edit part  
     ===================================*/
   /*================================== 
         group Removie People Start  
     ===================================*/
     
     const handleGroupRemovePeople = (item) => {

        console.log(item.id); 
        remove(refOne(db, 'groupMember/' + item.id));
    };
    
   /*================================== 
         group Removie People end   
     ===================================*/
    return (
        <div className='groupcontainer'>        
          {/* Title Holder Part */}
          <div className="grouptitleholder">
            <h2 className='titleheading'>My Group</h2> 
            <GrGroup className='groupTitleIcon' />
          </div>        
          {/* Title Holder Part */}
          {/*This is Empty List*/}
          { grouplist.length == 0 &&
            <h1 className='emptyGroup'>you don't have any group  at the moment</h1>
          } 
          {/*This is Empty List*/}
          {/* GroupList */}
          <div className='groupbox'>
             {grouplist.map((item,index) => {
             console.log(item);
             return(
              <div className='groupbox-inner' key={index}>
                 {/* This is toppart */}
                <div className="toppart">

                      <div className="group-leftItem">
                          <img src={item.groupPhoto} alt="" className='groupimg' />
                      </div>
                   
                      <div className="group-rightItem">
                          
                           <div className='group-rightItem1'>
                               <h2 className='groupHeading'>{item.groupName}</h2>
                               <p className='groupmember' >                        
                               {groupMembers.filter(member => member.groupName === item.groupName).length} member </p>
                           </div>
 
                           <div className='group-rightItem2'>
                            
                             <div className='groupbtn'>
                              <button className='button-22 tect' 
                                onClick={()=>handleViewGroup(item)} >
                                   view Group
                             </button>
                                                    
                             </div>

                             <div className='icon'>
                             <PiDotsThreeOutlineVerticalLight onClick={()=>handleStart(item)} className="dotIcon" />
                            </div>

                           </div>
                        
                      </div>

                      
                    
                </div>
                {/* This is toppart */}
               
                {/* This is GroupBtn */}             
                </div>
                )
                })
                }
          </div>
          {/* GroupList */}


          {/*=============================
              View group modal start 
          ============================= */}
  
          <Modal 
          
           open={open}
           onClose={handleClose}
           >      
           <Box sx={style}>
              {/* This is Banner Picture */}
               <div className='banner-image'>
                 <img src={Nature} alt="" className='modal-img' /> 
                <img src={sob.groupPhoto} alt="" className='ProfilePhotoRound' />
                </div>
              {/* This is Banner Picture */}

              {/* Group Name Part start */}
              {selectedGroup.map((group, index) => (
              <div key={index} className='viewgroupHeading'> 

               <h2>{group.groupName}</h2>  
             
               <div className='viewgroupHeadingRight'>
                  <button className='adminButton'>Admin</button>
                  {/* <FaEdit className='adminIcon' onClick={handleEditOpen} />  */}
                  <MdOutlinePhotoCameraBack className='adminIcon' onClick={handleOpen3} />
               </div>
                      
             </div>
             ))}
             {/* Group Name Part start */}

                  
             {/*  View member  List Part Start */}
             <div className='viewmember'>
                
             <button
             className={`viewbtn ${activeButton === 'AllMember' ?
                       'active' : ''}`}
             onClick={clickMemberListShow} >
             All Member
             </button>  

            <button
            className={`viewbtn ${activeButton === 'MemberRequest' ? 
                     'active' : ''}`}
            onClick={clickMemberRequest}>
            Member Request
            </button>      

            <button
            className={`viewbtn ${activeButton === 'GroupInvitation' ?
                      'active' : ''}`}
            onClick={() => setActiveButton('GroupInvitation')}>
            Group Invitation
            </button>    
            </div>
            {/*View member  List Part Start */}
 

            {/* ================================
                Member Request List Part Start 
              ================================*/}
            

            { membersRequest && 
              <>
               <div className="memberRequest">
               { selectedGroup.length > 0 &&
                 groupRequestlist.length > 0 &&
                 groupRequestlist.filter(request => 
                 request.groupName == selectedGroup[0].groupName)
                 .map((item, index) => {
                 console.log(item);
                 return (
                 <div key={index} className='viewgroupRequest'>
                     <div className='viewgroupRequestHeading'>
                        {/* member image */}
                        <img src={item.userPhoto}  className='viewgroupRequestPhoto' />
                        {/* member image */}
                        {/* member Heading */}
                        <h4 className='viewgroupheading'>{item.username}</h4>
                        {/* member Heading */}
                      </div>
                       {/* accept & reject button */}
                      <div className='viewgroupRequestbtn'>            
                        <MdDone  className='viewBtn1' 
                         onClick={() => handleMemberAccept(item) } />
                        <RxCross1 className='viewBtn2'
                         onClick={() => handleMemberReject(item)} />                       
                      </div>
                       {/* accept & reject button */}
                  </div>
                  );
                  })
                  }           
               </div>
               <div className="requestmemberlist">
               <div className='totalMembers'>
              {groupRequestlist.filter(member => member.groupName === clickgroup).length === 0 
               ? <h1 style={{ marginTop:"50px",color:"brown",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"300"}}> <RiFileSearchLine /> no memberRequest found</h1> 
               : <h2 style={{ color:"green"}} >Total Members Request: {groupRequestlist.filter(member => member.groupName === clickgroup).length}</h2>
               }
             </div>
               </div>
              </>
             }
            {/* ================================
                Member Request List Part End
             ================================*/}
            {/* ================================
                  All Member List Part Start
             ================================*/}     
            
            {memberlistShow &&
              <div className='memberList'>
                {groupMembers
                 .filter(member => member.groupName === clickgroup)
                 .map((member, index) => (
                <div key={index} className='groupMember'>
                 <div className='flsx'>
                 {/* member photo */}
                 <img src={member.userPhoto} className='groupMemberPhoto' alt={`${member.username}'s photo`} />
                {/* member photo */}
                {/* member name */}
                <h4 className='groupMemberName'>{member.username}</h4>
                {/* member name */}
                 </div>

               <AiTwotoneDelete
               className='groupMemberDeleteIcon'
               onClick={() => handleGroupRemovePeople(member)}  // Wrap in anonymous function
                />
           </div>
          ))
          }

     {/* total member list */}
     <div className='totalMembers'>
       {groupMembers.filter(member => member.groupName === clickgroup).length === 0 
         ? (
           <h1 style={{
             marginTop: "50px",
             color: "brown",
             display: "flex",
             alignItems: "center",
             justifyContent: "center",
             fontWeight: "300"
           }}>
             <RiFileSearchLine /> no member found
           </h1>
         ) : (
           <h2 style={{ color: "green", borderTop: "1px solid black" }}>
             Total Members: {groupMembers.filter(member => member.groupName === clickgroup).length}
           </h2>
         )
       }
     </div>
               </div>
            }

           
           {/* total member list */}
           {/* ================================
              All Member List Part Start
          ================================*/}
           </Box>
           </Modal>

          {/*=============================
                View group modal end
          ============================= */}
          {/*=============================
                This is Edit Modal Start
          ============================= */}
          <Modal
           open={editOpen}
           onClose={handleEditClose}
           aria-labelledby="modal-modal-title"
           aria-describedby="modal-modal-description"
           >
           <Box sx={style2}>
            <h1 className="second-modal-header">Edit Group Name</h1>
             <div className="edit-group-modal">  
              <input
                type="text"
                value={editGroupName}
                onChange={handleEditGroup}
                placeholder="Enter new group name"
                className="edit-input"
               />
              <button onClick={handleSaveChanges} className="save-button"> Save Changes</button>
             </div>
           </Box>
          </Modal>
         {/*=============================
                This is Edit Modal Start
          ============================= */}
          {/*=============================
                This is third Modal Start
          ============================= */}
          {/* Third Modal */}
          <Modal open={open3} onClose={handleClose3}>
           <Box sx={style3}>
            <h1 className="second-modal-header">Edit Profile Picture</h1>
            <div className="edit-group-modal">
                
            <input type="file"  onChange={handleImageUpload} />

             {  image &&
                   <Cropper
                   ref={cropperRef}
                   style={{ height: 250, width: "100%" }}
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
              { image && !loader &&
                   <div className="box" style={{ width: "50%", float: "left"   }}> 
                     <h2 style={{marginLeft: "15px"}} >Preview</h2>  
                     <div className="img-preview" style={{ width: "120px",  height: "120px" ,borderRadius: "50%"}}/>
                   <button style={{ float: "left", padding: "10px" , marginTop: "5px" , marginLeft: "15px" , cursor: "pointer" }} onClick={getCropData2}> Submit Image</button>
                 </div>
              }
               
            
                {/* This is Preview Part */}
                { loader &&
                   <ThreeCircles
                   visible={true}
                   height="100px"
                   width="100px"
                   color="#4fa94d"
                   ariaLabel="three-circles-loading"
                   wrapperStyle={{}}
                   wrapperClass=""
                   className="three-circles"
                   />
                }
          
            </div>
           </Box>
          </Modal>

         {/*=============================
                This is third Modal Start
          ============================= */}
         {/*=============================
                This is fourth Modal Start
          ============================= */}
         <Modal open={open4} onClose={handleClose4}>
          <Box sx={style3}>
          <h1 className="second-modal-header">Delete Group Name</h1>
          <div className="edit-group-modal">
           <p className="modal-description">
           Are you sure you want to delete this group? This action cannot be undone.
           </p>
           <div className="modal-buttons">
              <button className="confirm-btn" onClick={handleGroupRemove} >
               Confirm
             </button>
             <button className="close-btn" onClick={handleClose4}>
              Close
               </button>
            </div>
           </div>
           </Box>
          </Modal>

         {/*=============================
                This is fourth Modal Start
          ============================= */}


        </div>
     );
};

export default MyGroup; 