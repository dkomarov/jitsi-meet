import React, { useCallback, useState } from 'react';

import Icon from '../base/icons/components/Icon';

import '../../../css/custom-icon.mods.css';

interface IProps {
    /**
     * Accessibility label for button.
     */
    accessibilityLabel: string;

    /**
     * An extra class name to be added at the end of the element's class name
     * in order to enable custom styling.
     */
    customClass?: string;

    /**
     * Whether or not the button is disabled.
     */
    disabled?: boolean;

    /**
     * Button icon.
     */
    icon: Function;

    /**
     * Click handler.
     */
    onClick: (e?: React.MouseEvent) => void;

    /**
     * Whether or not the button is toggled.
     */
    toggled?: boolean;
}

export const DEFAULT_COLOR =
    navigator.product === 'ReactNative' ? 'white' : undefined;
export const DEFAULT_SIZE = navigator.product === 'ReactNative' ? 36 : 40; // 22

const ToolbarButton = ({
    accessibilityLabel,
    customClass,
    disabled = false,
    onClick,
    icon,
    toggled = false
}: IProps) => {
    const [iconColor, setColor] = useState(DEFAULT_COLOR);
    const [hasColorChanged, setHasColorChanged] = useState(false);
    const [iconSize, setSize] = useState(DEFAULT_SIZE);
    const [sizeClassName, setHasSizeChanged] = useState('');

    const onKeyPress = useCallback(
        (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onClick();
            }
        },
        [onClick]
    );

    type SizeClass = {
        [key: number]: string;
    };

    let dataSize: number;
    let dataColor: string;
    dataColor = '';
    sizeClassName = '';

    let size_class: SizeClass = {
        36: 'size-small',
        48: 'size-medium',
        60: 'size-large'
    };

    window.addEventListener('message', function (event) {
        if (
            typeof event.data === 'string' &&
            event.data.includes('Selected jitsi-icon color: ')
        ) {
            console.log('Message received from the parent: ' + event.data); // Message received from parent
            dataColor = event.data.split(': ')[1].toString().trim();
            setColor(dataColor);
            setHasColorChanged(true);
        }

        if (
            typeof event.data === 'string' &&
            event.data.includes('Selected jitsi-icon size: ')
        ) {
            console.log('Message received from the parent: ' + event.data); // Message received from parent
            dataSize = parseInt(event.data.split(': ')[1].toString().trim());
            for (let key in size_class) {
                let x: number = parseInt(key);
                if (x === dataSize) {
                    setHasSizeChanged(size_class[x].toString());
                }
            }
            setSize(dataSize);
        }
    });

    return (
        <div
            aria-disabled={disabled}
            aria-label={accessibilityLabel}
            aria-pressed={toggled}
            className={`toolbox-button ${disabled ? ' disabled' : ''}`}
            onClick={disabled ? undefined : onClick}
            onKeyPress={disabled ? undefined : onKeyPress}
            role="button"
            tabIndex={0}
        >
            <div
                className={`toolbox-icon ${disabled ? 'disabled' : ''} ${
                    customClass ?? dataColor
                }`}
            >
                <Icon src={icon} />
            </div>
        </div>
    );
};

export default ToolbarButton;
