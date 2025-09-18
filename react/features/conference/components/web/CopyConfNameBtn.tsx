import React from 'react';

const CopyConfNameBtn = () => {
    const handleCopy = () => {
        // console.log('COPY BUTTON!!!');
        let confName, video;
        try {
            // @ts-expect-error
            confName = document.querySelector('[class*="subject-text--content"]').innerText;
            console.log('confName is:', confName);

            if (confName) {
                window.parent.postMessage('confName is: ' + confName, '*');

                console.log('VPS requested PiP mode!');
            }

            video = document.getElementById('largeVideo');

            if (video) {
                console.log('Video element is:', video);

                // video.requestPictureInPicture();
            } else {
                console.log('Video element is missing or null!');
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
