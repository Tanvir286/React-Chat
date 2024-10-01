import React from 'react';
import Icon from './Icon';

const SideBarIcon = ({Iconname,Deatils,className}) => {
    return (
        <div className={className}>
             <Icon Iconname={Iconname} />
              <p>{Deatils}</p>
        </div>
    );
};

export default SideBarIcon;