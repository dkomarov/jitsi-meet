import React, { useCallback, useState, useEffect } from 'react';

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

export const DEFAULT_COLOR = navigator.product === 'ReactNative' ? 'white' : undefined;
export const DEFAULT_SIZE = navigator.product === 'ReactNative' ? 36 : 40; // 22

const ToolbarButton = ({
    accessibilityLabel,
    customClass,
    disabled = false,
    onClick,
    icon,
    toggled = false
}: IProps) => {
    const [iconColor, setColor] = useState('gold');
    const [hasColorChanged, setHasColorChanged] = useState(false);
    const [iconSize, setSize] = useState(36);
    const [sizeClassName, setSizeClassName] = useState('size-medium');

    const elements = document.querySelectorAll(
        '.jitsi-icon-default svg:not(.settings-button-small-icon svg, #participant-connection-indicator svg, #mic-disabled, #toggleFilmstripButton svg)'
    );

    useEffect(() => {
        const applyStyles = () => {
            try {
                elements.forEach((icon) => {
                    if (iconColor != null && iconColor != '' && iconColor != undefined) {
                        // @ts-ignore
                        icon.parentElement.classList.add(iconColor);
                    }

                    if (sizeClassName != null && sizeClassName != '' && sizeClassName != undefined) {
                        // @ts-ignore
                        icon.parentElement.classList.add(sizeClassName);
                    }
                    // if (icon instanceof HTMLElement) {

                    //     icon.style.fill = iconColor;
                    //     icon.style.width = `${iconSize}px`;
                    //     icon.style.height = `${iconSize}px`;
                    // } else if (icon instanceof SVGElement) {
                    //     icon.setAttribute('fill', iconColor);
                    //     icon.style.width = `${iconSize}px`;
                    //     icon.style.height = `${iconSize}px`;
                    // }
                });
            } catch (err) {
                console.log('Error re-applying styles:', err);
            }
        };

        window.addEventListener('resize', applyStyles);

        // Apply styles initially
        applyStyles();

        return () => {
            // window.removeEventListener('resize', applyStyles);
        };
    }, [iconColor, iconSize]);

    useEffect(() => {
        localStorage.setItem('icon_color_class', JSON.stringify(iconColor));
        console.log("localStorage.getItem('icon_color_class') is now:", localStorage.getItem('icon_color_class'));

        localStorage.setItem('icon_size_class', JSON.stringify(sizeClassName));
        console.log("localStorage.getItem('icon_size_class') is now:", localStorage.getItem('icon_size_class'));
    }, [iconColor, sizeClassName]);

    useEffect(() => {
        try {
            let iconData = window.localStorage.getItem('icon_color_class');

            if (iconData != null && iconData != '' && iconData != undefined) setColor(iconData);
        } catch (err) {
            console.log('error getting/parsing iconData in local storage:', err);
        }

        try {
            let sizeData = window.localStorage.getItem('icon_size_class');

            if (sizeData != null && sizeData != '' && sizeData != undefined) setSizeClassName(sizeData);
        } catch (err) {
            console.log('error getting/parsing sizeData in local storage:', err);
        }
    }, [iconColor, sizeClassName]);

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

    let size_class: SizeClass = {
        36: 'size-small',
        48: 'size-medium',
        60: 'size-large'
    };

    window.addEventListener('message', function (event) {
        if (typeof event.data === 'string' && event.data.includes('Selected jitsi-icon color: ')) {
            console.log('Message received from the parent: ' + event.data); // Message received from parent
            dataColor = event.data.split(': ')[1].toString().trim();
            setColor(dataColor);
            setHasColorChanged(true);
        }

        if (typeof event.data === 'string' && event.data.includes('Selected jitsi-icon size: ')) {
            console.log('Message received from the parent: ' + event.data); // Message received from parent
            dataSize = parseInt(event.data.split(': ')[1].toString().trim());
            for (let key in size_class) {
                let x: number = parseInt(key);
                if (x === dataSize) {
                    setSizeClassName(size_class[x].toString());
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
            className={`toolbox-button ${disabled ? ' disabled' : ''} ${iconColor || ''} ${sizeClassName || ''}`}
            onClick={disabled ? undefined : onClick}
            onKeyPress={disabled ? undefined : onKeyPress}
            role="button"
            tabIndex={0}
        >
            <div
                className={`toolbox-icon ${disabled ? 'disabled' : ''} ${customClass ?? ''} ${iconColor || ''} ${
                    sizeClassName || ''
                }`}
            >
                <Icon src={icon} />
            </div>
        </div>
    );
};

export default ToolbarButton;
