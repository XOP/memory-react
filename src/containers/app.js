import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';

import {
    highLightCardToggle,
    pickAvailableToggle,
    toggleCard,
    removeCards,
    resetPicks,
    resetCards
} from '../actions';

import {
    leftCardsSelector,
    leftIdsSelector,
    matchIdSelector,
    pickedCardsSelector
} from '../reducers';

import Button from '../components/button';

import Card from './card';

import {
    CONFIG_CLONES,
    CONFIG_CHECK_TIMEOUT
} from '../constants';

class App extends Component {
    constructor(props) {
        super(props);

        this.handleCardPick = this.handleCardPick.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleShowHint = this.handleShowHint.bind(this);

        // debug handlers
        this.handleResetPicksButtonClick = this.handleResetPicksButtonClick.bind(this);
        this.handleRemoveButtonClick = this.handleRemoveButtonClick.bind(this);
        this.handleResetCardsButtonClick = this.handleResetCardsButtonClick.bind(this);

        this.state = {
            isGameComplete: false,
            previousScore: 0
        };
    }

    componentDidUpdate(prevProps) {
        const {
            leftIds,
            matchId,
            moves,
            pickedIndexes
        } = this.props;

        const leftToWin = leftIds.length;

        // game is finished
        if (leftToWin === 0) {
            this.setState({
                isGameComplete: true,
                previousScore: moves
            });
        }

        // game is almost finished
        if (leftToWin === 1) {
            setTimeout(() => this.props.removeCards(), CONFIG_CHECK_TIMEOUT);
        }

        // remove match or reset selected
        if (matchId !== prevProps.matchId) {
            if (matchId) {
                setTimeout(() => this.props.removeCards(matchId), CONFIG_CHECK_TIMEOUT);
            } else {
                if (pickedIndexes.length === CONFIG_CLONES) {
                    setTimeout(() => this.props.resetPicks(), CONFIG_CHECK_TIMEOUT);
                }
            }
        }
    }

    handleCardPick({ index, isSelected }) {
        this.props.toggleCard(index, isSelected);
    }

    handleReset() {
        this.props.resetCards();
    }

    handleShowHint() {
        const { leftIds } = this.props;
        const leftToWin = leftIds.length;
        const randomId = leftIds[~~(Math.random() * leftToWin)];

        this.props.highLightCardToggle(randomId, true);
        setTimeout(() => this.props.highLightCardToggle(randomId, false), CONFIG_CHECK_TIMEOUT);
    }

    renderCards() {
        const { cards } = this.props;

        return (
            cards.map((card, idx) => (
                <Card
                    id={card.id}
                    isHighlighted={card.isHighlighted}
                    isRemoved={card.isRemoved}
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
                <div className="section has-text-centered">
                    <h1 className="title is-1">Memory</h1>
                </div>

                <div className="columns">
                    <div className="column is-8 is-offset-2">

                        <section className="has-text-centered">
                            { this.renderCards() }
                        </section>

                        <br/>

                        <section className="box has-text-centered">
                            <Button className="is-warning" size="medium" onClick={this.handleReset}>
                                I give up
                            </Button>
                            <span>&nbsp;</span>
                            <Button className="is-info" size="medium" onClick={this.handleShowHint}>
                                Show hint
                            </Button>
                        </section>

                        <section className="box has-text-centered">
                            <h2 className="title is-4">Debug</h2>

                            <div className="box">
                                <span>Picked Cards: &nbsp;</span>
                                {
                                    JSON.stringify(this.props.pickedCards)
                                }
                                <hr/>
                                <span>Picked Indexes: &nbsp;</span>
                                {
                                    this.props.pickedIndexes.map(idx => <span key={idx}>{idx}&nbsp;</span>)
                                }
                                <span>&nbsp;|&nbsp;</span>
                                <span>Matched ID: &nbsp;</span>
                                {
                                    JSON.stringify(this.props.matchId)
                                }
                            </div>

                            <Button onClick={this.handleResetPicksButtonClick}>Picks Reset</Button>
                            <Button onClick={this.handleResetCardsButtonClick}>Cards Reset</Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Button onClick={this.handleRemoveButtonClick.bind(this, 0)}>Remove id#0</Button>
                            <Button onClick={this.handleRemoveButtonClick.bind(this, 1)}>Remove id#1</Button>
                            <Button onClick={this.handleRemoveButtonClick.bind(this, 2)}>Remove id#2</Button>
                            <Button onClick={this.handleRemoveButtonClick.bind(this, 3)}>Remove id#3</Button>
                        </section>
                    </div>

                    <div className="column is-2">
                        <h2 className="title is-3 has-text-centered">
                            Score
                        </h2>
                        <div className="box">
                            <table>
                                <tbody>
                                <tr>
                                    <td>Moves</td>
                                    <td className="has-text-right">{ this.props.moves }</td>
                                </tr>
                                <tr>
                                    <td>Previous Game</td>
                                    <td className="has-text-right">{ this.state.previousScore }</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

App.propTypes = {
    cards: PropTypes.array,

    leftCards: PropTypes.array,
    leftIds: PropTypes.array,
    matchId: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
    ]),
    moves: PropTypes.number,
    pickAvailableToggle: PropTypes.func,
    pickedIndexes: PropTypes.array,
    resetPicks: PropTypes.func,
    toggleCard: PropTypes.func
};

const mapDispatchToProps = {
    highLightCardToggle,
    pickAvailableToggle,
    removeCards,
    resetCards,
    resetPicks,
    toggleCard
};

const mapStateToProps = state => {
    return {
        cards: state.cards,
        leftCards: leftCardsSelector(state),
        leftIds: leftIdsSelector(state),
        matchId: matchIdSelector(state),
        moves: state.moves,
        pickedCards: pickedCardsSelector(state),
        pickedIndexes: state.pickedCardsIndexes
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
