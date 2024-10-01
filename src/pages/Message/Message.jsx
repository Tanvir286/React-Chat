import React, { useEffect, useState } from 'react';
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import "./Message.css"
import FriendDeatils from './FriendDeatils';
import GroupDeatils from './GroupDeatils';
import { useSelector } from 'react-redux';
import { getDatabase, ref, onValue } from "firebase/database";
import Chatting from './Chatting';
import GroupChatting from './GroupChatting';


const Message = () => {
    // Ensure that the database is initialized within the component
    const db = getDatabase();

    // State hooks used for UI control
    const [LeftPartElement, setLeftPartElement] = useState(true);
    const [RightPartElement, setRightPartElement] = useState(false);
    const [friendList,setFriendList] = useState(true);
    const [groupList,setGroupList] = useState(false);
    const [selected, setSelected] = useState('left');
   

    // Fetch userInfo from Redux store using useSelector (inside component body)
    const userInfo = useSelector(state => state?.user?.value);
    console.log(userInfo);


    
    

    /*==========( ✨ Friend Selected Part  ✨ )===========*/
    const friendSelected = () => {
        setSelected('left');
        setFriendList(true);
        setGroupList(false);
        setLeftPartElement(true);
        setRightPartElement(false);
    }
     /*==========(  Friend Selected Part   )===========*/
    /*==========( ✨ Group Selected Part  ✨ )===========*/
    const groupSelected = () => {
        setSelected('right');
        setFriendList(false);
        setGroupList(true);
        setLeftPartElement(false);
        setRightPartElement(true);
    }
    /*==========(  Group Selected Part  )===========*/

    return (
        <div className='main-portion'>
            {/* This is left Part Start */}
            <div className="left-portion">
                {/* Left One heading */}
                <div className='left-one-title-chat'>
                    <h2>Chats</h2>
                    <PiDotsThreeOutlineVerticalFill className='icon-left-one' />
                </div>
                {/* Left One heading end */}

                {/* Main Circle Start */}
                <div className='main-circle-border'>
                    <div className='main-circle'>
                        {/* Left side start */}
                        <div
                            className={`main-circle-left ${selected === 'left' ? 'selected' : ''}`}
                            onClick={friendSelected}
                        >
                            Friend List
                        </div>
                        {/* Middle divider */}
                        <div className="main-circle-divider"></div>
                        {/* Right side start */}
                        <div
                            className={`main-circle-right ${selected === 'right' ? 'selected' : ''}`}
                            onClick={groupSelected}
                        >
                            Group List
                        </div>
                    </div>
                </div>
                {/* Main Circle End */}

                {/* Friend and Group Element Rendering */}
                {LeftPartElement && <FriendDeatils />}
                {RightPartElement && <GroupDeatils />}
                {/* Friend and Group Element Rendering */}
            </div>
            {/* Left Part End */}

            {/* Right Part */}
            <div className="right-portion">

                {/* this is friend list start */}
                 { friendList &&
                   <Chatting/>
                 }
                {/* this is friend list start */}
                {/* this is friend list start */}
                 { groupList &&
                   <GroupChatting/>
                 }
                {/* this is friend list start */}
            </div>
        </div>
    );
};

export default Message;
