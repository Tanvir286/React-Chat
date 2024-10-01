import "./FriendPart.css"
import React, { useState } from 'react';
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { BsFillPersonLinesFill} from "react-icons/bs";
import { IoIosArrowDropright } from "react-icons/io";
import { IoPersonAddSharp } from "react-icons/io5";
import BlockList from '../../component/DashBorad/BlockList';
import FriendRequest from '../../component/DashBorad/FriendRequest';
import UserList from '../../component/DashBorad/UserList';
import Friends from '../../component/DashBorad/Friends';

const FriendPart = () => {

  const [activeIndex, setActiveIndex] = useState(null);
   
  const handleSetActive = (index) => {
        setActiveIndex(index); };

  const renderComponent = () => {
        switch (activeIndex) {
            case 0:
                return <Friends />;
            case 1:
                return <UserList />;           
            case 2:
                return <FriendRequest />;
            case 3:
                return <BlockList />;
            default:
                return <UserList />;
        }
    };

    const icons = [
        <BsFillPersonLinesFill />,
        <IoPersonAddSharp />,
        <IoPersonAddSharp />,           
        <BsFillPersonLinesFill />
    ];

    return (
        <div className='Main'>
          {/* This is left Part Start */}
          <div className="left">
          {/* left One heading*/}
          <div className='left-one'>
            <h2>Friends</h2>
            <PiDotsThreeOutlineVerticalFill 
            className='icon-left-one'/>
          </div>
          {/* left One heading */}
          {/* This is Friend item List*/}
          {['All Friends', 'Add Friends', 'Friends Request',
           'Block Friends'].map((item, index) => {
           return (
             <div 
              key={index} 
              className="left-two"
              style={activeIndex === index ? { backgroundColor: '#becde6' } : {}}
              onClick={() => handleSetActive(index)}>
                
              <div className='left-two-firstpart'>
                <div className='left-two-partone'>
                   <div className='left-two-icon'>{icons[index] }</div>
                   <h4 className='left-two-title'>{item}</h4>
                </div>                           
                <IoIosArrowDropright className='icon-left-two' />                                
              </div>
             </div>
             );
             })}
          </div>
          {/* This is left Part End */}
          {/* This is right Part Here */}
          <div className="right">
                {renderComponent()}
          </div>
        </div>
    );
};

export default FriendPart;
