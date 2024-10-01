import "./Message.css";
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDatabase, ref, onValue } from "firebase/database";
import { activeChatUser } from '../../Slices/activeChatSlice';
import moment from 'moment'; // Import Moment.js

const FriendDetails = () => {
    const db = getDatabase();
    const dispatch = useDispatch();
    const [friendDetails, setFriendDetails] = useState([]);
    const [lastSeenDetails, setLastSeenDetails] = useState({});
    const userInfo = useSelector(state => state?.user?.value);


    console.log(friendDetails);
    

    /*==========( ✨member find start✨ )===========*/
    useEffect(() => {
        const findRef = ref(db, 'friends/');
        onValue(findRef, (snapshot) => {
            const arr = [];
            snapshot.forEach((item) => {
                const data = item.val();
                if (data.ReceivedID === userInfo.uid) {
                    arr.push({
                        friendName: data.sendName,
                        friendPhoto: data.SenderPhoto,
                        sendID: data.sendID,
                    });
                } else if (data.sendID === userInfo.uid) {
                    arr.push({
                        friendName: data.ReceivedName,
                        friendPhoto: data.ReciverPhoto,
                        sendID: data.ReceivedID,
                    });
                }
            });
            setFriendDetails(arr);
        });
    }, [userInfo.uid]);
    /*==========( member find End)===========*/

   /*==========( ✨member click and dispatch✨ )===========*/
    const handleActiveChat = (item) => {
        dispatch(activeChatUser({
            friendId: item.sendID,
            friendName: item.friendName, 
            friendPhoto: item.friendPhoto,
            lastMessageTime: new Date().toLocaleTimeString(), 
            lastSeen: lastSeenDetails[item.sendID] || "N/A", // Use the last seen time or default to "N/A"
        }));
    };
   /*==========( member click and dispatch )===========*/

   /*==================================================
                       Read last seen Start
     ====================================================*/
    useEffect(() => {
        if (friendDetails.length > 0) {
            const lastSeenRef = ref(db, 'users/');
            onValue(lastSeenRef, (snapshot) => {
                const seenDetails = {};
                snapshot.forEach(item => {
                    const data = item.val();
                    seenDetails[item.key] = data.lastSeen; // Store last seen for each friend
                });
                setLastSeenDetails(seenDetails);
            });
        }
    }, [friendDetails]);
   /*==================================================
                       Read last seen end
     ====================================================*/

    /*==================================================
                       Read messages Start
     ====================================================*/
    const [messageList, setMessageList] = useState([]);
    const clickPerson = useSelector(state => state?.activeChat?.value);
    
    useEffect(() => {
        if (userInfo) {
            const msgRef = ref(db, 'message');
            onValue(msgRef, (snapshot) => {
                const arr = [];
                snapshot.forEach(item => {
                    const data = item.val();
                    if (data.whoSendMessageID === userInfo.uid || data.whoReceiveMessageID === userInfo.uid) {
                        arr.push({
                            ...data,
                            messageKey: item.key
                        });
                    }
                });
                setMessageList(arr);
            });
        }
    }, [userInfo]);
    /*==================================================
                       Read messages end
     ====================================================*/

    // Function to get the last message for a specific friend
    const getLastMessage = (friendId) => {
        const friendMessages = messageList.filter(msg => 
            (msg.whoSendMessageID === friendId || msg.whoReceiveMessageID === friendId)
        );

        if (friendMessages.length === 0) {
            return { message: "No messages yet", time: null }; // No messages found for this friend
        }

        const lastMessage = friendMessages[friendMessages.length - 1];
        const formattedTime = moment(lastMessage.time).fromNow(); // Format time using Moment.js

        return { message: lastMessage.message, time: formattedTime };
    };

    return (
        <div>

            {  friendDetails == "" ? 
              
               <h3 style={{textAlign:"center", marginTop:"100px"}}>No Friend Avaliable</h3>
               :
               ""
            }



            {friendDetails.map((item, index) => {
                const lastMessageDetails = getLastMessage(item.sendID); // Call getLastMessage only once
                const messageText = lastMessageDetails.message.slice(0, 9) + "..."

                return (
                    <div key={index} className="friend-details" onClick={() => handleActiveChat(item)}>
                        <img src={item.friendPhoto} alt="" className="friend-details-image" />
                        <div>
                            <h4 className="friend-details-header">{item.friendName}</h4>
                            <div className="friend-details-header">
                                {messageText}
                                <div className="clock-get">{lastMessageDetails.time || 'No time available'}</div>
                            </div>                  
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default FriendDetails;



/*=================================

import "./Message.css"
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDatabase, ref, onValue } from "firebase/database";
import { activeChatUser } from '../../Slices/activeChatSlice'; // Import the action creator correctly

const FriendDetails = () => {

    const db = getDatabase();
    let dispatch = useDispatch();
    const [friendDetails, setFriendDetails] = useState([]);
    let userInfo = useSelector(state => state?.user?.value);
  
  
    
    useEffect(() => {
        const findRef = ref(db, 'friends/');
        onValue(findRef, (snapshot) => {
            const arr = [];
            snapshot.forEach((item) => {
                const data = item.val();
                console.log(data);
                if (data.ReceivedID === userInfo.uid) {
                    arr.push({
                        friendName: data.sendName,
                        friendPhoto: data.SenderPhoto,
                        sendID: data.sendID,
                    });
                    console.log(`You are friends with: ${data.sendName}`);
                } else if (data.sendID === userInfo.uid) {
                    arr.push({
                        friendName: data.ReceivedName,
                        friendPhoto: data.ReciverPhoto,
                        sendID: data.ReceivedID,
                    });
                    console.log(`You are friends with: ${data.ReceivedName}`);
                }
            });
            setFriendDetails(arr);
        });
    }, [userInfo.uid]);


   

 
    let handleActiveChat = (item) => {
        console.log(item);
        dispatch(activeChatUser({
            friendId: item.sendID,
            friendName: item.friendName, 
            friendPhoto: item.friendPhoto,
            lastMessageTime: new Date().toLocaleTimeString(), 
            lastSeen: new Date().toLocaleTimeString()
        })); 
    };
 


     
     const [messageList, setMessageList] = useState([]);
     const clickPerson = useSelector(state => state?.activeChat?.value);
     console.log(messageList);
     

     
     useEffect(() => {
        if (userInfo) {
            const msgRef = ref(db, 'message');
            onValue(msgRef, (snapshot) => {
                const arr = [];
                snapshot.forEach(item => {
                    const data = item.val();
                    // Filter messages between the active user and the selected chat user
                    if (
                        (data.whoSendMessageID === userInfo.uid) ||
                        (data.whoReceiveMessageID === userInfo.uid)
                     ) {
                        arr.push({
                            ...data,
                            messageKey: item.key
                        });
                     }
                  });
                // Update the message list state
                setMessageList(arr);
             });
         }
       }, [userInfo]);


    
     const getLastMessage = (friendId) => {
    // Filter messages that are exchanged with the specified friendId
    const friendMessages = messageList.filter(msg => 
        msg.whoSendMessageID === friendId || msg.whoReceiveMessageID === friendId
    );

    // Check if there are any messages for this friend
    if (friendMessages.length === 0) {
        return null; // No messages found for this friend
    }

    // Get the last message from the filtered messages
    const lastMessage = friendMessages[friendMessages.length - 1];

    // Return the message content, if available, otherwise return null
    return lastMessage ? lastMessage.message : null;
};


    return (
        <div>
        {friendDetails.map((item, index) => (
          <div key={index} className="friend-details" onClick={() => handleActiveChat(item)}>
            <img src={item.friendPhoto} alt="" className="friend-details-image" />
             <div>
              <h4 className="friend-details-header">{item.friendName}</h4>
          
              <h4 className="friend-details-header">
                {getLastMessage(item.sendID)}
              </h4>
             </div>
            <h4></h4>
          </div>
        ))}
      </div>
    );
};

export default FriendDetails;

==================================*/