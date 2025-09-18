import React from 'react';

const CopyConfNameBtn = () => {
    const handleCopy = () => {
        // console.log('COPY BUTTON!!!');
        let confName;
        const video = document.querySelector('video');

        try {
            // @ts-expect-error
            confName = document.querySelector('[class*="subject-text--content"]').innerText;
            console.log('confName is:', confName);

            if (confName) {
                window.parent.postMessage('confName is: ' + confName, '*');
                console.log('Video element is:', video);

                // @ts-expect-error
                video.requestPictureInPicture();
                console.log('VPS requested PiP mode!');
            }
        } catch (err) {
            console.log('Error accessing conference name:', err);
        }
    };

    return (
        <button onClick={handleCopy} data-toggle="tooltip" title="Copy meeting name.">
            <i className="fa-solid fa-copy"></i>
        </button>
    );
};

export default CopyConfNameBtn;
