import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';

import Card from '../components/card';

class SmartCard extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);

        this.state = {
            isSelected: false
        };
    }

    handleClick(e) {
        e.preventDefault();

        if (this.props.isDisabled) {
            return false;
        }

        this.setState({
            isSelected: !this.state.isSelected
        });

        this.props.onClick({
            id: this.props.id
        });
    }

    render() {
        return (
            <Card
                isSelected={this.state.isSelected}
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
    isSelected: PropTypes.bool,
    onClick: PropTypes.func
};

const mapStateToProps = (state) => ({
    isDisabled: !state.isPickAvailable
});

export default connect(mapStateToProps)(SmartCard);
