import { Key } from 'webdriverio';

import BaseDialog from './BaseDialog';

const VIDEO_QUALITY_SLIDER_CLASS = 'custom-slider';

/**
 * The video quality dialog.
 */
export default class VideoQualityDialog extends BaseDialog {
    /**
     * Opens the video quality dialog and sets the video quality to the minimum or maximum definition.
     * @param lowBandwidthMode - Whether to set the video quality to audio only (minimum).
     * @private
     */
    async setVideoQuality(lowBandwidthMode: boolean) {
        await this.participant.getToolbar().clickVideoQualityButton();

        const videoQualitySlider = this.participant.driver.$(`.${VIDEO_QUALITY_SLIDER_CLASS}`);

        const lowBandwidthModeSliderValue = parseInt(await videoQualitySlider.getAttribute('min'), 10);

        const maxDefinitionSliderValue = parseInt(await videoQualitySlider.getAttribute('max'), 10);
        const activeValue = parseInt(await videoQualitySlider.getAttribute('value'), 10);

        const targetValue = lowBandwidthMode ? lowBandwidthModeSliderValue : maxDefinitionSliderValue;
        const distanceToTargetValue = targetValue - activeValue;
        const keyDirection = distanceToTargetValue > 0 ? Key.ArrowRight : Key.ArrowLeft;

        // we need to click the element to activate it so it will receive the keys
        await videoQualitySlider.click();

        // Move the slider to the target value.
        for (let i = 0; i < Math.abs(distanceToTargetValue); i++) {
            await this.participant.driver.keys(keyDirection);
        }

        // Close the video quality dialog.
        await this.clickCloseButton();
    }
}
