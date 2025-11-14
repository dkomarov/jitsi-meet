// @flow

import React from 'react';

import { translate } from '../../base/i18n/functions';
// import { Label } from "../../base/label";
import { MEDIA_TYPE } from '../../base/media/constants';
// import { connect } from "../../base/redux";
// import { Tooltip } from "../../base/tooltip";
import { getTrackByMediaTypeAndParticipant } from '../../base/tracks/functions.any';
import { shouldDisplayTileView } from '../../video-layout/functions.web';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { IReduxState, IStore } from '../../app/types';
import { openDialog } from '../../base/dialog/actions';
// import { translate } from '../../base/i18n/functions';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { IconPerformance } from '../../base/icons/svg';
import Label from '../../base/label/components/web/Label';
import { COLORS } from '../../base/label/constants';
import Tooltip from '../../base/tooltip/components/Tooltip';
import { shouldDisplayVideoQualityLabel } from '../selector';

import AbstractVideoQualityLabel, {
    IProps as AbstractProps,
    // type Props as AbstractProps,
    _abstractMapStateToProps
} from './AbstractVideoQualityLabel';

// declare var interfaceConfig: Object;

interface IProps extends AbstractProps {
    /**
     * The message to show within the label.
     */
    _labelKey: string;
    /**
     * Whether to show video quality label or not.
     */
    _showVideoQualityLabel: boolean;
    /**
     * The message to show within the label's tooltip.
     */
    _tooltipKey: string;

    /**
     * Flag controlling visibility of the component.
     */
    _visible: boolean;

    /**
     * The redux representation of the JitsiTrack displayed on large video.
     */
    _videoTrack: Object;

    /**
     * The redux dispatch function.
     */
    dispatch: IStore['dispatch'];
}

import VideoQualityDialog from './VideoQualityDialog.web';

/**
 * A map of video resolution (number) to translation key.
 *
 * @type {Object}
 */
const RESOLUTION_TO_TRANSLATION_KEY = {
    '720': 'videoStatus.hd',
    '360': 'videoStatus.sd',
    '180': 'videoStatus.ld'
};

/**
 * Expected video resolutions placed into an array, sorted from lowest to
 * highest resolution.
 *
 * @type {number[]}
 */
const RESOLUTIONS = Object.keys(RESOLUTION_TO_TRANSLATION_KEY)
    .map((resolution) => parseInt(resolution, 10))
    .sort((a, b) => a - b);

/**
 * React {@code Component} responsible for displaying a label that indicates
 * the displayed video state of the current conference. {@code AudioOnlyLabel}
 * Will display when the conference is in audio only mode. {@code HDVideoLabel}
 * Will display if not in audio only mode and a high-definition large video is
 * being displayed.
 *
 * @returns {JSX}
 */
export class VideoQualityLabel extends AbstractVideoQualityLabel<IProps> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    override render() {
        const { _audioOnly, _labelKey, _tooltipKey, _videoTrack, _visible, dispatch, t } = this.props;

        if (!_visible) {
            return null;
        }

        let className, icon, labelContent, tooltipKey;

        if (_audioOnly) {
            className = 'audio-only';
            labelContent = t('videoStatus.audioOnly');
            tooltipKey = 'videoStatus.labelTooltipAudioOnly';
            // @ts-ignore
        } else if (!_videoTrack || _videoTrack.muted) {
            className = 'no-video';
            labelContent = t('videoStatus.audioOnly');
            tooltipKey = 'videoStatus.labelTooiltipNoVideo';
        } else {
            className = 'current-video-quality';
            icon = IconPerformance;
            labelContent = t(_labelKey);
            tooltipKey = _tooltipKey;
        }

        // const VideoQualityLabel = () => {
        //     const _audioOnly = useSelector((state: IReduxState) => state['features/base/audio-only'].enabled);
        //     const _visible = useSelector((state: IReduxState) => !(shouldDisplayTileView(state)
        //         || interfaceConfig.VIDEO_QUALITY_LABEL_DISABLED));
        //     const dispatch = useDispatch();
        //     const { t } = useTranslation();

        //     if (!_visible) {
        //         return null;
        //     }

        // let className, icon, labelContent, tooltipKey;

        // const onClick = () => dispatch(openDialog(VideoQualityDialog));

        return (
            <Tooltip content={t(tooltipKey)} position={'bottom'}>
                <Label
                    accessibilityText={t(tooltipKey)}
                    className={className}
                    color={COLORS.white}
                    // @ts-ignore  @ts-expect-error
                    icon={icon}
                    iconColor="#fff"
                    id="videoResolutionLabel"
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick={onClick}
                    text={labelContent}
                />
            </Tooltip>
        );
    }
}

