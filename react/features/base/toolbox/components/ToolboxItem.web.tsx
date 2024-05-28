import React, { Fragment } from 'react';

import Icon from '../../icons/components/Icon';
import Tooltip from '../../tooltip/components/Tooltip';
import ContextMenuItem from '../../ui/components/web/ContextMenuItem';

import AbstractToolboxItem from './AbstractToolboxItem';
import type { IProps as AbstractToolboxItemProps } from './AbstractToolboxItem';

import '../../../../../css/custom-icon.mods.css';

interface IProps extends AbstractToolboxItemProps {
    /**
     * The button's background color.
     */
    backgroundColor?: string;

    customIconColorClass?: string;
    customIconSizeClass?: string;
    /**
     * Whether or not the item is displayed in a context menu.
     */
    contextMenu?: boolean;

    /**
     * Whether the button open a menu or not.
     */
    isMenuButton?: boolean;

    /**
     * On key down handler.
     */
    onKeyDown: (e?: React.KeyboardEvent) => void;
}

/**
 * Web implementation of {@code AbstractToolboxItem}.
 */
export default class ToolboxItem extends AbstractToolboxItem<IProps> {
    /**
     * Initializes a new {@code ToolboxItem} instance.
     *
     * @inheritdoc
     */
    constructor(props: IProps) {
        super(props);

        this._onKeyPress = this._onKeyPress.bind(this);

        this.state = {
            customIconColorClass: '',
            customIconSizeClass: ''
        };

        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleSizeChange = this.handleSizeChange.bind(this);
    }

    componentDidMount() {
        // Adding the event listener when the component mounts
        window.addEventListener('message', this.handleColorChange);
    }

    componentWillUnmount() {
        // Removing the event listener when the component unmounts to prevent memory leaks
        window.removeEventListener('message', this.handleSizeChange);
    }

    /**
     * Handles 'Enter' and Space key on the button to trigger onClick for accessibility.
     *
     * @param {Object} event - The key event.
     * @private
     * @returns {void}
     */
    _onKeyPress(event?: React.KeyboardEvent) {
        if (event?.key === 'Enter') {
            event.preventDefault();
            this.props.onClick();
        }
    }

    _handleColorChange(event: MessageEvent, dataColor: String) {
        if (
            typeof event.data === 'string' &&
            event.data.includes('Selected jitsi-icon color: ')
        ) {
            console.log('Message received from the parent: ' + event.data); // Message received from parent
            dataColor = event.data.split(': ')[1].toString().trim();
            this.setState({ customIconColorClass: dataColor });
            // fetchData(dataColor);
        }
    }

    _handleSizeChange(event: MessageEvent, sizeClassName: String) {
        let dataSize: Number;
        type SizeClass = {
            [key: number]: string;
        };

        let size_class: SizeClass = {
            36: 'size-small',
            48: 'size-medium',
            60: 'size-large'
        };

        if (
            typeof event.data === 'string' &&
            event.data.includes('Selected jitsi-icon size: ')
        ) {
            console.log('Message received from the parent: ' + event.data); // Message received from parent
            dataSize = parseInt(event.data.split(': ')[1].toString().trim());
            for (let key in size_class) {
                let x: number = parseInt(key);
                if (x === dataSize) sizeClassName = size_class[x].toString();
            }
            // Update state with a new size
            this.setState({ customIconSizeClass: sizeClassName });
        }
    }

