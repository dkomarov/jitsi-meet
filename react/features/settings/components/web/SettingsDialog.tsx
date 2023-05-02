import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from 'tss-react/mui';

import { IReduxState } from '../../../app/types';
import {
    IconBell,
    IconCalendar,
    IconGear,
    IconImage,
    IconModerator,
    IconShortcuts,
    IconUser,
    IconVideo,
    IconVolumeUp
} from '../../../base/icons/svg';
import DialogWithTabs, { IDialogTab } from '../../../base/ui/components/web/DialogWithTabs';
import { isCalendarEnabled } from '../../../calendar-sync/functions.web';
import { submitAudioDeviceSelectionTab, submitVideoDeviceSelectionTab } from '../../../device-selection/actions.web';
import AudioDevicesSelection from '../../../device-selection/components/AudioDevicesSelection';
import VideoDeviceSelection from '../../../device-selection/components/VideoDeviceSelection';
import {
    getAudioDeviceSelectionDialogProps,
    getVideoDeviceSelectionDialogProps
} from '../../../device-selection/functions.web';
import { checkBlurSupport } from '../../../virtual-background/functions';
import {
    submitModeratorTab,
    submitMoreTab,
    submitNotificationsTab,
    submitProfileTab,
    submitShortcutsTab,
    submitVirtualBackgroundTab
} from '../../actions';
import { SETTINGS_TABS } from '../../constants';
import {
    getModeratorTabProps,
    getMoreTabProps,
    getNotificationsMap,
    getNotificationsTabProps,
    getProfileTabProps,
    getShortcutsTabProps,
    getVirtualBackgroundTabProps
} from '../../functions';

import CalendarTab from './CalendarTab';
import ModeratorTab from './ModeratorTab';
import MoreTab from './MoreTab';
import NotificationsTab from './NotificationsTab';
import ProfileTab from './ProfileTab';
import ShortcutsTab from './ShortcutsTab';
import VirtualBackgroundTab from './VirtualBackgroundTab';

/**
 * The type of the React {@code Component} props of
 * {@link ConnectedSettingsDialog}.
 */
interface IProps {

    /**
     * Information about the tabs to be rendered.
     */
    _tabs: Array<{
        name: string;
        onMount: () => void;
        submit: () => void;
    }>;

    /**
     * An object containing the CSS classes.
     */
    classes: Object;
    _tabs: IDialogTab<any>[];

    /**
     * Which settings tab should be initially displayed. If not defined then
     * the first tab will be displayed.
     */
    defaultTab: string;

    /**
     * Invoked to save changed settings.
     */
    dispatch: Function;

    /**
     * Indicates whether the device selection dialog is displayed on the
     * welcome page or not.
     */
    isDisplayedOnWelcomePage: boolean;
}

