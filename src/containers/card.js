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

        this.setState({
            isSelected: !this.state.isSelected
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
    children: PropTypes.node
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps)(SmartCard);
