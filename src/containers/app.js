import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';

import {
    pickAvailableToggle,
    toggleCard,
    removeCards,
    resetPicks,
    resetCards
} from '../actions';

import Button from '../components/button';

import Card from './card';

class App extends Component {
    constructor(props) {
        super(props);

        this.handleCardPick = this.handleCardPick.bind(this);

        // debug handlers
        this.handleResetPicksButtonClick = this.handleResetPicksButtonClick.bind(this);
        this.handleRemoveButtonClick = this.handleRemoveButtonClick.bind(this);
        this.handleResetCardsButtonClick = this.handleResetCardsButtonClick.bind(this);
    }

    handleCardPick({ index, isSelected }) {
        console.log(this.props.cards);
        console.log("==================");
        console.log(index, isSelected);

        this.props.toggleCard(index, isSelected);
    }

    renderCards() {
        const { cards } = this.props;

        return (
            cards.map((card, idx) => (
                <Card
                    id={card.id}
                    isSelected={card.isSelected}
                    index={card.index}
                    key={idx}
                    onClick={this.handleCardPick}
                >
                    {card.content}
                </Card>
            ))
        );
    }

    handleResetPicksButtonClick() {
        this.props.resetPicks();
    }

    handleRemoveButtonClick(id) {
        this.props.removeCards(id);
    }

    handleResetCardsButtonClick() {
        this.props.resetCards();
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

                        <section className="box has-text-centered">
                            <h2 className="heading is-4">Debug</h2>

                            <Button onClick={this.handleResetPicksButtonClick}>Picks Reset</Button>
                            <hr/>
                            <Button onClick={this.handleRemoveButtonClick.bind(this, 0)}>Remove id#0</Button>
                            <Button onClick={this.handleRemoveButtonClick.bind(this, 1)}>Remove id#1</Button>
                            <Button onClick={this.handleRemoveButtonClick.bind(this, 2)}>Remove id#2</Button>
                            <Button onClick={this.handleRemoveButtonClick.bind(this, 3)}>Remove id#3</Button>
                            <hr/>
                            <Button onClick={this.handleResetCardsButtonClick}>Cards Reset</Button>
                        </section>
                    </div>
                </div>
            </div>
        );
    }
}

App.propTypes = {
    cards: PropTypes.array,

    pickAvailableToggle: PropTypes.func
};

const mapDispatchToProps = {
    pickAvailableToggle,
    removeCards,
    resetCards,
    resetPicks,
    toggleCard
};

const mapStateToProps = state => {
    return {
        cards: state.cards
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