const useStyles = makeStyles()(() => {
    return {
        settingsDialog: {
            display: 'flex',

            width: '100%',

            '&.profile-pane': {
                flexDirection: 'column'
            },

            '& .auth-name': {
                marginBottom: theme.spacing(1)
            },

            '& .calendar-tab, & .device-selection': {
                marginTop: '20px'
            },

            '& .mock-atlaskit-label': {
                color: '#b8c7e0',
                fontSize: '12px',
                fontWeight: 600,
                lineHeight: 1.33,
                padding: `20px 0px ${theme.spacing(1)} 0px`
            },

            '& .checkbox-label': {
                color: theme.palette.text01,
                ...withPixelLineHeight(theme.typography.bodyShortRegular),
                marginBottom: theme.spacing(2),
                display: 'block',
                marginTop: '20px'
            },

            '& input[type="checkbox"]:checked + svg': {
                '--checkbox-background-color': '#6492e7',
                '--checkbox-border-color': '#6492e7'
            },

            '& input[type="checkbox"] + svg + span': {
                color: '#9FB0CC'
            },

            // @ts-ignore
            [[ '& .calendar-tab',
                '& .more-tab',
                '& .box' ]]: {
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%'
            },

            '& .profile-edit': {
                display: 'flex',
                width: '100%'
            },

            '& .profile-edit-field': {
                flex: 0.5,
                marginRight: '20px',
                marginTop: theme.spacing(3)
            },

            '& .settings-sub-pane': {
                flex: 1
            },

            '& .settings-sub-pane .right': {
                flex: 1
            },
            '& .settings-sub-pane .left': {
                flex: 1
            },

            '& .settings-sub-pane-element': {
                textAlign: 'left',
                flex: 1
            },

            '& .dropdown-menu': {
                marginTop: '20px'
            },

            '& .settings-checkbox': {
                display: 'flex',
                marginBottom: theme.spacing(2)
            },

            '& .moderator-settings-wrapper': {
                paddingTop: '20px'
            },

            '& .calendar-tab': {
                alignItems: 'center',
                flexDirection: 'column',
                fontSize: '14px',
                minHeight: '100px',
                textAlign: 'center'
            },

            '& .calendar-tab-sign-in': {
                marginTop: '20px'
            },

            '& .sign-out-cta': {
                marginBottom: '20px'
            },

            '& .sign-out-cta-button': {
                display: 'flex',
                justifyContent: 'center'
            },

            '@media only screen and (max-width: 700px)': {
                '& .device-selection': {
                    display: 'flex',
                    flexDirection: 'column'
                },

                '& .more-tab': {
                    flexDirection: 'column'
                }

            width: '100%'

        }
    };
});

const SettingsDialog = ({ _tabs, defaultTab, dispatch }: IProps) => {
    const { classes } = useStyles();

    const correctDefaultTab = _tabs.find(tab => tab.name === defaultTab)?.name;
    const tabs = _tabs.map(tab => {
        return {
            ...tab,
            className: `settings-pane ${classes.settingsDialog}`,
            submit: (...args: any) => tab.submit
                && dispatch(tab.submit(...args))
        };
    });

    return (
        <DialogWithTabs
            className = 'settings-dialog'
            defaultTab = { correctDefaultTab }
            tabs = { tabs }
            titleKey = 'settings.title' />
    );
};

/**

 * A React {@code Component} for displaying a dialog to modify local settings
 * and conference-wide (moderator) settings. This version is connected to
 * redux to get the current settings.
 *
 * @augments Component
 */
class SettingsDialog extends Component<IProps> {
    /**
     * Initializes a new {@code ConnectedSettingsDialog} instance.
     *
     * @param {IProps} props - The React {@code Component} props to initialize
     * the new {@code ConnectedSettingsDialog} instance with.
     */
    constructor(props: IProps) {
        super(props);

        // Bind event handlers so they are only bound once for every instance.
        this._closeDialog = this._closeDialog.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _tabs, defaultTab, dispatch } = this.props;
        const onSubmit = this._closeDialog;
        const defaultTabIdx
            = _tabs.findIndex(({ name }) => name === defaultTab);
        const tabs = _tabs.map(tab => {
            return {
                ...tab,
                onMount: tab.onMount

                    // @ts-ignore
                    ? (...args: any) => dispatch(tab.onMount(...args))
                    : undefined,
                submit: (...args: any) => tab.submit

                    // @ts-ignore
                    && dispatch(tab.submit(...args))
            };
        });

        return (
            <DialogWithTabs
                closeDialog = { this._closeDialog }
                cssClassName = 'settings-dialog'
                defaultTab = {
                    defaultTabIdx === -1 ? undefined : defaultTabIdx
                }
                onSubmit = { onSubmit }
                tabs = { tabs }
                titleKey = 'settings.title' />
        );
    }

    /**
     * Callback invoked to close the dialog without saving changes.
     *
     * @private
     * @returns {void}
     */
    _closeDialog() {
        this.props.dispatch(hideDialog());
    }
}

/**

 * Maps (parts of) the Redux state to the associated props for the
 * {@code ConnectedSettingsDialog} component.
 *
 * @param {Object} state - The Redux state.
 * @param {Object} ownProps - The props passed to the component.
 * @private
 * @returns {{
 *     tabs: Array<Object>
 * }}
 */
