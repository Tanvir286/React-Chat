import { getDatabase, ref, onValue ,push,set } from "firebase/database";
import { useSelector } from 'react-redux';
import React, {useEffect, useState} from 'react';
import { AiOutlineGroup } from "react-icons/ai";

const OthersGroup = () => {
  
  const [groupMembers,setGroupMembers] = useState([]);
  const [grouplist,setGrouplist] = useState([]);
  const [groupRequestlist,setgroupRequestlist] = useState([]);
  
  
  /* ========= Active User  Start=========*/
  const db = getDatabase();
  let ActiveUser = useSelector(state=>state.user.value)
  console.log(ActiveUser);
  
//   console.log(ActiveUser);
  /*========== Active User End ==========*/


  /*================================== 
        GroupRequest  List Read   
   ===================================*/
    console.log(grouplist);
    

    // console.log(grouplist);
    useEffect(() =>{
      const groupRef = ref(db, "groups");
      onValue(groupRef, (snapshot) => {
        // const data = snapshot.val();
        const arr = []
        snapshot.forEach(item => {
        if(ActiveUser.displayName != item.val().adminName){
           const data = item.val();
           arr.push({...item.val(),groupId:item.key}) 
        }
        });
        setGrouplist(arr);
        // console.log(grouplist);
       })
    },[])
  /*================================== 
         GroupRequest  List Read   
   ===================================*/
   /*================================== 
         View   GroupsMember  List    
    ===================================*/
    // console.log(groupMembers);
    useEffect(() => {
     const groupMemberRef = ref(db, "groupMember");
     onValue(groupMemberRef, (snapshot) => {
       const arr = [];
       snapshot.forEach(item => {      
         const data = item.val();             
           arr.push({...data, id: item.key});           
         });
       setGroupMembers(arr);
       });   
    }, []); 
    /*================================== 
         View   GroupsMember  List    
    ===================================*/
  /*================================== 
        GroupJion  List create
   ===================================*/
   const handleGroupJoin = (item) =>{
    console.log(item);
    set(push(ref(db, 'groupRequest/' )), {       
        adminID: item.adminID,
        adminName: item.adminName,
        groupName: item.groupName,
        groupPhoto: item.groupPhoto,
        groupID: item.groupId,
        userid: ActiveUser.uid,
        username: ActiveUser.displayName,
        userPhoto: ActiveUser.PhotoUrl
     })
     }
  /*================================== 
        GroupJion  List  Create  
  ====================================*/
  /*================================== 
       GroupRequest  List  Read Here 
   ====================================*/

  console.log(groupRequestlist);
  useEffect(() =>{ 
    const groupRequestRef = ref(db, "groupRequest");
    onValue(groupRequestRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      const arr = []
      snapshot.forEach(item => {    
        const data = item.val();
        arr.push({...item.val(),groupId:item.key}) 
      });
      setgroupRequestlist(arr);
    //   console.log(grouplist);
     })
  },[])

 /*================================== 
     GroupRequest  List  Read Here 
 ====================================*/
 /*================================== 
      renderJoinButton Pending List 
 ====================================*/
 const isRequestPending = (groupId) => {
  return groupRequestlist.some(request => 
    request.groupID === groupId && request.userid === ActiveUser.uid);};

const isFriend = (groupId) => {
  return groupMembers.some(member => 
    member.groupID === groupId && member.userid === ActiveUser.uid);};

 const renderJoinButton = (item) => {
  return isRequestPending(item.groupId) ? 
    <button className='button-22 renderButton' disabled>Pending</button> :
    isFriend(item.groupId) ? <button className='button-22 renderButton' disabled>Member</button> :
    <button className='button-22 renderButton' 
      onClick={() => handleGroupJoin(item)}>Join Request</button>};

/*================================== 
     renderJoinButton Pending List 
====================================*/
  return (
    <div className='groupcontainer'>
        {/* Title Holder Part */}
        <div className="grouptitleholder">
          <h2 className='titleheading'>Others Group</h2> 
          <AiOutlineGroup className='groupTitleIcon' />     
        </div>        
        {/* Title Holder Part */}
        {/*This is Empty List*/}
        {grouplist.length == 0 &&
         <h1 className='emptyGroup'>
           you don't have any  other group  at the moment
         </h1>
         } 
        {/*This is Empty List*/}
          
          {/*=======================
                Other List Group 
            ======================*/}
         <div className='otherGroup'>
        {grouplist.map((item) => {
         console.log(item);
         
          return (
          
              <div className='otherGroupinner' key={item.groupId}>
                {/* Image part */}
                <img src={item.groupPhoto} alt="" className='othergroupimg' />
                {/* Image part */}
                {/* Group name */}
                <h3>{item.groupName}</h3>
                {/* Group name */}
                <h6 className='OtherGroupAdmin'>Created By</h6>
                <div className="OtherAdmininfo">
                  <img src={item.adminPhoto} alt="" className="adminPhoto" />
                  <h6 className='OtherGroupAdmin'>{item.adminName}</h6>
                </div>            
                {/* button part start */}
                <div className='otherBtn'>
                  {renderJoinButton(item)}
                </div>    
                {/* button part end */}
              </div>
            
          );
        })}
      </div>
           {/*======================
                Other List Group 
            ======================*/}
    </div>
    );
};

export default OthersGroup;