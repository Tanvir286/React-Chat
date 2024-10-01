import React from 'react';

const Icon = ({Iconname,className,onClick}) => {
    return (
      <span className={className} onClick={onClick}>{Iconname}</span>
    );
};

export default Icon; 

 
