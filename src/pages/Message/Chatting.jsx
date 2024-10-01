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
import Nochat  from '../../assets/chat1.png'
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


const Chatting = () => {
   
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
    const clickPerson = useSelector(state => state?.activeChat?.value);
    console.log(clickPerson);
    console.log(activeUser);
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
        if (!clickPerson || !activeUser) {
            console.error("No recipient selected or user not active");
            return;
        }

        if(message == "" ){
          setemptyMessage("You can't send an empty message")
          return          
        }

        // Push the new message to Firebase database
        set(push(ref(db, 'message/')), {
            whoSendMessageID: activeUser.uid,
            whoSendMessageName: activeUser.displayName,
            whoSendMessagePhoto: activeUser.PhotoUrl,
            whoReceiveMessageID: clickPerson.friendId,
            whoReceiveMessageName: clickPerson.friendName,
            whoReceiveMessagePhoto: clickPerson.friendPhoto,
            message: message,
            time: new Date().toLocaleString()

        }).then(() => {
            // Clear message input after sending
            setemojiShow(false);
            setemojiHover(true);
            setMessage("");
            setemptyMessage("");
            handleBlur();
        })

        
      };
 
     /*==================================================
                      handlechat End part
     ====================================================*/
     /*==================================================
                       Read message Start
     ====================================================*/
   
      useEffect(() => {
        // Ensure both the active user and chat recipient are selected
        if (activeUser && clickPerson) {
            const msgRef = ref(db, 'message');
            onValue(msgRef, (snapshot) => {
                const arr = [];
                snapshot.forEach(item => {
                    const data = item.val();
                    // Filter messages between the active user and the selected chat user
                    if (
                        (data.whoSendMessageID === activeUser.uid && data.whoReceiveMessageID === clickPerson.friendId) ||
                        (data.whoReceiveMessageID === activeUser.uid && data.whoSendMessageID === clickPerson.friendId)
                     ) {
                        arr.push({
                            ...data,messageKey:item.key});
                     }
                  });
                // Update the message list state
                 setMessageList(arr);
             });
         }
       }, [activeUser, clickPerson]);
     /*==================================================
                       Read message end
     ====================================================*/
     /*==================================================
             handle forword start  with second modal
     ====================================================*/


      let handleForword = (item) => {
         setIsModalOpen(true); 
         setForwardMessage(item);
         console.log(forwardMessage);       
       }

      let forwordmodelstart = () => {
         setForwordModalOpen(true); 
         setIsModalOpen(false); 
        }

      const handleModalForword= (friend) => {
        
        if (forwardMessage) {
            set(push(ref(db, 'message/')), {
                whoSendMessageID: activeUser.uid,
                whoSendMessageName: activeUser.displayName,
                whoSendMessagePhoto: activeUser.PhotoUrl,
                whoReceiveMessageID: friend.sendID,
                whoReceiveMessageName: friend.friendName,
                whoReceiveMessagePhoto: friend.friendPhoto,
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
        if (forwardMessage?.whoSendMessageName === activeUser.displayName) {
            // Close the delete modal and delete the message
            setIsModalOpen(false); // Assuming this opens the delete confirmation modal
            return remove(ref(db, 'message/' + forwardMessage?.messageKey));
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

     let handleMessageEdit = () =>{

         if(forwardMessage?.whoSendMessageName === activeUser.displayName){
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

        const messageRef = ref(db, `message/${forwardMessage?.messageKey}`);
         
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
        
         set(push(ref(db, 'message/')), {
            whoSendMessageID: activeUser.uid,
            whoSendMessageName: activeUser.displayName,
            whoSendMessagePhoto: activeUser.PhotoUrl,
            whoReceiveMessageID: clickPerson.friendId,
            whoReceiveMessageName: clickPerson.friendName,
            whoReceiveMessagePhoto: clickPerson.friendPhoto,
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
        if (!clickPerson || !activeUser) {
            console.error("No recipient selected or user not active");
            return;
        }
    
        // Push a like message to Firebase
        set(push(ref(db, 'message/')), {
            whoSendMessageID: activeUser.uid,
            whoSendMessageName: activeUser.displayName,
            whoSendMessagePhoto: activeUser.PhotoUrl,
            whoReceiveMessageID: clickPerson.friendId,
            whoReceiveMessageName: clickPerson.friendName,
            whoReceiveMessagePhoto: clickPerson.friendPhoto,
            message: '👍',
            time: new Date().toLocaleString(),
            like: true
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

        const imageRef = storageRef(storage, `chatImages/${new Date().getTime()}_${image.name}`);
 
         // Upload the image
        uploadBytes(imageRef, image).then((snapshot) => {
        // Get the image URL after upload
         getDownloadURL(snapshot.ref).then((url) => {
        // Send the image URL as a message
         console.log(url);
         
         set(push(ref(db, 'message/')), {
            whoSendMessageID: activeUser.uid,
            whoSendMessageName: activeUser.displayName,
            whoSendMessagePhoto: activeUser.PhotoUrl,
            whoReceiveMessageID: clickPerson.friendId,
            whoReceiveMessageName: clickPerson.friendName,
            whoReceiveMessagePhoto: clickPerson.friendPhoto,
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
        setIsModalImage(false);        
      };


     /*==================================================
                  Image  modal End
     ====================================================*/

    return (
        <div className='chatting'>
        {/*=========== (Title part start) ===============*/}      
         <div className='chatting-title'>

            { clickPerson == null ?         
               <h1 className="choose-friend-message">Chose a friend on your chat friend list</h1>
              :
              <>
                  {/* left part title start*/}
                  <div className='chatting-title-left'>
                    <img src={clickPerson?.friendPhoto} className='chatting-title-img' />
                    <h2 className='chatting-heading'>{clickPerson?.friendName}</h2>
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
        <div className='chatting-messages'>
           {/* when clickperson null */}
           { clickPerson == null ? 
              <>
                <div className='chatting-null'>
                  <img src={Nochat} alt=""  className='chatting-img' />
                  <h1 className='chatting-null-title' >No Chat Selected</h1>
                </div>
              </> 
              :
              ""
           }
           {/* when clickperson null */}
          {messageList.map(item => (
                    // Conditionally render messages on the left or right depending on who sent them
                    item.whoSendMessageID === activeUser.uid ? 
                        <>
                         {/* chatting-messages-left start */}
                         <div className="chatting-messages-left" key={item.time}>   
                             {/* message forward part start */}    
                             {item?.forwardAdmin ? (
                               <span className='forwordby'> <IoReturnDownForward className='forword-icon'/> {` forwarded by ${item.forwardAdmin}`}</span>
                               ) : null}         
                             {/* message forward part end */} 
                             {/* message replay part start */}
                               {item?.replayBy? (
                               <span className='replayby'> < RiShareForwardFill className='replay-icon'/> {` replay ${item.replayMessage}`}</span>
                               ) : null} 
                             {/* message replay part end */}
                             {/* Message wrapper left */}
                             { item?.like == true ?
                               /*Like part start */
                               <BiSolidLike className='likeIcon' /> :
                               /*message part start */
                                <>             
                                 { item.isImage?
                                     
                                     <img src={item.isImage} alt="" className='message-img' onClick={()=>imageModal(item)} />
                                     :
                                     <div className="message-wrapper message-wrapper-one">    
                                        <span className='message-box-one'>{item.message} <span className="reply-icon" onClick={() => handleForword(item)} ><TiArrowSortedDown/> </span> </span>                                                                   
                                     </div>
                                   }
                                </>
                             }
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
                        <div className="chatting-messages-right" key={item.time}>
                            {/* message forward part start */}    
                            {item?.forwardAdmin ? (
                               <span className='forwordby'> <IoReturnDownForward className='forword-icon'/> {` forwarded by ${item.forwardAdmin}`}</span>
                               ) : null}         
                             {/* message forward part end */} 
                             {/* message replay part start */}
                               {item?.replayBy? (
                               <span className='replayby'> < RiShareForwardFill className='replay-icon'/> {` replay ${item.replayMessage}`}</span>
                               ) : null} 
                             {/* message replay part end */}
                             {/* Message wrapper left */}
                            {/* Message wrapper right start */}
                            { item.isImage?
                                     
                                     <img src={item.isImage} alt="" className='message-img' onClick={()=>imageModal(item)} />
                                     :
                                     <div className="message-wrapper message-wrapper-two">    
                                        <span className='message-box-two'>{item.message} <span className="reply-icon" onClick={() => handleForword(item)} ><TiArrowSortedDown/> </span> </span>                                                                   
                                     </div>
                                   }
                            {/* Message wrapper right end */}
                            {/* Message timestamp */}
                            <p className="timestamp">
                                <BsClock className="timestamp-icon"/> {moment(item.time).fromNow()}
                            </p>
                            {/* Message timestamp */}
                        </div>
                          /* chatting-messages-right end */
          ))}    
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
                right: "-350px",
                borderRadius: "15px", 
                padding: "5px",
                boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",  
                background: "linear-gradient(145deg,#faad14, #40a9ff)",  
               }}
            >
             {friendDetails.map((friend, index) => (
                    <div key={index} className="friend-container">
                        <div className="friend-info">
                            <img src={friend.friendPhoto} alt={friend.friendName} className="friend-photo" />
                            <span className="friend-name">{friend.friendName}</span>
                        </div>
                      
                        <button onClick={() => handleModalForword(friend)}>Send</button>
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

export default Chatting;
