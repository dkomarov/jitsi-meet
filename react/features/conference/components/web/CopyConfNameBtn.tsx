import React from 'react';

const CopyConfNameBtn: React.FC = () => {
    const handleCopy = () => {
        console.log('COPY BUTTON!!!');
    };

    return <button onClick={handleCopy}>COPY</button>;
};

export default CopyConfNameBtn;
