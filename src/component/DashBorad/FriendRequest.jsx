import { getDatabase, ref, onValue ,set,push,remove} from "firebase/database";
import { useSelector } from 'react-redux';
import React, { useEffect,useState } from 'react';
import { FaPodcast } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { MdKeyboardVoice } from "react-icons/md";
import { RiUserAddFill } from "react-icons/ri";
import { MdOutlineDisabledByDefault } from "react-icons/md";

const FriendRequest = () => {

    const db = getDatabase();
    let [searchTerm, setSearchTerm] = useState('');
    let [RequestList,setRequestList] = useState([]);

    /*======= Active User ==========*/
    let userInfo = useSelector(state=>state.user.value)
    console.log(userInfo.displayName); 
    /*======= Active User ==========*/
    
    console.log(RequestList);
    /*===============================
         Here Who send a request
    ================================*/
    useEffect(()=>{ 
      const friendrequestRef = ref(db, 'friendrequest');
      onValue(friendrequestRef, (snapshot) => {
        const arr = [];
        console.log(arr);  
        snapshot.forEach(item => { 
         const data = item.val() 
         if(userInfo.displayName == data.ReceivedName){         
           arr.push({
             ...item.val(),           
             id:item.key,      
              }); 
             }        
          });
         setRequestList(arr);
        });
    },[])
    /*===============================
         Here Who send a request
    ================================*/
    /*===============================
        Handle friend Accept part
    ==================================*/
     let handlefriendAccept = (item) =>{
        console.log(item); 
        set(push(ref(db, 'friends/')), {
          ...item            // ar mane item a j ase tai add hobe DB 
        }).then(()=>{
          remove(ref(db, 'friendrequest/' + item.id));
        })      
      }  
     /*==============================
         Handle friend Accept part
     ================================*/
     /*==============================
       Friend Request Rejected here  
      ===============================*/
      let handleDelete = (id) =>{
        remove(ref(db, 'friendrequest/' + id)); 
      }
     /*==============================
        Friend Request Rejected here  
      ===============================*/
      /*==============================
              Search Area Start
      ===============================*/
     console.log(RequestList);
     const filteredUserList = RequestList.filter(item => {
      return (
      ( item.ReceivedName.toLowerCase().includes(searchTerm.toLowerCase()))
      ||
      ( item.sendName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
     });
    /*===============================
               Search Arear End 
     ===============================*/
     return (
     <div className='boxcontainer'>
        {/* Title Holder Part */}
        <div className="titleholder">
          <h2 >Friend Request</h2>
          <FaPodcast className='icon-deatils' />
        </div>        
        {/* Title Holder Part */}
        {/* This is Empty Part */}
        { RequestList.length == 0 &&
          <h1 className='empty'>There are no friend request at this time</h1>
        }
        {/* This is Empty Part */}
        {/* Search Box */}
        <div className='search'>
           <input type="text" 
            className='search-box' 
            placeholder="Search Your Friend Name" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}  />
           <IoSearch className='search-icon' />
           <MdKeyboardVoice className='search-icon2' />
         </div>
        {/* Search Box */}
        {/* =========================
           FriendRequest  Read Here    
        ============================*/}
        <div className='box'>
        {filteredUserList.map((item)=>{
         return(
            <div className='box-inner'>
              <img src={item.SenderPhoto} className="box-img" />              
              <h3 className='box-username'>{item.sendName}</h3>                    
              {/* This is button part */}
              <div className='btn-part2'>
        
               <button className="button-55" 
                onClick={()=>handlefriendAccept(item)}>
                <RiUserAddFill  className='icon-side' />
                 Add Friend
                </button>  

                <button className="button-56" 
                style={{color:"#ED0800"}} 
                onClick={()=>handleDelete(item.id)} >
                <MdOutlineDisabledByDefault 
                className='icon-side' />Cancle</button>
                  
              </div>
              {/* This is button part */}       
             </div>
             )
             })
            }
        </div>  
        {/* =========================
           FriendRequest  Read Here    
        ============================*/}
     
     </div>
    );
};

export default FriendRequest;