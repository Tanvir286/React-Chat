import React, { useEffect } from 'react';
import "./Root.css"
import { Outlet } from 'react-router-dom';
import SideBar from '../sideBar/SideBar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const Root = () => {
  
  let navigate = useNavigate();
   
  /* ======================================  
  Here, i. state data takle user jabe
       ii. user data takle value te jabe
      ? ata use kora hoise value check kora jono
  =======================================*/

  let data = useSelector((state) => state?.user?.value)

  /*==========(  email  na thake tahole login page Chole jabe  )===========*/
    useEffect(() => {     
      //  console.log(data,"ki");
       // redux default behavior hoilo  reload korle empty hoiya jai jar karone logout hoiya jai
       if(!data?.email){
        navigate('/login')
       } 
    },[])
  /*==========(  email  na thake tahole login page Chole jabe  )===========*/

    return ( 
        <div className='RootBox'>
               {/*◁==========( DashBorad Part here 🚩)===========*/}
               <div className="SideBar">
                   <SideBar/>
               </div>
               {/* ◁============( DashBorad Part here )===============▷ */}
               {/* ◁==========( Outlet  Part here  here 🚩)===========▷  */}         
               <div className='outlet'>
                   <Outlet />
               </div>
               {/* ◁==========( Outlet  Part here  here )===========▷ */}
        </div>
    );
};

export default Root;