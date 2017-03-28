import React, { Component, PropTypes } from 'react';

import cls from 'classnames';

import {
    CARD_SELECTED_STYLE,
    CARD_CLEARED_STYLE,
    CARD_BACK_STYLE
} from '../constants/cardStyle';

class Card extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        this.props.onClick(e);
    }

    render() {
        const {
            children,
            imageSrc,
            isCleared,
            isSelected,
            style,
            title
        } = this.props;

        const cardImage = (
            imageSrc ?
                <img src={imageSrc} alt={title} /> :
                <img src={`http://placehold.it/256x256?text=${children}`} alt={children}/>
        );

        const cardStyle = Object.assign({}, style,
            isSelected && CARD_SELECTED_STYLE,
            isCleared && CARD_CLEARED_STYLE
        );

        return (
            <div
                className={cls('memory-game-card card', {
                    'is-selected': isSelected,
                    'is-cleared': isCleared
                })}
                style={cardStyle}
                onClick={this.handleClick}
            >
                {
                    isSelected ?
                        <figure className="image is-128x128">
                            {cardImage}
                        </figure> :
                        <div className="notification is-info" style={CARD_BACK_STYLE} />
                }
            </div>
        );
    }
}

Card.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    isCleared: PropTypes.bool,
    isSelected: PropTypes.bool,
    onClick: PropTypes.func,
    style: PropTypes.object,
    title: PropTypes.string
};

Card.defaultProps = {
    onClick: () => null,
    style: {
        display: 'inline-block',
        padding: '0.5rem',
        margin: '0.5rem'
    }
};

export default Card;
