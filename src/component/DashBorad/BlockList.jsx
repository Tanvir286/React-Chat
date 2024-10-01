import { getDatabase, ref, onValue,remove} from "firebase/database";
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { MdAppBlocking } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { MdKeyboardVoice } from "react-icons/md";

const BlockList = () => {

   const db = getDatabase();
   let [blockList,setBlockList] = useState([]); 
   let [searchTerm, setSearchTerm] = useState('');
   
   /*======= Active User ==========*/
   let userInfo = useSelector(state=>state.user.value)
   console.log(userInfo.displayName);
   /*======= Active User ==========*/
    
   /*==============================
           Blocker List Show here
   ================================*/
    useEffect(()=>{
      const BlockRef = ref(db, 'Block/' );
      onValue(BlockRef, (snapshot) => {
        const arr = [];
        snapshot.forEach(item => {
          const data =  item.val()
          console.log(data); 
          if(data.BlockerID == userInfo.uid 
             || data.VictimID == userInfo.uid ){
              arr.push({...item.val(),blockId:item.key} )       
             }
           });  
        setBlockList(arr)     
        });
     },[])

     /*=============================
         Blocker List Show here
     ===============================*/
     /*==============================
              UnBlock Method Here 
      ==============================*/
      let handleUnblock = (id) => {
        remove(ref(db, 'Block/' + id));       
     }
     /*===============================
              UnBlock Method Here 
      ================================*/
     /*================================
              Search Area Start
      =================================*/
      console.log(blockList);
      const filteredUserList = blockList.filter(item => {
      return (
          ( item.BlockerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          ( item.VictimName.toLowerCase().includes(searchTerm.toLowerCase()))
        );
       });
    /*================================= 
               Search Arear End 
     =================================*/
    return (
    <div className='boxcontainer'>
      {/* Title Holder Part */}
      <div className="titleholder">
         <h2 >Block List</h2>
        <MdAppBlocking className='icon-deatils' /> 
      </div>        
      {/* Title Holder Part */}
      {/* This is Empty Part */}       
      {blockList.length == 0 &&
      <h1 className='empty'>
         There are currently no friends on the block list 
      </h1>}
      {/* This is Empty Part */}
         
      {/* Search Box  Area Start */}
      <div className='search'>
        <input type="text" 
         className='search-box' 
         placeholder="Search Your Friend Name" 
         value={searchTerm}
         onChange={(e) => setSearchTerm(e.target.value)}  />
         <IoSearch className='search-icon' />
         <MdKeyboardVoice className='search-icon2' />
      </div> 
       {/* Search Box  Area End */}
        {/* =========================
             BlockList  Read Here    
        ============================*/}
        <div className='box'>
          {filteredUserList.map((item)=>{
           console.log(item);
           return(
          <div className="box-inner">
            {/* image */}
            <img 
             src={item.BlockerID == userInfo.uid? 
             item.VictimPicture :item.BlockerPicture} 
             className="box-img" /> 
            {/* name */}
            { item.BlockerID == userInfo.uid?
              <h3>{item.VictimName}</h3>:
              <h3>{item.BlockerName}</h3>
            }                 
            {/* This is btn part */}
            <div className='btn-part'> 
               <div >
              {/* Unblock */}
              { item.BlockerID == userInfo.uid?
                 <button  className='button-54' 
                  onClick={()=>handleUnblock(item.blockId)}>
                  Unblock
                 </button>:
                //  pending
                 <button  className='button-54' disabled >pending</button>}
               </div>
            </div> 
         </div>
                   
           )
          })
        }
        </div>
        {/* =========================
             BlockList  Read Here    
        ============================*/}
     
    </div>
    );
};

export default BlockList;