// const dispatch = useDispatch();

/**
 * Matches the passed in resolution with a translation keys for describing
 * the resolution. The passed in resolution will be matched with a known
 * resolution that it is at least greater than or equal to.
 *
 * @param {number} resolution - The video height to match with a
 * translation.
 * @private
 * @returns {Object}
 */
// @ts-ignore // @ts-expect-error
function _mapResolutionToTranslationsKeys(resolution) {
    // Set the default matching resolution of the lowest just in case a match is
    // not found.
    let highestMatchingResolution = RESOLUTIONS[0];

    for (let i = 0; i < RESOLUTIONS.length; i++) {
        const knownResolution = RESOLUTIONS[i];

        if (resolution >= knownResolution) {
            highestMatchingResolution = knownResolution;
        } else {
            break;
        }
    }

    // @ts-ignore // @ts-expect-error
    const labelKey = RESOLUTION_TO_TRANSLATION_KEY[highestMatchingResolution];

    return {
        labelKey,
        tooltipKey: `${labelKey}Tooltip`
    };
}

// /**
//  * Maps (parts of) the Redux state to the associated {@code VideoQualityLabel}'s
//  * props.
//  *
//  * @param {Object} state - The Redux state.
//  * @private
//  * @returns {{
//  *     _audioOnly: boolean,
//  *     _visible: boolean
//  * }}
//  */
// function _mapStateToProps(state: IReduxState) {
//     return {
//         ..._abstractMapStateToProps(state),
//         _visible: !(
//             shouldDisplayTileView(state) ||
//             interfaceConfig.VIDEO_QUALITY_LABEL_DISABLED
//         )
//     };
// }

/**
 * Maps (parts of) the Redux state to the associated {@code VideoQualityLabel}'s
 * props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _labelKey: string,
 *     _tooltipKey: string,
 *     _videoTrack: Object
 * }}
 */
function _mapStateToProps(state: IReduxState) {
    const { enabled: audioOnly } = state['features/base/audio-only'];
    const { resolution, participantId } = state['features/large-video'];
    const videoTrackOnLargeVideo = getTrackByMediaTypeAndParticipant(
        state['features/base/tracks'],
        MEDIA_TYPE.VIDEO,
        participantId
    );

    // const onClick = () => dispatch(openDialog('VideoQualityDialog', VideoQualityDialog));

    // return (
    //     <Tooltip content={t(tooltipKey)} position={'bottom'}>
    //         <Label
    //             accessibilityText={t(tooltipKey)}
    //             className={className}
    //             color={COLORS.white}
    //             icon={icon}
    //             iconColor="#fff"
    //             id="videoResolutionLabel"
    //             // eslint-disable-next-line react/jsx-no-bind
    //             onClick={onClick}
    //             text={labelContent}
    //         />
    //     </Tooltip>
    // );

    const translationKeys = audioOnly ? {} : _mapResolutionToTranslationsKeys(resolution);

    return {
        ..._abstractMapStateToProps(state),
        // @ts-ignore  @ts-expect-error
        _labelKey: translationKeys.labelKey,
        // @ts-ignore  @ts-expect-error
        _tooltipKey: translationKeys.tooltipKey,
        _videoTrack: videoTrackOnLargeVideo,
        _visible: !(
            shouldDisplayTileView(state) ||
            // @ts-ignore  @ts-expect-error
            interfaceConfig.VIDEO_QUALITY_LABEL_DISABLED
        )
    };
}

// @ts-ignore
export default translate(connect(_mapStateToProps)(VideoQualityLabel));

//     if (_audioOnly) {
//         className = 'audio-only';
//         labelContent = t('videoStatus.audioOnly');
//         tooltipKey = 'videoStatus.labelTooltipAudioOnly';
//     } else {
//         className = 'current-video-quality';
//         icon = IconPerformance;
//         tooltipKey = 'videoStatus.performanceSettings';
//     }

//     const onClick = () => dispatch(openDialog(VideoQualityDialog));

//     return (
//         <Tooltip
//             content = { t(tooltipKey) }
//             position = { 'bottom' }>
//             <Label
//                 accessibilityText = { t(tooltipKey) }
//                 className = { className }
//                 color = { COLORS.white }
//                 icon = { icon }
//                 iconColor = '#fff'
//                 id = 'videoResolutionLabel'
//                 // eslint-disable-next-line react/jsx-no-bind
//                 onClick = { onClick }
//                 text = { labelContent } />
//         </Tooltip>
//     );
// };

// export default VideoQualityLabel;
