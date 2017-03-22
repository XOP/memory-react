import React, { Component, PropTypes } from 'react';

import cls from 'classnames';

class Button extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        this.props.onClick(e);
    }

    render() {
        const {
            disabled,
            full,
            size,
            mode
        } = this.props;

        return (
            <button
                className={cls('button', {
                    'is-disabled': disabled,
                    'is-fullwidth': full,
                    [`is-${size}`]: size,
                    [`is-${mode}`]: mode
                })}
                onClick={this.handleClick}
            >
                {this.props.children}
            </button>
        );
    }
}

Button.propTypes = {
    children: PropTypes.node,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    full: PropTypes.bool,
    mode: PropTypes.string,
    size: PropTypes.string
};

export default Button;
