import React, { Fragment } from 'react'; // Component

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

    customClassName?: string;
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
            customClassName,
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

        // const [iconColor, setColor] = useState('white');

        // const fetchData = (color: string | null) => {
        //     // Assuming data is fetched successfully
        //     if (color) setColor(color); // Set background color);
        //     // Assuming data is fetched successfully
        // };
        let dataColor, dataSize, sizeClassName;

        type SizeClass = {
            [key: number]: string;
        };

        let size_class: SizeClass = {
            36: 'size-small',
            48: 'size-medium',
            60: 'size-large'
        };

        function handleColorChange(dataColor) {
            // Update state with a new color
            this.setState({ backgroundColor: dataColor });
        }

        // function handleSizeChange(dataSize) {
        //     // Update state with a new size
        //     this.setState({ width: dataSize });
        //     this.setState({ height: dataSize });
        // }

        window.addEventListener('message', function (event) {
            if (
                typeof event.data === 'string' &&
                event.data.includes('Selected jitsi-icon color: ')
            ) {
                console.log('Message received from the parent: ' + event.data); // Message received from parent
                dataColor = event.data.split(': ')[1].toString().trim();
                handleColorChange(dataColor);
                // fetchData(dataColor);
            }
        });

        window.addEventListener('message', function (event) {
            if (
                typeof event.data === 'string' &&
                event.data.includes('Selected jitsi-icon size: ')
            ) {
                console.log('Message received from the parent: ' + event.data); // Message received from parent
                dataSize = parseInt(
                    event.data.split(': ')[1].toString().trim()
                );
                for (let key in size_class) {
                    let x: number = parseInt(key);
                    if (x === parseInt(dataSize))
                        sizeClassName = size_class[x].toString();
                }
                // handleSizeChange(dataSize);
                // fetchData(null, dataSize);
            }
        });

        const elementType = showLabel ? 'li' : 'div';
        const useTooltip = this.tooltip && this.tooltip.length > 0;

        if (contextMenu) {
            return (
                <ContextMenuItem
                    accessibilityLabel={this.accessibilityLabel}
                    backgroundColor={backgroundColor} // dataColor ||
                    customClassName={`${dataColor} ${sizeClassName}`}
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
        // const [iconSize, setSize] = useState(36);
        // const [iconColor, setColor] = useState('white');

        // const fetchData = (color: string | null, size: number | null) => {
        //     // Assuming data is fetched successfully
        //     if (color) setColor(color); // Set background color);
        //     // Assuming data is fetched successfully
        //     if (size)
        //         // Update state with fetched data
        //         setSize(size);
        // };

        // let dataColor, dataSize;

        // window.addEventListener('message', function (event) {
        //     if (
        //         typeof event.data === 'string' &&
        //         event.data.includes('Selected jitsi-icon color: ')
        //     ) {
        //         console.log('Message received from the parent: ' + event.data); // Message received from parent
        //         dataColor = event.data.split(': ')[1].toString().trim();
        //         fetchData(dataColor, null);
        //     }

        // if (
        //     typeof event.data === 'string' &&
        //     event.data.includes('Selected jitsi-icon size: ')
        // ) {
        //     console.log('Message received from the parent: ' + event.data); // Message received from parent
        //     dataSize = parseInt(
        //         event.data.split(': ')[1].toString().trim()
        //     );
        //     fetchData(null, dataSize);
        // }
        // });

        const {
            backgroundColor,
            customClass,
            disabled,
            icon,
            showLabel,
            toggled
        } = this.props;
        const iconComponent = (
            <Icon size={showLabel ? undefined : 36} src={icon} /> // 24 // iconSize ||
        );
        const elementType = showLabel ? 'span' : 'div';
        const className = `${
            showLabel ? 'overflow-menu-item-icon' : 'toolbox-icon'
        } ${toggled ? 'toggled' : ''} ${disabled ? 'disabled' : ''} ${
            customClass ?? ''
        }`;
        const style = backgroundColor && !showLabel ? { backgroundColor } : {}; //   iconColor ||

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
