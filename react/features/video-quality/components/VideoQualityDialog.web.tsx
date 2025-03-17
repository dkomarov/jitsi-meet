import React, { Component } from 'react';

import Dialog from '../../base/ui/components/web/Dialog';

import VideoQualitySlider from './VideoQualitySlider.web';

/**
 * Implements a React {@link Component} which displays the component
 * {@code VideoQualitySlider} in a dialog.
 *
 * @augments Component
 */
export default class VideoQualityDialog extends Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    override render() {
        return (
            // @ts-ignore  @ts-expect-error
            <Dialog
                // hideCancelButton = { true }
                cancel={{ hidden: true }}
                ok={{ hidden: true }} // "dialog.done" // okKey
                titleKey="videoStatus.callQuality"
                // width="small"
            >
                {/* @ts-ignore  @ts-expect-error */}
                <VideoQualitySlider />
            </Dialog>
        );
    }
}
