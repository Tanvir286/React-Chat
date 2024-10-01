import { getDatabase, ref, onValue,set,push,remove} from "firebase/database";
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { BsFillPersonLinesFill } from "react-icons/bs";
import { IoSearch } from "react-icons/io5";
import { MdKeyboardVoice } from "react-icons/md";
import { GoBlocked } from "react-icons/go";

const Friends = () => {

    const db = getDatabase(); 
    const [friendList,setFriendList] = useState([]);
    let [searchTerm, setSearchTerm] = useState('');

    /*======= Active User ==========*/
    let userInfo = useSelector(state=>state.user.value) 
    console.log(userInfo);  
    /*======= Active User ==========*/
    
    /*=============================
        Friends  Read Here  Start
    ==============================*/
     useEffect(()=>{
       const friendsRef = ref(db, 'friends/' );
       onValue(friendsRef, (snapshot) => {
         const arr = [];
         snapshot.forEach(item => {
         const data =  item.val()
         console.log(data);
         if(item.val().ReceivedID == userInfo.uid 
         || item.val().sendID == userInfo.uid ){
           arr.push({
            ...item.val() , friendId:item.key       
            })
           }
         });  
         setFriendList(arr)       
        });
     },[])
    /*=============================
        Friends  Read Here  End
     =============================*/
    /*============================
        Create a unfriend List
     =============================*/ 
     let handleUnfriend = (item) =>{
        console.log(item);
        if(userInfo.uid == item.sendID){
         remove(ref(db, 'friends/' + item.friendId));
        }
        else if(userInfo.uid == item.ReceivedID){
         remove(ref(db, 'friends/' + item.friendId));
        }
     }
    /*=============================
         Create a unfriend List
     =============================*/ 
    
     
    /*============================
         Craete BlockList Here
     =============================*/ 
     let handleBlock = (item) =>{
        console.log(item);
        if( userInfo.uid == item.sendID){
           set(push(ref(db, 'Block/')), {          
              BlockerName: userInfo.displayName,
              BlockerID: userInfo.uid,
              BlockerPicture: userInfo.PhotoUrl,
              VictimName: item.ReceivedName,
              VictimID: item.ReceivedID, 
              VictimPicture: item.ReciverPhoto
           }).then(()=>{
              remove(ref(db, 'friends/' + item.friendId));
           })
        }
        else{
           set(push(ref(db, 'Block/')), {
              BlockerName: userInfo.displayName,
              BlockerID: userInfo.uid,
              BlockerPicture:userInfo.PhotoUrl,
              VictimName: item.sendName,
              VictimID: item.sendID,
              VictimPicture: item.SenderPhoto
           }).then(()=>{
              remove(ref(db, 'friends/' + item.friendId));
           })
        }
     }
    /*============================
         Craete BlockList Here
     ============================*/
    /*============================
            Search Area Start
     ============================*/
     console.log(friendList);
     const filteredUserList = friendList.filter(item => {
      return (
      ( item.ReceivedName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      ( item.sendName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
     });
    /*===========================
          Search Arear End 
     ===========================*/
    return (
    <div className='boxcontainer'> 
     {/* Title Holder Part */}
     <div className="titleholder">
       <h2 >Friends List</h2> 
       <BsFillPersonLinesFill  className='icon-deatils' />
     </div>        
     {/* Title Holder Part */}
 
     {/* This is Empty Part */}
     {friendList.length == 0 &&  
      <h1 className='empty'>you don't have any friend at the moment</h1>
     }
     {/* This is Empty Part */}
     {/* Search Box start */}
     <div className='search'>
       <input 
        type="text" 
        className='search-box' 
        placeholder="Search Your Friend Name" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}/>
        <IoSearch className='search-icon' />
        <MdKeyboardVoice className='search-icon2' />
      </div>
      {/* Search Box End */}

      {/* ==========================
          FriendsList  Read Here    
      ============================*/}
      <div className='box'>
       { filteredUserList.map((item)=>{
         console.log(item);
       return(
        <div className='box-inner'>
           { 
           item.sendID == userInfo.uid?
           <img src={item.ReciverPhoto} alt="" className="box-img" /> :
           <img src={item.SenderPhoto} alt="" className="box-img" /> }
           <div className="item-name">
           {
           item.sendID == userInfo.uid? <h3>{item.ReceivedName}</h3>:
           <h3>{item.sendName}</h3> }    
           </div>              
           <div className='btn-part'>

            <button className="button-55" 
             onClick={()=>handleUnfriend(item)}>
             <GoBlocked className='icon-side'  /> 
              Unfriend 
             </button>

            <button className="button-56" 
             style={{color:"#ED0800"}} 
             onClick={()=>handleBlock(item)} >
             <GoBlocked className='icon-side' /> 
             Add Block
            </button>              
           </div>  
        </div> 
        )   
        })
        }
      </div>
      {/* ==========================
          FriendsList  Read Here    
      ============================*/}
     
    </div>
    );
};

export default Friends;