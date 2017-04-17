import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';

import Card from '../components/card';

class SmartCard extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();

        if (this.props.isDisabled || this.props.isRemoved) {
            return false;
        }

        this.props.onClick({
            index: this.props.index,
            isSelected: !this.props.isSelected
        });
    }

    render() {
        return (
            <Card
                isHighlighted={this.props.isHighlighted}
                isRemoved={this.props.isRemoved}
                isSelected={this.props.isSelected}
                onClick={this.handleClick}
            >
                {this.props.children}
            </Card>
        );
    }
}

SmartCard.propTypes = {
    children: PropTypes.node,
    id: PropTypes.number,
    isDisabled: PropTypes.bool,
    isHighlighted: PropTypes.bool,
    isRemoved: PropTypes.bool,
    isSelected: PropTypes.bool,
    index: PropTypes.number,
    onClick: PropTypes.func
};

const mapStateToProps = (state) => ({
    isDisabled: !state.isPickAvailable
});

export default connect(mapStateToProps)(SmartCard);
