import React from 'react';


const Image = ({imageName,altText,className}) => {
    return (
        <img src={`./assets/${imageName}`} alt={altText}  className={className} />
    );
};

export default Image;