
import React, { useEffect, useState } from 'react';
import { IoSend } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { getDatabase,ref, set, push, onValue, remove} from "firebase/database";
import './Message.css';  
import moment from 'moment'; 
import { GrEdit } from "react-icons/gr";
import { BsClock } from "react-icons/bs";
import { IoReturnDownForward } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { MdSendAndArchive } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import EmojiPicker from 'emoji-picker-react';
import groupChat  from '../../assets/groupChat.jpg'
import { DownloadOutlined } from '@ant-design/icons';
import { BiSolidLike } from "react-icons/bi";
import { RiCloseCircleLine,RiShareForwardFill } from "react-icons/ri";
import { TiArrowSortedDown } from "react-icons/ti";
import { MdOutlineEmojiEmotions,MdOutlineGifBox, MdOutlineCall} from "react-icons/md";
import { FaRegImage } from "react-icons/fa6";
import { IoSendOutline } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdVideocam } from "react-icons/io";
import { Modal ,Button} from 'antd';  // Import Ant Design Modal
/*=========(image upload first part start)============*/
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
const storage = getStorage();
/*=========(image upload first part end)============*/


const GroupChatting = () => {

     /*===========(  🌐 Firebase Database )=========*/
     const db = getDatabase();
     /*===========(  🌐 Firebase Database )=========*/
 
    /*==(🔤States for managing messages and users)======*/
     const [message, setMessage] = useState("");
     const [messageList, setMessageList] = useState([]);
     const [friendDetails, setFriendDetails] = useState([]);
    /*==(🔤States for managing messages and users)======*/
    
    console.log(messageList);
    
     
     /*===========================================
           ( input typing active start )
     =============================================*/
  
     let handleTyping = (e) => {
          console.log(e.target.value);
          setMessage(e.target.value);
        
     }   
 
 
     /*===========================================
            ( input typing active end )
     =============================================*/
     /*===========================================
           ( Message option  modal start )
     =============================================*/
 
     const [isModalOpen, setIsModalOpen] = useState(false); 
  
     const handleReplyClick = (item) => {
         // Set the selected message
         setIsModalOpen(true); // Show the modal
     };
 
     const handleModalClose = () => {
         setIsModalOpen(false);
        
     };
 
    /*===========================================
           ( Message option  modal end )
    =============================================*/
    /*===========================================
          ( forword modal  modal start )
    =============================================*/
 
    const [isForwordModalOpen, setForwordModalOpen] = useState(false); 
  
     const handleForwordOpen = (item) => {
         setForwordModalOpen(true);
         setIsModalOpen(false); 
     };
 
     const handleForwordClose = () => {
        setForwordModalOpen(false);
        
     };
     
     /*===========================================
          ( forword modal  modal end )
     =============================================*/
     /*============(Is Changing Icon)===========*/
    
     const [isChangingIcon, setIsChangingIcon] = useState(false);
     const [UpdateIcon, setUpdateIcon] = useState(false);
     const [replayoff, setReplayoff] = useState(true);
     const [replayIcon, setReplayIcon] = useState(false);
     let timeoutId;
 
     const handleFocus = () => {
     
         setIsChangingIcon(false);
         clearTimeout(timeoutId); 
       };
     
       const handleBlur = () => {   
         timeoutId = setTimeout(() => {
           setIsChangingIcon(true);
         }, 1000);
     }
     /*============(Is Changing Icon)===========*/
     /*==========(forword messages)=============*/
     const [forwardMessage, setForwardMessage] = useState(null);
     console.log(forwardMessage);
     
     // const handleMouseEnter = () => {
     //     setForwordhover(true);
     // };
 
     // const handleMouseLeave = () => {
     //     setForwordhover(false);
     // };
     /*==========(forword messages)=============*/
     /*==========(active and click person start)=============*/
     // Accessing active user and the selected chat user from the Redux store
     const activeUser = useSelector(state => state?.user?.value);
     const activeGroupChat = useSelector(state => state?.activeGroupChat?.value);
     const clickPerson = useSelector(state => state?.activeChat?.value);
     console.log(clickPerson);
     console.log(activeUser);
     console.log(activeGroupChat?.groupid);
     
     /*==========(active and click person end)=============*/
     /*==================================================
                       member find start
     ====================================================*/
     useEffect(() => {
         const findRef = ref(db, 'friends/');
         onValue(findRef, (snapshot) => {
             const arr = [];
             snapshot.forEach((item) => {
                 const data = item.val();
                 if (data.ReceivedID === activeUser.uid) {
                     arr.push({
                         friendName: data.sendName,
                         friendPhoto: data.SenderPhoto,
                         sendID: data.sendID,
                     }); 
                 } else if (data.sendID === activeUser.uid) {
                     arr.push({
                         friendName: data.ReceivedName,
                         friendPhoto: data.ReciverPhoto,
                         sendID: data.ReceivedID,
                     }); 
                 }
             });
             setFriendDetails(arr);
         });
     }, [activeUser.uid]); 
     /*==================================================
                       member find End
      ====================================================*/
     /*==================================================
                     handlechat Start part
      ====================================================*/
       const [emptyMessage,setemptyMessage] = useState("")
 
       const handleChat = () => {
         // Ensure there is a valid recipient and the user is active
         if (!activeGroupChat || !activeUser) {
             console.error("No recipient selected or user not active");
             return;
         }
 
         if(message == "" ){
           setemptyMessage("You can't send an empty message")
           return          
         }
 
         // Push the new message to Firebase database
         set(push(ref(db, 'groupmessage/')), {
             whoSendGroupMessageID: activeUser.uid,
             whoSendGroupMessageName: activeUser.displayName,
             whoSendGroupMessagePhoto: activeUser.PhotoUrl,
             groupName: activeGroupChat.groupname,
             groupId: activeGroupChat?.groupid,
             message: message,
             time: new Date().toLocaleString()
 
         }).then(() => {
             // Clear message input after sending
             setemojiShow(false);
             setemojiHover(true);
             setMessage("");
             setemptyMessage("");
             handleBlur();
         });
       };
  
      /*==================================================
                       handlechat End part
      ====================================================*/
      /*==================================================
                        Read message Start
      ====================================================*/

      
       useEffect(() => {
         // Ensure both the active user and chat recipient are selected
         if (activeUser && activeGroupChat?.groupid) {
             const msgRef = ref(db, 'groupmessage');
             onValue(msgRef, (snapshot) => {
                 const arr = [];
                 snapshot.forEach(item => {
                     const data = item.val();
                     console.log(data);
                     
                     if(data.groupId == activeGroupChat?.groupid){
                         arr.push({
                            ...data,ID:item.key
                         });
                     }   
                     // Filter messages between the active user and the selected chat user
                   
                   });
                 // Update the message list state
                  setMessageList(arr);
              });
          }
        }, [activeUser, activeGroupChat?.groupid]);
      /*==================================================
                        Read message end
      ====================================================*/
      /*==================================================
              handle forword start  before work
      ====================================================*/

    let [list1,setList] = useState([])
    let [list2,setList2] = useState([])
    const list3 = [...list1, ...list2];
    const filteredAdminGroups = list3.filter(group => activeUser.displayName != group.adminName); 
    
    /*=========(admin List Read)===========*/
   
    useEffect(() => {
        const groupRef = ref(db, "groups"); 
        onValue(groupRef, (snapshot) => {
            const arr = [];
            snapshot.forEach(item => {
                // Check if the active user is the admin of the group
                if (activeUser.displayName === item.val().adminName) {
                    const data = item.val();
                    // Push group data and group ID into the array
                    arr.push({ ...item.val(), groupID: item.key });
                }
            });
            setList(arr); // Set the admin list
        });
    }, []); // Dependencies

    /*=========(Member List Read)===========*/
   
     useEffect(() => {
        const groupRef = ref(db, "groupMember"); // Reference to "groupMember" in Firebase
        onValue(groupRef, (snapshot) => {
            const arr = [];
            snapshot.forEach(item => {
                // Check if the active user is a member of the group
                if (activeUser.displayName === item.val().username) {
                    const data = item.val();
                    // Push group member data into the array
                    arr.push({ ...item.val() });
                }
            });
            setList2(arr); // Set the group member list
        });
     }, []); // Dependencies

      /*=========(Member List Read)===========*/
      /*==================================================
              handle forword start  before work
      ====================================================*/
      /*==================================================
              handle forword start  with second modal
      ====================================================*/
 
 
       let handleForword = (item) => {
          setIsModalOpen(true); 
          setForwardMessage(item);
          console.log(item);       
        }
 
       let forwordmodelstart = () => {
          setForwordModalOpen(true); 
          setIsModalOpen(false); 
         }
 
       const handleModalForword2= (item) => {
         console.log(item);
         
         if (forwardMessage) {
             set(push(ref(db, 'groupmessage/')), {
                whoSendGroupMessageID: activeUser.uid,
                whoSendGroupMessageName: activeUser.displayName,
                whoSendGroupMessagePhoto: activeUser.PhotoUrl,
                groupName: item.groupName,
                groupId: item.groupID,
                 message: forwardMessage.message,
                 time: new Date().toLocaleString(),
                 forwardAdmin:activeUser.displayName
             }).then(() => {
                 setIsModalOpen(false);
                 setForwordModalOpen(false);
             })
         }
     };
      /*==================================================
                      handle forword end
      ====================================================*/
      /*==================================================
                      Message Delete Start
      ====================================================*/
 
      const handledeletemessage = () => {
         if (forwardMessage?.whoSendGroupMessageName === activeUser.displayName) {
             remove(ref(db, 'groupmessage/' + forwardMessage?.ID));
             setIsModalOpen(false); 
         } else {
             // Show unauthorized modal if the user is not allowed to delete the message
             setIsModalOpen(false);
             setAuthorizaOpen(true);
             return false;
         }
     };
     
      
      /*==================================================
                      Message Delete End
      ====================================================*/
      /*==================================================
                     handle Message edit start
      ====================================================*/

      console.log(forwardMessage);
      
 
      let handleMessageEdit = () =>{
 
          if(forwardMessage?.whoSendGroupMessageName === activeUser.displayName){
             setMessage(forwardMessage?.message);
             setIsModalOpen(false);
             setUpdateIcon(true)
          }else{
             setIsModalOpen(false);
             setAuthorizaOpen(true);
             return false
          }       
      }
 
 
      let handleMessageEditSubmit = () =>{
 
         const messageRef = ref(db, `groupmessage/${forwardMessage?.ID}`);
          
         set(messageRef, {
            ...forwardMessage,  
            message: message,           
            time: new Date().toLocaleString() 
        }).then(() => {
            console.log("Message updated successfully.");
            setMessage("");  
            setForwardMessage(null); 
            setUpdateIcon(false)
        })
 
      }
      /*==================================================
                     handle Message edit end
      ====================================================*/
      /*==================================================
                 Replay message Option  start
      ====================================================*/
  
      const [ReplayMessage,setReplayMessage] = useState("")
      const [showReplayMessage, setShowReplayMessage] = useState(true); 
      const [viewReplayBox, setViewReplayBox] = useState(false)
     
      let slicedText = ReplayMessage.slice(0, 15) + "..";
 
      let  ReplyMessageStart = () =>{
          console.log(forwardMessage?.message);
           setReplayMessage(forwardMessage?.message);
           setForwardMessage(null); 
           console.log(ReplayMessage);  
           setShowReplayMessage(true); 
           setIsModalOpen(false);
           setIsChangingIcon(false);
            setReplayIcon(true);
            setReplayoff(false);
            setViewReplayBox(true);
      }
 
      const handleCloseReplay = () => {
         setShowReplayMessage(false);  
         setReplayoff(true);
         setReplayIcon(false);
         setViewReplayBox(true);
       };
 
 
      const replayMessageDB = () =>{
 
         console.log(message);
         
          set(push(ref(db, 'groupmessage/')), {
             whoSendGroupMessageID: activeUser.uid,
             whoSendGroupMessageName: activeUser.displayName,
             whoSendGroupMessagePhoto: activeUser.PhotoUrl,
             groupName: activeGroupChat?.groupname,
             groupId: activeGroupChat?.groupid,
             message:message,
             time: new Date().toLocaleString(),
             replayBy:activeUser.displayName,
             replayMessage:slicedText
         }).then(() => {
             console.log("Replay message sent successfully.");
             setShowReplayMessage(false);
             setReplayMessage("");
             setIsModalOpen(false);
             setReplayIcon(false);
             setReplayoff(true);
             setMessage("");
         })
      }
      
      /*==================================================
                   Replay message Option end
      ====================================================*/
      /*==================================================
                  Emoji item option start
      ====================================================*/
      let [emojiShow,setemojiShow] = useState(false);
      let [emojiHover,setemojiHover] = useState(true);
 
     let changeEmoji = () =>{
         setemojiHover(!emojiHover)
         setemojiShow(!emojiShow)
     } 
 
     let  handleEmojiSelect = (e) =>{
         handleFocus()
        console.log(e.emoji);
        setMessage(message+e.emoji)
     }
 
      /*==================================================
                   Emoji item option end
      ====================================================*/
      /*==================================================
                   Like  option send start
      ====================================================*/
 
 
      let handleLike = () => {
         // Ensure that a user and a recipient are selected
         if (!activeGroupChat || !activeUser) {
             console.error("No recipient selected or user not active");
             return;
         }
     
         // Push a like message to Firebase
         set(push(ref(db, 'groupmessage/')), {
            whoSendGroupMessageID: activeUser.uid,
            whoSendGroupMessageName: activeUser.displayName,
            whoSendGroupMessagePhoto: activeUser.PhotoUrl,
            groupName: activeGroupChat.groupname,
            groupId: activeGroupChat?.groupid,
             message: 'like',
             time: new Date().toLocaleString(),
             msglike:true
         }).then(() => {
             setemptyMessage("");
             console.log("Like sent successfully");
         });
     };
     
 
      /*==================================================
                   Like option send  end
      ====================================================*/
      /*==================================================
                  handle Image Uplpoad Start
      ====================================================*/
 
      const [image, setImage] = useState(null);
      const [imagePreview, setImagePreview] = useState(null);
      console.log(image);
      
     
       let handleImageUpload = (e) =>{
 
         if (e.target.files[0]) {
             const selectedImage = e.target.files[0];
             setImage(selectedImage);
         
             // Show a preview
             const reader = new FileReader();
             reader.onloadend = () => {
               setImagePreview(reader.result);
             };
             reader.readAsDataURL(selectedImage);
           }
 
         const imageRef = storageRef(storage, `GroupchatImages/${new Date().getTime()}_${image.name}`);
  
          // Upload the image
         uploadBytes(imageRef, image).then((snapshot) => {
         // Get the image URL after upload
          getDownloadURL(snapshot.ref).then((url) => {
         // Send the image URL as a message
          console.log(url);
          
          set(push(ref(db, 'groupmessage/')), {
            whoSendGroupMessageID: activeUser.uid,
            whoSendGroupMessageName: activeUser.displayName,
            whoSendGroupMessagePhoto: activeUser.PhotoUrl,
            groupName: activeGroupChat.groupname,
            groupId: activeGroupChat?.groupid,
             message: "image", 
             time: new Date().toLocaleString(),
             isImage: url  
             }).then(() => {
             // Clear the image input
             console.log("Ok");
               });
 
           });
          });  
       }
 
      /*==================================================
                 handle Image Uplpoad end
      ====================================================*/
      /*==================================================
                unanthorize the modal start
      ====================================================*/
     
      const [isModalOpen3, setIsModalOpen3] = useState(false); // For delete confirmation modal
      const [isauthorrise, setAuthorizaOpen] = useState(false);
 
      const handleUnauthorizedOk = () => {
         setAuthorizaOpen(false); // Close the unauthorized modal
     };
 
      /*==================================================
                 unanthorize the modal end
      ====================================================*/
      /*==================================================
                   Image  modal Start
      ====================================================*/
 
      const [isModalImage, setIsModalImage] = useState(false); 
      const [previewImage, setPreviewImage] = useState('');
 
      let imageModal = (item) =>{
         console.log(item);
 
         setPreviewImage(item.isImage); // Store the image URL
         setIsModalImage(true);    
      }
 
      
      
  
 
      const handleImageCancel = () => {
         setIsModalImage(false);        // Close the modal using updated state name
       };
 
 
      /*==================================================
                   Image  modal End
      ====================================================*/

   

    return (
        <div className='chatting'>
        {/*=========== (Title part start) ===============*/}      
         <div className='chatting-title'>

            { activeGroupChat == null ?         
               <h1 className="choose-friend-message">Selected a Group</h1>
              :
              <>
                  {/* left part title start*/}
                  <div className='chatting-title-left'>
                    <img src={activeGroupChat?.groupphoto} className='chatting-title-img' />
                    <h2 className='chatting-heading'>{activeGroupChat?.groupname}</h2>
                  </div>
                  {/* left part title end */}
                  {/* right part title start */}
                  <div className='chatting-title-right'>
                    <MdOutlineCall className='chatting-title-icon' />
                    <IoMdVideocam className='chatting-title-icon'/>
                    <BsThreeDotsVertical className='chatting-title-icon' />
                  </div>
                  {/* right part title end */}         
              </>}  
           
         </div>      
        {/*================(Title part end)=============== */}        
        {/*========= (chatting-messages start)========= */}
        <div className='chatting-messages-group'>
           {/* when clickperson null */}
           { activeGroupChat == null ? 
              <>
                <div className='chatting-null-group'>
                  <img src={groupChat} alt=""  className='chatting-group-img' />
                  <h1 className='chatting-null-title-group' >No Group Chat Selected</h1>
                </div>
              </> 
              :
              ""
           }
           {/* when clickperson null */}
           {/* message list all */}
           {messageList.map(item => (
          
            
                    // Conditionally render messages on the left or right depending on who sent them
                    item.whoSendGroupMessageName === activeUser.displayName ? 
                        <>
                         {/* chatting-messages-left start */}
                         <div className="chatting-messages-left-group" key={item.time}>   
                                {/* message forward part start */}    
                               {item?.forwardAdmin ? (
                                <span className='forwordby'> <IoReturnDownForward className='forword-icon'/> {` forwarded by ${item.forwardAdmin}`}</span>
                                ) : null}         
                              {/* message forward part end */}
                              {/* message replay part start */}
                              {item?.replayBy? (
                               <span className='replayby-group'> < RiShareForwardFill className='replay-icon-group'/> {` replay ${item.replayMessage}`}</span>
                               ) : null} 
                             {/* message replay part end */}
                             {/* main message start here  */}
                             { item.msglike == true ?
                               /*Like part start */
                                <div className="likeportion">
                                    <BiSolidLike className='likeIcon2' />
                                    <img src={item.whoSendGroupMessagePhoto} className='sendgroupmessageimg' />
                                </div>
                                :
                               /*message part start */
                                <>             
                                 { item.isImage?
                                     
                                     <img src={item.isImage} alt="" className='message-img-group' onClick={()=>imageModal(item)} />
                                     :
                                     <>
                                         <div className="message-wrapper-group message-wrapper-one-group">   
                                        <span className='message-box-one-group'>{item.message} <span className="reply-icon-group" onClick={() => handleForword(item)} ><TiArrowSortedDown/> </span> </span>                                                                   
                                          <img src={item.whoSendGroupMessagePhoto} className='sendgroupmessageimg' /> 
                                     </div>
                                     </>
                                    
                                   }
                                </>
                             }
                             {/* main message start here  */}
                             {/* Message wrapper  left */} 
                             {/* Message timestamp */}
                             <p className="timestamp">
                                <BsClock className="timestamp-icon"/> {moment(item.time).fromNow()}
                             </p>
                             {/* Message timestamp */}
                         </div>
                         {/* chatting-messages-left end */}
                        </>
                      :
                        /* chatting-messages-right start */
                        <div className="chatting-messages-right-group" key={item.time}>
                            
                            {/* Message wrapper right start */}
                              {/* message forward part start */}    
                              {item?.forwardAdmin ? (
                                <span className='forwordby'> <IoReturnDownForward className='forword-icon'/> {` forwarded by ${item.forwardAdmin}`}</span>
                                ) : null}         
                              {/* message forward part end */}
                              {/* message replay part start */}
                              {item?.replayBy? (
                               <span className='replayby-group'> < RiShareForwardFill className='replay-icon-group'/> {` replay ${item.replayMessage}`}</span>
                               ) : null} 
                             {/* message replay part end */}
                           
                            {item?.msglike === true ? 
                              <div className="likeportion">
                                <img src={item.whoSendGroupMessagePhoto} className='sendgroupmessageimg' />
                                <BiSolidLike className='likeIcon2' />
                              </div>
                              : (
                             <>
                               {item.isImage ? 
                                 <img src={item.isImage} className='message-img-group' onClick={() => imageModal(item)}/>
                                : (
                               <div className="message-wrapper-group message-wrapper-two-group">
                                  <img src={item.whoSendGroupMessagePhoto} alt="" className='sendgroupmessageimg2'/>
                                  <span className='message-box-two-group'>{item.message}<span className="reply-icon-group-two" onClick={() => handleForword(item)}><TiArrowSortedDown /></span></span>
                                </div>
                              )}
                             </>
                              )}

                            {/* Message wrapper right end */}
                            {/* Message timestamp */}
                            <p className="timestamp">
                                <BsClock className="timestamp-icon"/> {moment(item.time).fromNow()}
                            </p>
                            {/* Message timestamp */}
                        </div>
                          /* chatting-messages-right end */
           ))}   
           {/* message list all */}        
        </div>
        {/*========= (chatting-messages end)========= */}   
        {/*=========== (Chating Box Start)============ */}
        <div className='chatting-box' >
           {/* chatbox replay item start */}
           {showReplayMessage && (
            <div className='replay-message-container'>
                { viewReplayBox &&
                    <>
                        <p className='your-self-replay'>Yourself replay... {slicedText}</p>
                        <RiCloseCircleLine onClick={handleCloseReplay} className='closereplaymessage'/>
                    </>                 
                }            
            </div>
           )} 
           {/* chatbox replay item end */}
           {/* chatting Box Inner Start */}
           <div className='chatting-box-inner'>
               {/* chatting -box-one */}
               <div className='chatting-box-one'>
                    {/* first part start */}
                    <div className="chatting-box-first">
                       {/* wrapper icon */}
                        <div className="icon-wrapper">
                            {/* add input system */}
                           <label htmlFor="image-upload">
                             <FaRegImage className="icon" />
                             <span className="tooltip">Attach a File</span>
                           </label>
                           {/* add input system */}
                           {/* hidden file */}
                           <input 
                            
                            onChange={handleImageUpload}
                            type="file" 
                            id="image-upload" 
                            hidden 
                            />
                            {/* hidden file */}
                        </div>
                        {/* wrapper icon */}
                        <div className="icon-wrapper">
                          <MdOutlineGifBox className="icon" />
                          <span className="tooltip">Choose a Gif</span>
                        </div>
                        {/* wrapper icon */}
                       <div className="icon-wrapper">
                        <MdOutlineEmojiEmotions className="icon" onClick={changeEmoji} />
                        {
                            emojiHover &&
                            <span className="tooltip">Choose Emoji Hover</span>
                        }
                       
                        {   emojiShow &&
                           <EmojiPicker className='emoji' onEmojiClick={handleEmojiSelect} />
                        }
                       </div>
                       {/* wrapper icon */}
                    </div>
                    {/* first part end */}
                    {/* second part  start */}
                   <div className="chatting-box-second">
                      <div className="input-container">
                     
                      {/* input part start */}
                      <input 
                      className='message-input-box'
                      style={emptyMessage ? {border: '1px solid #FF0000'} :  {border: '1px solid #ccc'} }
                      type="text" 
                      value={message} 
                      onChange={handleTyping}
                      placeholder={ emptyMessage ? emptyMessage  :"Type a message..."  }  
                      onFocus={handleFocus}  
                      onBlur={handleBlur}/>
                       {/* input part end */}
                      </div> 
                   </div>
                    {/* second part end */}
                    {/* third part */}
                   <div className="chatting-box-third">
                    <div className="icon-wrapper">
                     {/* send message option start */}
                     {!UpdateIcon && replayoff && (
                      isChangingIcon ?       
                     <BiSolidLike className="icon" onClick={handleLike} />  :
                     <IoMdSend className="icon" onClick={handleChat} /> )}
                    {/* send message option end */}
                    {/* update message option Start */}
                    { UpdateIcon &&
                      <IoSendOutline className='icon' onClick={handleMessageEditSubmit} />
                     } 
                    {/* update message option End */}
                    {/* Replay message option Start */}
                    { replayIcon &&
                       <>
                       <MdSendAndArchive  className='icon' onClick={replayMessageDB} />   
                      
                       </>
                     }       
                    {/* Replay message option End */}
                    {/* tooltip1 option Start */}
                    <span className="tooltip1">
                     {isChangingIcon ? 'Send A Message' : 'Send A Like'}
                     </span>
                      {/* tooltip1 option end */}
                     </div>
                   </div>
                    {/* third part */}
               </div>
               {/* chatting -box-one */}
           </div>
           {/* chatting Box Inner end */}   
        </div>
        {/*=========== (Chating Box End)============ */}
             
        {/* ===========================================
                      (Modal1 Part start)
        =============================================*/}
         <Modal
           style={{ 
             top: '220px', 
             right: "-350px",
             borderRadius: "15px", 
             padding: "5px",
             boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",  
             background: "linear-gradient(145deg,#faad14, #40a9ff)",  
             }}
            title={<h3 style={{ 
             textAlign: 'center', 
             color: "#1890ff",
             fontWeight: "600", 
             letterSpacing: "1.2px"  
            }}>Message Options</h3>}
             visible={isModalOpen}
             onCancel={handleModalClose}
             footer={null}
             width={320}>   
           {/* Reusable button style */}
           {[
            { label: "Message Info", icon: <BsThreeDotsVertical />, bgGradient: "#f0f2f5, #d9d9d9", onClick: () => console.log("Message Info Clicked") },
            { label: "Forward", icon: <TiArrowSortedDown />, bgGradient: "#1890ff, #40a9ff", onClick: forwordmodelstart },
            { label: "Reply", icon: <IoSend />, bgGradient: "#52c41a, #73d13d",   onClick: ReplyMessageStart },
            { label: "React", icon: <BiSolidLike />, bgGradient: "#faad14, #ffc53d", onClick: () => console.log("React Clicked") },
            { label: "Edit", icon: <GrEdit />, bgGradient: "#ffec3d, #ffe58f", onClick: handleMessageEdit },
            { label: "Delete", icon: <MdDelete />,  bgGradient: "#ff4d4f,#ff4d9f", onClick: handledeletemessage },
          ].map((btn, idx) => (
          <Button
            key={idx}
            style={{
                width: "100%",
                background: `linear-gradient(145deg, ${btn.bgGradient})`,  // Gradient background
                color: btn.bgGradient.includes("1890ff") ? "white" : "#333", 
                borderRadius: "10px", 
                marginBottom: "12px",
                border: "1px solid #ccc",
                padding: "10px",
                display: "flex", 
                alignItems: "center",  
                justifyContent: "center",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",  // Shadow
                transition: "transform 0.2s ease-in-out",
               }}
               onClick={btn.onClick}
               onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
               onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
             >
               {btn.icon} {/* Icon */}
               <span style={{ marginLeft: '8px' }}>{btn.label}</span>
          </Button>
           ))}
         </Modal>            
        {/* ===========================================
                      (Modal1 Part start)
        =============================================*/}
        {/* ===========================================
                (Forword Modal (Second modal))
        =============================================*/}            
         <Modal
             title="Forword Friend Details"
             visible={isForwordModalOpen}
             onCancel={handleForwordClose}
             footer={null}
             style={{ 
                top: '170px', 
                right: "-280px",
                borderRadius: "15px", 
                padding: "5px",
                boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",  
                background: "linear-gradient(145deg,#faad14, #40a9ff)",  
               }}
            >
             { filteredAdminGroups.map((item, index) => (
                    <div key={index} className="friend-container">
                        <div className="friend-info">
                            <img src={item.groupPhoto}  className="friend-photo" />
                            <span className="friend-name">{item.groupName}</span>
                        </div>
                      
                        <button onClick={() => handleModalForword2(item)}>Send</button>
                    </div>
                ))}
         </Modal>
         {/* ===========================================
                 (Forword Modal (Second modal))
        =============================================*/}
         {/* ===========================================
                 Unauthorized Access Modal
        =============================================*/}
         {/*  */}
         <Modal
                title="Unauthorized Access"
                visible={isauthorrise}
                onOk={handleUnauthorizedOk}
                onCancel={handleUnauthorizedOk}
                style={{ 
                    top: '250px', 
                    right: "-180px",
                    borderRadius: "15px", 
                    padding: "5px",
                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",  
                    background: "linear-gradient(145deg,#faad14, #40a9ff)",  
                   }}
            >
                <p>You do not have permission to delete this message.</p>
         </Modal>
         {/* ===========================================
                 Unauthorized Access Modal
        =============================================*/}
         {/* ===========================================
                  The image Preview modal
        =============================================*/}
          {/* Ant Design Modal for image preview */}
         <Modal
          visible={isModalImage}  
          footer={null}
          onCancel={handleImageCancel}
          width={540}       
          
          style={{ 
            top: '50px', 
            right: "-50px",}} 
            closeIcon={
                <span style={{ 
                    padding: '10px',
                  position: 'absolute', 
                  top: '10px',  
                  right: '10px',  
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: 'red', 
                  fontSize: "24px"
                 
                }}>
                  ✕
                </span>
            }           
          >

          <img
           alt="Preview"
           style={{ width: '500px' ,height: '500px',objectFit: 'center'  }}
           src={previewImage}      // Show the preview image
           />

          
          



         </Modal>
         {/* ===========================================
                  The image Preview modal
        =============================================*/}
         

    </div>
    );
};

export default GroupChatting;