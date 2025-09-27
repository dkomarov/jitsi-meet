import React from 'react';

const CopyConfNameBtn = () => {
    const handleCopy = async () => {
        // console.log('COPY BUTTON!!!');
        let confName, video;
        try {
            // @ts-expect-error
            confName = document.querySelector('[class*="subject-text--content"]').innerText;
            console.log('confName is:', confName);

            if (confName) {
                window.parent.postMessage('confName is: ' + confName, '*');
            }

            // try {
            //     // @ts-ignore
            //     video = document.getElementById('largeVideo');

            //     // IMPORTANT: nothing async before this point
            //     if (document.pictureInPictureElement) {
            //         await document.exitPictureInPicture();
            //         return;
            //     } else {
            //         // Make sure the video is loaded/playing. Don't await here before PiP.
            //         // @ts-ignore
            //         if (video.paused) {
            //             // @ts-ignore
            //             video.play().catch(() => {});
            //         }
            //         // @ts-ignore
            //         await video.requestPictureInPicture();
            //     }
            // } catch (err) {
            //     console.log('Error listening for PiP:', err);
            // }
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
