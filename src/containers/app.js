import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';

import Card from './card';

class App extends Component {
    constructor(props) {
        super(props);
    }

    renderCards() {
        const { cards } = this.props;

        return (
            cards.map((card, idx) => (
                <Card
                    id={card.id}
                    key={idx}
                >
                    {card.content}
                </Card>
            ))
        );
    }

    render() {
        return (
            <div className="container">
                <div className="columns">
                    <div className="column is-8 is-offset-2">

                        <div className="section has-text-centered">
                            <h1 className="title">Memory</h1>
                        </div>

                        <section className="has-text-centered">
                            { this.renderCards() }
                        </section>

                    </div>
                </div>
            </div>
        );
    }
}

App.propTypes = {
    cards: PropTypes.array
};

const mapDispatchToProps = {

};

const mapStateToProps = state => {
    return {
        cards: state.cards
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