function _mapStateToProps(state: IReduxState, ownProps: any) {
    const { isDisplayedOnWelcomePage } = ownProps;
    const configuredTabs = interfaceConfig.SETTINGS_SECTIONS || [];

    // The settings sections to display.
    const showDeviceSettings = configuredTabs.includes('devices');
    const moreTabProps = getMoreTabProps(state);
    const moderatorTabProps = getModeratorTabProps(state);
    const { showModeratorSettings } = moderatorTabProps;
    const showMoreTab = configuredTabs.includes('more');
    const showProfileSettings
        = configuredTabs.includes('profile') && !state['features/base/config'].disableProfile;
    const showCalendarSettings
        = configuredTabs.includes('calendar') && isCalendarEnabled(state);
    const showSoundsSettings = configuredTabs.includes('sounds');

    const tabs = [];

    if (showDeviceSettings) {
        tabs.push({
            name: SETTINGS_TABS.DEVICES,
            component: DeviceSelection,
            label: 'settings.devices',
            onMount: getAvailableDevices,
            props: getDeviceSelectionDialogProps(state, isDisplayedOnWelcomePage),
            propsUpdateFunction: (tabState: any, newProps: any) => {

    const enabledNotifications = getNotificationsMap(state);
    const showNotificationsSettings = Object.keys(enabledNotifications).length > 0;
    const virtualBackgroundSupported = checkBlurSupport();
    const tabs: IDialogTab<any>[] = [];

    if (showDeviceSettings) {
        tabs.push({
            name: SETTINGS_TABS.AUDIO,
            component: AudioDevicesSelection,
            labelKey: 'settings.audio',
            props: getAudioDeviceSelectionDialogProps(state, isDisplayedOnWelcomePage),
            propsUpdateFunction: (tabState: any, newProps: ReturnType<typeof getAudioDeviceSelectionDialogProps>) => {

                // Ensure the device selection tab gets updated when new devices
                // are found by taking the new props and only preserving the
                // current user selected devices. If this were not done, the
                // tab would keep using a copy of the initial props it received,
                // leaving the device list to become stale.

                return {
                    ...newProps,
                    noiseSuppressionEnabled: tabState.noiseSuppressionEnabled,
                    selectedAudioInputId: tabState.selectedAudioInputId,
                    selectedAudioOutputId: tabState.selectedAudioOutputId
                };
            },
            styles: `settings-pane ${classes.settingsDialog} devices-pane`,
            submit: (newState: any) => submitAudioDeviceSelectionTab(newState, isDisplayedOnWelcomePage),
            icon: IconVolumeUp
        });
        tabs.push({
            name: SETTINGS_TABS.VIDEO,
            component: VideoDeviceSelection,
            labelKey: 'settings.video',
            props: getVideoDeviceSelectionDialogProps(state, isDisplayedOnWelcomePage),
            propsUpdateFunction: (tabState: any, newProps: ReturnType<typeof getVideoDeviceSelectionDialogProps>) => {
                // Ensure the device selection tab gets updated when new devices
                // are found by taking the new props and only preserving the
                // current user selected devices. If this were not done, the
                // tab would keep using a copy of the initial props it received,
                // leaving the device list to become stale.

                return {
                    ...newProps,
                    currentFramerate: tabState?.currentFramerate,
                    localFlipX: tabState.localFlipX,
                    selectedVideoInputId: tabState.selectedVideoInputId
                };
            },
            submit: (newState: any) => submitVideoDeviceSelectionTab(newState, isDisplayedOnWelcomePage),
            icon: IconVideo
        });
    }

    if (virtualBackgroundSupported) {
        tabs.push({
            name: SETTINGS_TABS.VIRTUAL_BACKGROUND,
            component: VirtualBackgroundTab,
            labelKey: 'virtualBackground.title',
            props: getVirtualBackgroundTabProps(state),
            submit: (newState: any) => submitVirtualBackgroundTab(newState),
            cancel: () => {
                const { _virtualBackground } = getVirtualBackgroundTabProps(state);

                return submitVirtualBackgroundTab({
                    options: {
                        backgroundType: _virtualBackground.backgroundType,
                        enabled: _virtualBackground.backgroundEffectEnabled,
                        url: _virtualBackground.virtualSource,
                        selectedThumbnail: _virtualBackground.selectedThumbnail,
                        blurValue: _virtualBackground.blurValue
                    }
                }, true);
            },
            icon: IconImage
        });
    }

    if (showSoundsSettings || showNotificationsSettings) {
        tabs.push({
            name: SETTINGS_TABS.NOTIFICATIONS,
            component: NotificationsTab,
            labelKey: 'settings.notifications',
            propsUpdateFunction: (tabState: any, newProps: ReturnType<typeof getNotificationsTabProps>) => {
                return {
                    ...newProps,
                    enabledNotifications: tabState?.enabledNotifications || {},
                    soundsIncomingMessage: tabState?.soundsIncomingMessage,
                    soundsParticipantJoined: tabState?.soundsParticipantJoined,
                    soundsParticipantKnocking: tabState?.soundsParticipantKnocking,
                    soundsParticipantLeft: tabState?.soundsParticipantLeft,
                    soundsReactions: tabState?.soundsReactions,
                    soundsTalkWhileMuted: tabState?.soundsTalkWhileMuted
                };
            },
            props: getNotificationsTabProps(state, showSoundsSettings),
            submit: submitNotificationsTab,
            icon: IconBell
        });
    }

    if (showModeratorSettings) {
        tabs.push({
            name: SETTINGS_TABS.MODERATOR,
            component: ModeratorTab,
            label: 'settings.moderator',
            props: moderatorTabProps,
            propsUpdateFunction: (tabState: any, newProps: typeof moderatorTabProps) => {
                // Updates tab props, keeping users selection

                return {
                    ...newProps,
                    followMeEnabled: tabState?.followMeEnabled,
                    startAudioMuted: tabState?.startAudioMuted,
                    startVideoMuted: tabState?.startVideoMuted,
                    startReactionsMuted: tabState?.startReactionsMuted
                };
            },
            submit: submitModeratorTab,
            icon: IconModerator
        });
    }

    if (showProfileSettings) {
        tabs.push({
            name: SETTINGS_TABS.PROFILE,
            component: ProfileTab,
            labelKey: 'profile.title',
            props: getProfileTabProps(state),
            submit: submitProfileTab,
            icon: IconUser
        });
    }

    if (showCalendarSettings) {
        tabs.push({
            name: SETTINGS_TABS.CALENDAR,
            component: CalendarTab,
            labelKey: 'settings.calendar.title',
            icon: IconCalendar
        });
    }

    tabs.push({
        name: SETTINGS_TABS.SHORTCUTS,
        component: ShortcutsTab,
        labelKey: 'settings.shortcuts',
        props: getShortcutsTabProps(state, isDisplayedOnWelcomePage),
        propsUpdateFunction: (tabState: any, newProps: ReturnType<typeof getShortcutsTabProps>) => {
            // Updates tab props, keeping users selection

            return {
                ...newProps,
                keyboardShortcutsEnabled: tabState?.keyboardShortcutsEnabled
            };
        },
        submit: submitShortcutsTab,
        icon: IconShortcuts
    });

    if (showMoreTab) {
        tabs.push({
            name: SETTINGS_TABS.MORE,
            component: MoreTab,
            label: 'settings.more',
            props: moreTabProps,
            propsUpdateFunction: (tabState: any, newProps: typeof moreTabProps) => {
                // Updates tab props, keeping users selection

                return {
                    ...newProps,
                    currentLanguage: tabState?.currentLanguage,
                    hideSelfView: tabState?.hideSelfView,
                    showPrejoinPage: tabState?.showPrejoinPage,
                    maxStageParticipants: tabState?.maxStageParticipants
                };
            },
            submit: submitMoreTab,
            icon: IconGear
        });
    }

    return { _tabs: tabs };
}

export default connect(_mapStateToProps)(SettingsDialog);
