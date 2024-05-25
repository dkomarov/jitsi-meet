import React, { useCallback, useState, useEffect } from 'react';

import { Container } from '../../react/components/index.web';
import { StyleType, styleTypeToObject } from '../../styles/functions.web';

import { IIconProps } from './types.web';

import '../../../../../css/custom-icon.mods.css';

interface IProps extends IIconProps {
    /**
     * Optional label for screen reader users.
     *
     * If set, this is will add a `aria-label` attribute on the svg element,
     * contrary to the aria* props which set attributes on the container element.
     *
     * Use this if the icon conveys meaning and is not clickable.
     */
    alt?: string;

    /**
     * The id of the element this button icon controls.
     */
    ariaControls?: string;

    /**
     * Id of description label.
     */
    ariaDescribedBy?: string;

    /**
     * Aria disabled flag for the Icon.
     */
    ariaDisabled?: boolean;

    /**
     * Whether the element popup is expanded.
     */
    ariaExpanded?: boolean;

    /**
     * Whether the element has a popup.
     */
    ariaHasPopup?: boolean;

    /**
     * Aria label for the Icon.
     */
    ariaLabel?: string;

    /**
     * Whether the element has a pressed.
     */
    ariaPressed?: boolean;

    /**
     * Class name for the web platform, if any.
     */
    className?: string;

    /**
     * Color of the icon (if not provided by the style object).
     */
    color?: string;

    /**
     * Id of the icon container.
     */
    containerId?: string;

    /**
     * Id prop (mainly for autotests).
     */
    id?: string;

    /**
     * Keydown handler.
     */
    onKeyDown?: Function;

    /**
     * Keypress handler.
     */
    onKeyPress?: Function;

    /**
     * Role for the Icon.
     */
    role?: string;

    /**
     * The size of the icon (if not provided by the style object).
     */
    size?: number | string;

    /**
     * The preloaded icon component to render.
     */
    src: Function;

    /**
     * Style object to be applied.
     */
    style?: StyleType | StyleType[];

    /**
     * TabIndex  for the Icon.
     */
    tabIndex?: number;

    /**
     * Test id for the icon.
     */
    testId?: string;
}

export const DEFAULT_COLOR =
    navigator.product === 'ReactNative' ? 'white' : undefined;
export const DEFAULT_SIZE = navigator.product === 'ReactNative' ? 36 : 40; // 22

/**
 * Implements an Icon component that takes a loaded SVG file as prop and renders it as an icon.
 *
 * @param {IProps} props - The props of the component.
 * @returns {ReactElement}
 */