    /**
     * Handles rendering of the actual item. If the label is being shown, which
     * is controlled with the `showLabel` prop, the item is rendered for its
     * display in an overflow menu, otherwise it will only have an icon, which
     * can be displayed on any toolbar.
     *
     * @protected
     * @returns {ReactElement}
     */
    _renderItem() {
        const {
            backgroundColor,
            customIconColorClass,
            customIconSizeClass,
            contextMenu,
            isMenuButton,
            disabled,
            elementAfter,
            icon,
            onClick,
            onKeyDown,
            showLabel,
            tooltipPosition,
            toggled
        } = this.props;
        const className = showLabel ? 'overflow-menu-item' : 'toolbox-button';
        const buttonAttribute = isMenuButton ? 'aria-expanded' : 'aria-pressed';
        const props = {
            [buttonAttribute]: toggled,
            'aria-disabled': disabled,
            'aria-label': this.accessibilityLabel,
            className: className + (disabled ? ' disabled' : ''),
            onClick: disabled ? undefined : onClick,
            onKeyDown: disabled ? undefined : onKeyDown,
            onKeyPress: this._onKeyPress,
            tabIndex: 0,
            role: 'button'
        };

        const elementType = showLabel ? 'li' : 'div';
        const useTooltip = this.tooltip && this.tooltip.length > 0;

        if (contextMenu) {
            return (
                <ContextMenuItem
                    accessibilityLabel={this.accessibilityLabel}
                    backgroundColor={backgroundColor} // dataColor ||
                    className={`${
                        customIconSizeClass != ''
                    } ? ${customIconSizeClass}:${
                        customIconColorClass != ''
                    } ?${customIconColorClass} : ''`}
                    disabled={disabled}
                    icon={icon}
                    onClick={onClick}
                    onKeyDown={onKeyDown}
                    onKeyPress={this._onKeyPress}
                    text={this.label}
                />
            );
        }
        let children = (
            <Fragment>
                {this._renderIcon()}
                {showLabel && <span>{this.label}</span>}
                {elementAfter}
            </Fragment>
        );

        if (useTooltip) {
            children = (
                <Tooltip
                    content={this.tooltip ?? ''}
                    position={tooltipPosition}
                >
                    {children}
                </Tooltip>
            );
        }

        return React.createElement(elementType, props, children);
    }

    /**
     * Helper function to render the item's icon.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderIcon() {
        // let dataSize: Number;
        // let dataColor, sizeClassName: String;
        // dataSize = 0;
        // dataColor = '';
        // sizeClassName = '';

        // type SizeClass = {
        //     [key: number]: string;
        // };

        // let size_class: SizeClass = {
        //     36: 'size-small',
        //     48: 'size-medium',
        //     60: 'size-large'
        // };

        // handleColorChange(dataColor: String) {
        //     // Update state with a new color
        //     this.setState({ customIconColorClass: dataColor });
        // }

        // handleSizeChange(sizeClassName: String) {
        //     // Update state with a new size
        //     this.setState({ customIconSizeClass: sizeClassName });
        // }

        // window.addEventListener('message', function (event: MessageEvent) {
        //     if (
        //         typeof event.data === 'string' &&
        //         event.data.includes('Selected jitsi-icon color: ')
        //     ) {
        //         console.log('Message received from the parent: ' + event.data); // Message received from parent
        //         dataColor = event.data.split(': ')[1].toString().trim();
        //         this.handleColorChange(dataColor);
        //         // fetchData(dataColor);
        //     }
        // });

        // type SizeClass = {
        //     [key: number]: string;
        // };

        // let size_class: SizeClass = {
        //     36: 'size-small',
        //     48: 'size-medium',
        //     60: 'size-large'
        // };

        let dataSize: number;
        dataSize = 0;

        window.addEventListener('message', function (event: MessageEvent) {
            if (
                typeof event.data === 'string' &&
                event.data.includes('Selected jitsi-icon size: ')
            ) {
                console.log('Message received from the parent: ' + event.data); // Message received from parent
                dataSize = parseInt(
                    event.data.split(': ')[1].toString().trim()
                );
                // for (let key in size_class) {
                //     let x: number = parseInt(key);
                //     if (x === dataSize)
                //         sizeClassName = size_class[x].toString();
                // }
                // this.handleSizeChange(sizeClassName);
                // fetchData(null, dataSize);
            }
        });

        const {
            backgroundColor,
            customClass,
            disabled,
            icon,
            showLabel,
            toggled
        } = this.props;

        const iconComponent = (
            <Icon size={showLabel ? undefined : 36} src={icon} />
        );

        const elementType = showLabel ? 'span' : 'div';
        const className = `${
            showLabel ? 'overflow-menu-item-icon' : 'toolbox-icon'
        } ${toggled ? 'toggled' : ''} ${disabled ? 'disabled' : ''} ${
            customClass ?? ''
        }
        }`;

        // const style = backgroundColor && !showLabel ? { backgroundColor } : {}; //   iconColor ||
        const style = {
            ...(this.props.customIconColorClass
                ? { color: this.props.customIconColorClass }
                : ''),
            ...(this.props.customIconSizeClass
                ? { width: dataSize, height: dataSize }
                : ''),
            ...(backgroundColor && !showLabel ? { backgroundColor } : {})
        }; //   iconColor ||

        return React.createElement(
            elementType,
            {
                className,
                style
            },
            iconComponent
        );
    }
}
