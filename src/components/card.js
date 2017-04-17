import React, { Component, PropTypes } from 'react';

import cls from 'classnames';

import {
    CARD_DEFAULT_STYLE,
    CARD_SELECTED_STYLE,
    CARD_REMOVED_STYLE,
    CARD_BACK_STYLE,
    CARD_BACK_HIGHLIGHTED_STYLE
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
            isHighlighted,
            isRemoved,
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
            isRemoved && CARD_REMOVED_STYLE
        );

        return (
            <div
                className={cls('memory-game-card card', {
                    'is-highlighted': isHighlighted,
                    'is-selected': isSelected,
                    'is-removed': isRemoved
                })}
                style={cardStyle}
                onClick={this.handleClick}
            >
                {
                    isSelected ?
                        <figure className="image is-square">
                            {cardImage}
                        </figure> :
                            isHighlighted ?
                                <div className="image is-square" style={CARD_BACK_HIGHLIGHTED_STYLE} /> :
                                <div className="image is-square" style={CARD_BACK_STYLE} />
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
    imageSrc: PropTypes.string,
    isHighlighted: PropTypes.bool,
    isRemoved: PropTypes.bool,
    isSelected: PropTypes.bool,
    onClick: PropTypes.func,
    style: PropTypes.object,
    title: PropTypes.string
};

Card.defaultProps = {
    onClick: () => null,
    style: CARD_DEFAULT_STYLE
};

export default Card;