export default function Icon(props: IProps) {
    const {
        alt,
        className,
        color,
        id,
        containerId,
        onClick,
        size,
        src: IconComponent,
        style,
        ariaHasPopup,
        ariaLabel,
        ariaDisabled,
        ariaExpanded,
        ariaControls,
        tabIndex,
        ariaPressed,
        ariaDescribedBy,
        role,
        onKeyPress,
        onKeyDown,
        testId,
        ...rest
    }: IProps = props;

    const [iconColor, setColor] = useState(DEFAULT_COLOR);
    const [hasColorChanged, setHasColorChanged] = useState(false);
    const [iconSize, setSize] = useState(DEFAULT_SIZE);
    const [sizeClassName, setSizeClassName] = useState('size-medium');

    const elements = document.querySelectorAll(
        '.jitsi-icon-default svg:not(.settings-button-small-icon svg, #participant-connection-indicator svg, #mic-disabled, #toggleFilmstripButton svg)'
    );

    useEffect(() => {
        const applyStyles = () => {
            try {
                elements.forEach((icon) => {
                    if (
                        iconColor != null &&
                        iconColor != '' &&
                        iconColor != undefined
                    )
                        if (icon instanceof HTMLElement) {
                            icon.style.fill = iconColor;
                            icon.style.width = `${iconSize}px`;
                            icon.style.height = `${iconSize}px`;
                        } else if (icon instanceof SVGElement) {
                            icon.setAttribute('fill', iconColor);
                            icon.style.width = `${iconSize}px`;
                            icon.style.height = `${iconSize}px`;
                        }
                });
            } catch (err) {
                console.log('Error re-applying styles:', err);
            }
        };

        window.addEventListener('resize', applyStyles);

        // Apply styles initially
        applyStyles();

        return () => {
            window.removeEventListener('resize', applyStyles);
        };
    }, [iconColor, iconSize]);

    useEffect(() => {
        try {
            const iconData = window.localStorage.getItem('icon_color_class');
            if (iconData != null && iconData != '' && iconData != undefined)
                setColor(JSON.parse(iconData));
        } catch (err) {
            console.log(
                'error getting/parsing iconData in local storage:',
                err
            );
        }

        try {
            const sizeData = window.localStorage.getItem('icon_size_class');
            if (sizeData != null && sizeData != '' && sizeData != undefined)
                setSizeClassName(JSON.parse(sizeData));
        } catch (err) {
            console.log(
                'error getting/parsing sizeData in local storage:',
                err
            );
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('icon_color_class', JSON.stringify(iconColor));
        console.log(
            "localStorage.getItem('icon_color_class') is now:",
            localStorage.getItem('icon_color_class')
        );

        localStorage.setItem('icon_size_class', JSON.stringify(sizeClassName));
        console.log(
            "localStorage.getItem('icon_size_class') is now:",
            localStorage.getItem('icon_size_class')
        );
    }, [iconColor, sizeClassName]);

    const {
        color: styleColor,
        fontSize: styleSize,
        ...restStyle
    } = styleTypeToObject(style ?? {});

    const calculatedColor = color ?? styleColor ?? DEFAULT_COLOR;
    const calculatedSize = size ?? styleSize ?? DEFAULT_SIZE;

    const onKeyPressHandler = useCallback(
        (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && onClick) {
                e.preventDefault();
                onClick(e);
            } else if (onKeyPress) {
                onKeyPress(e);
            }
        },
        [onClick, onKeyPress]
    );

    const jitsiIconClassName = calculatedColor
        ? 'jitsi-icon'
        : 'jitsi-icon jitsi-icon-default';

    const iconProps = alt
        ? {
              'aria-label': alt,
              role: 'img'
          }
        : {
              'aria-hidden': true
          };

    // const fetchData = (color: String | null, size: number | null) => {
    //     // Assuming data is fetched successfully
    //     if (color) {
    //         setColor(color); // Set background color
    //         setHasColorChanged(true);
    //     } else if (size)
    //         // Update state with fetched data
    //         setSize(size);
    // };

    type SizeClass = {
        [key: number]: string;
    };

    let dataSize: number;
    let dataColor: string;

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
                    setSizeClassName(size_class[x].toString());
                }
            }
            setSize(dataSize);
        }
    });

    return (
        <Container
            {...rest}
            aria-controls={ariaControls}
            aria-describedby={ariaDescribedBy}
            aria-disabled={ariaDisabled}
            aria-expanded={ariaExpanded}
            aria-haspopup={ariaHasPopup}
            aria-label={ariaLabel}
            aria-pressed={ariaPressed}
            className={
                !hasColorChanged
                    ? `${jitsiIconClassName} ${className || ''}`
                    : `${className || ''} ${iconColor || ''} ${
                          sizeClassName || ''
                      }`
            }
            data-testid={testId}
            id={containerId}
            onClick={onClick}
            onKeyDown={onKeyDown}
            onKeyPress={onKeyPressHandler}
            role={role}
            style={restStyle}
            tabIndex={tabIndex}
        >
            <IconComponent
                {...iconProps}
                className={`${iconColor} ${sizeClassName}`}
                fill={iconColor || calculatedColor}
                height={iconSize || calculatedSize}
                id={id}
                width={iconSize || calculatedSize}
            />
        </Container>
    );
}

Icon.defaultProps = {
    className: ''
};
