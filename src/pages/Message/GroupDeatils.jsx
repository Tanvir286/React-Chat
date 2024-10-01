import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import { useSelector, useDispatch } from 'react-redux';
import { activeGroupChatUser } from '../../Slices/activeGroupChatSlice';
import moment from 'moment'; // Import Moment.js for time formatting

const GroupDetails = () => {
    // Get the active user and selected group chat from Redux store
    const ActiveUser = useSelector((state) => state.user.value);
    const activeGroupChat = useSelector(state => state?.activeGroupChat?.value);
    const db = getDatabase();
    const dispatch = useDispatch();
    
    const [adminlist, setAdminlist] = useState([]);
    const [groupmember, setMemberlist] = useState([]);
    const [messageList, setMessageList] = useState([]);
    const [lastSeenDetails, setLastSeenDetails] = useState({}); // To store last seen details for group members

    /*==================================================
                        Read group messages Start
    ====================================================*/
    useEffect(() => {
        if (ActiveUser) {
            const msgRef = ref(db, 'groupmessage');
            onValue(msgRef, (snapshot) => {
                const arr = [];
                snapshot.forEach(item => {
                    const data = item.val();
                    arr.push({
                        ...data,
                        ID: item.key
                    });
                });
                setMessageList(arr);
            });
        }
    }, [ActiveUser]);

    /*==================================================
                        Read group messages end
    ====================================================*/

    /*==================================================
                        Read last seen details Start
    ====================================================*/
    useEffect(() => {
        if (adminlist.length > 0 || groupmember.length > 0) {
            const lastSeenRef = ref(db, 'users/');
            onValue(lastSeenRef, (snapshot) => {
                const seenDetails = {};
                snapshot.forEach(item => {
                    const data = item.val();
                    seenDetails[item.key] = data.lastSeen; // Store last seen for each member
                });
                setLastSeenDetails(seenDetails);
            });
        }
    }, [adminlist, groupmember]);

    /*==================================================
                        Read last seen details end
    ====================================================*/

    /*==================================================
                        Admin List Read
    ====================================================*/
    useEffect(() => {
        const groupRef = ref(db, "groups");
        onValue(groupRef, (snapshot) => {
            const arr = [];
            snapshot.forEach(item => {
                if (ActiveUser.displayName === item.val().adminName) {
                    arr.push({ ...item.val(), groupID: item.key });
                }
            });
            setAdminlist(arr);
        });
    }, [ActiveUser.displayName]);

    /*==================================================
                        Member List Read
    ====================================================*/
    useEffect(() => {
        const groupRef = ref(db, "groupMember");
        onValue(groupRef, (snapshot) => {
            const arr = [];
            snapshot.forEach(item => {
                if (ActiveUser.displayName === item.val().username) {
                    arr.push({ ...item.val() });
                }
            });
            setMemberlist(arr);
        });
    }, [ActiveUser.displayName]);

    /*==================================================
                    Handle Active Group Chat Start
    ====================================================*/
    const handleActiveGroupChat = (item) => {
        dispatch(activeGroupChatUser({
            groupname: item.groupName,
            groupphoto: item.groupPhoto,
            groupid: item.groupID,
            groupadminname: item.adminName,
            groupadminid: item.adminID,
            lastSeen: lastSeenDetails[item.groupID] || "N/A", // Set last seen for the group
        }));
    };

    /*==================================================
                    Get the last message for the group
    ====================================================*/
    const getLastMessage = (groupId) => {
        const groupMessages = messageList.filter(msg => msg.groupId === groupId);

        if (groupMessages.length === 0) {
            return { message: "No messages yet", time: null }; // No messages found for this group
        }

        const lastMessage = groupMessages[groupMessages.length - 1];
        const formattedTime = moment(lastMessage.time).fromNow(); // Format time using Moment.js

        return { message: lastMessage.message, time: formattedTime };
    };

    /*==================================================
                Combine admin and member lists
    ====================================================*/
    const combinedList = [...adminlist, ...groupmember];

    return (
        <>
            <div>
 
               {  combinedList == "" ? 
              
                  <h3 style={{textAlign:"center", marginTop:"100px"}}>No Group Avaliable</h3>
                  :
                   ""
                }

                {combinedList.map((item, index) => {
                    const lastMessageDetails = getLastMessage(item.groupID); // Call getLastMessage for each group

                    // Truncate the message if it's too long, but avoid truncating very short messages
                    const messageText = lastMessageDetails.message.length > 5
                        ? lastMessageDetails.message.slice(0, 5) + "..."
                        : lastMessageDetails.message;

                    return (
                        <div key={index} className="friend-details" onClick={() => handleActiveGroupChat(item)}>
                            <img src={item.groupPhoto} alt="" className="friend-details-image" />
                            <div>
                                {/* Display group name and message text before clicking */}
                                <h4 className="friend-details-header">{item.groupName}</h4>
                                <div className="friend-details-header">
                                    {messageText}
                                    <div className="clock-get">{lastMessageDetails.time || 'No time available'}</div>
                                </div>                              
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default GroupDetails;






//////////////////////////////////////////////////////////////////
// import React, { useEffect, useState } from 'react';
// import { getDatabase, ref, onValue } from "firebase/database";
// import { useSelector, useDispatch } from 'react-redux';
// import { activeGroupChatUser } from '../../Slices/activeGroupChatSlice';

// const GroupDetails = () => {

//     // Get the active user from the Redux store (logged-in user info)
//     let ActiveUser = useSelector((state) => state.user.value);
//     console.log(ActiveUser.uid); // Log the UID of the active user for debugging purposes

//     const db = getDatabase(); // Initialize Firebase Realtime Database
//     const dispatch = useDispatch(); // Initialize Redux dispatch
//     const [adminlist, setAdminlist] = useState([]); // State to store groups where the user is an admin
//     const [groupmember, setMemberlist] = useState([]); // State to store groups where the user is a member

//     /*================================== 
//          Admin List Read   
//     ===================================*/
//     console.log(adminlist); // Log the current admin list for debugging purposes

//     useEffect(() => {
//         // Reference to the "groups" path in Firebase Realtime Database
//         const groupRef = ref(db, "groups"); 
//         onValue(groupRef, (snapshot) => {
//             const arr = [];
//             snapshot.forEach(item => {
//                 // Check if the active user is the admin of the group
//                 if (ActiveUser.displayName === item.val().adminName) {
//                     // Push group data and group ID into the array
//                     arr.push({ ...item.val(), groupID: item.key });
//                 }
//             });
//             setAdminlist(arr); // Update admin list state with the groups where the user is an admin
//         });
//     }, [ActiveUser.displayName, db]); // Dependencies include the active user's display name and db reference

//     /*================================== 
//          Member List Read   
//     ===================================*/
//     console.log(groupmember); // Log the current group member list for debugging purposes

//     useEffect(() => {
//         // Reference to the "groupMember" path in Firebase Realtime Database
//         const groupRef = ref(db, "groupMember"); 
//         onValue(groupRef, (snapshot) => {
//             const arr = [];
//             snapshot.forEach(item => {
//                 // Check if the active user is a member of the group
//                 if (ActiveUser.displayName === item.val().username) {
//                     // Push group member data into the array
//                     arr.push({ ...item.val() });
//                 }
//             });
//             setMemberlist(arr); // Update member list state with the groups where the user is a member
//         });
//     }, [ActiveUser.displayName, db]); // Dependencies include the active user's display name and db reference

//     /*================================== 
//         Handle active group chat start
//     ===================================*/
//     let handleActiveGroupChat = (item) => {
//         console.log(item); // Log the selected group item for debugging purposes
//         // Dispatch the selected group details to the Redux store, which will mark this group as the active chat
//         dispatch(activeGroupChatUser({
//             groupname: item.groupName,
//             groupphoto: item.groupPhoto,
//             groupid: item.groupID,
//             groupadminname: item.adminName,
//             groupadminid: item.adminID
//         }));
//     };

//     /*================================== 
//        Merging both admin and member lists 
//     ===================================*/
//     const combinedList = [...adminlist, ...groupmember]; // Combine both admin and member lists into a single list for rendering

//     return (
//         <>
//             {/* Combined Group List start */}
//             <div>
//                 {combinedList.map((item, index) => (
//                     <div key={index} className="friend-details" onClick={() => handleActiveGroupChat(item)}>
//                         {/* Display group photo */}
//                         <img src={item.groupPhoto} alt="" className="friend-details-image" />
//                         <div>
//                             {/* Display group name */}
//                             <h4 className="friend-details-header">{item.groupName}</h4>
//                             {/* Display admin name */}
//                             <h6>{item.adminName}</h6>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//             {/* Combined Group List end */}
//         </>
//     );
// };

// export default GroupDetails;

