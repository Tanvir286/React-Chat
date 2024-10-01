import { getDatabase, ref, set,onValue,push } from "firebase/database";
import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { LiaThListSolid } from "react-icons/lia";
import { IoPersonAdd } from "react-icons/io5";
import { BiLoaderCircle } from "react-icons/bi";
import { MdKeyboardVoice } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import mutaul1 from "../../../public/assets/mutal01.jpg"  
import mutaul2 from "../../../public/assets/mutal02.jpg"  

const UserList = () => {

   const db = getDatabase();
   let [userList,setUserList] = useState([]);
   let [friendShow,setfriendShow] = useState([]);
   let [friendRequest,setfriendRequest] = useState([]);
   let [blockList,setBlockList] = useState([]);
   let [searchTerm, setSearchTerm] = useState('');

   /*======= Active User ==========*/
   let userInfo = useSelector(state=>state?.user?.value)   
   console.log(userInfo);
   /*======= Active User ==========*/
     
        
   /*===================================
      Here UserList  Read Here  Start
   ===================================*/  
    useEffect(() => {
      const userRef = ref(db, 'users');
      onValue(userRef, (snapshot) => {
      // const data = snapshot.val();
      //console.log(data);      Total Value;    
      const arr = [];
      snapshot.forEach(item => {
        if(userInfo.uid !== item.key){ 
           const data = item.val()    
           console.log(data);    
           arr.push({
             userID:item.key,  
             username: data.username,
             email: data.email,
             photo: data.photoURL});
            }
         });
        setUserList(arr);
        });
    }, []);

    /*==================================
         Here UserList  Read Here  End
     ===================================*/
    /*==================================
          Here UserList  Friend show
     ===================================*/
      useEffect(() => {
        const friendRef = ref(db, 'friends');
        onValue(friendRef, (snapshot) => {            
          const arr = [];
          snapshot.forEach(item => {   
           const data = item.val();
           console.log(data);
            arr.push(data.ReceivedID + data.sendID )      
          });
          setfriendShow(arr);
        });
      }, []);
     /*==================================
           Here UserList  Friend show
     ===================================*/ 
     /*==================================
          Here UserList  Pending  item
     ===================================*/
     useEffect(() => {
        const friendrequestRef = ref(db, 'friendrequest');
        onValue(friendrequestRef, (snapshot) => {              
          const arr = [];
          snapshot.forEach(item => {
           console.log(item);
           const data = item.val();
           console.log(data);
            arr.push(data.ReceivedID + data.sendID )  
          });
          setfriendRequest(arr);
          console.log(friendRequest);
        });
      }, []);
     /*==================================
          Here UserList  Pending  item
     ===================================*/   
     /*==================================
        Here UserList  BlockList item
     ===================================*/   
     useEffect(() => {
      const BlockRef = ref(db, 'Block');
      onValue(BlockRef, (snapshot) => {       
        const arr = [];
        snapshot.forEach(item => { 
         const data = item.val();
         console.log(data);
          arr.push(data.VictimID + data.BlockerID )             
        });
        setBlockList(arr);    
        console.log(blockList);
      });
     }, []);
     /*==================================
        Here UserList  BlockList  item
     ===================================*/
     /*==================================
               Here Search List  
     ===================================*/
     const filteredUserList = userList.filter(item => {
      return (
        item.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !blockList.includes(item.userID + userInfo.uid) &&
        !blockList.includes(userInfo.uid + item.userID)
      );
     });
     /*==================================
               Here Search List
     ===================================*/
     /*================================== 
         Friends Request create DB
     ===================================*/   

     console.log(userInfo.uid);
     console.log(userInfo.displayName);
     console.log(userInfo.PhotoUrl);
     
     let handleFriendRequest = (item) =>{  
        console.log(item);
        set(push(ref(db, 'friendrequest/' )), {       
           sendID: userInfo.uid,
           sendName: userInfo.displayName,
           SenderPhoto: userInfo.PhotoUrl,
           ReceivedID: item.userID,
           ReceivedName : item.username,
           ReciverPhoto: item.photo
         });
      } 
      /*==================================
         Friends Request create DB
     ===================================*/
     return (
      <div className='boxcontainer'>
    
        {/* Title Holder Part */}
        <div className="titleholder">
            <h2 >All Friends List</h2>
            <LiaThListSolid  className='icon-deatils' />  
        </div>        
        {/* Title Holder Part */}
      
        {/* Search Box  Start*/}
         
        <div className='search'>
           <input type="text"
            className='search-box' 
            placeholder="Search Your Friend Name" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}  />
           <IoSearch className='search-icon' />
           <MdKeyboardVoice className='search-icon2' />
        </div>
        
        {/* Search Box  end*/}
        {/*=======================================
                 Here UserList  Read Here    
        ========================================*/}

        <div className="box">
          {filteredUserList.map((item) => (
          <div className='box-inner' key={item.userID}>
            {/* Image with Name Part Start */}
            <img src={item.photo} alt="" className="box-img" /> 
            <h3 className='box-username'>{item.username}</h3>
            {/* Image with Name Part End */}
            {/* mutual list start*/}
            <div className='mutal'>
              {/* <div>
                <img src={mutaul1} 
                 className="mutaul-img1" />
                <img src={mutaul2} 
                 className="mutaul-img2" />
              </div>
                <h4 style={{fontSize: "14px",fontWeight: "300"}}>
                  4 mutual friends
                </h4> */}
            </div>
            {/* mutual list start */}
            {/*button part start*/}
            <div className='btn-part'>
              {/* Pending Part Start */}
              {friendRequest.includes(item.userID + userInfo.uid)
               || friendRequest.includes(userInfo.uid + item.userID)
               ? <button className="button-54" disabled>
                    <BiLoaderCircle /> Pending
                </button> 
               :
               // Pending Part end
               // Friends Part start
               friendShow.includes(item.userID + userInfo.uid) 
               || friendShow.includes(userInfo.uid + item.userID)
               ?<button className="button-54" disabled>
                   <BiLoaderCircle /> Friends
                </button> :
               // Friends Part end
               // Add Part start
               <button className="button-54" 
                 onClick={() => handleFriendRequest(item)}>
                 <IoPersonAdd /> Add
               </button>
               // Add Part end
              }
            </div>
            {/*button part End*/}
          </div>
          ))}
        </div>      

        {/* =======================================
                 Here UserList  Read Here    
        ========================================*/}
     
      </div>
    );
}; 

export default UserList;