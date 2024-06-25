import React from 'react';

const CopyConfNameBtn = () => {
    const handleCopy = () => {
        console.log('COPY BUTTON!!!');
    };

    return <button onClick={handleCopy}>COPY</button>;
};

export default CopyConfNameBtn;
