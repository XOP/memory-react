import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';

import {
    highLightCardToggle,
    removeCards,
    resetPicks,
    resetCards,
    toggleCard,
    togglePickAvailable
} from '../actions';

import {
    leftCardsSelector,
    leftIdsSelector,
    leftIndexesSelector,
    matchIdSelector,
    pickedCardsSelector
} from '../reducers';

import Button from '../components/button';
import Splash from '../components/splash';

import Card from './card';

import {
    CONFIG_CLONES,
    CONFIG_CHECK_TIMEOUT,
    CONFIG_HINT_DURATION,
    CONFIG_TRESHOLD
} from '../constants';

class App extends Component {
    constructor(props) {
        super(props);

        this.handleCardPick = this.handleCardPick.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleShowHint = this.handleShowHint.bind(this);
        this.handleGameStart = this.handleGameStart.bind(this);

        // debug handlers
        this.handleResetPicksButtonClick = this.handleResetPicksButtonClick.bind(this);
        this.handleRemoveButtonClick = this.handleRemoveButtonClick.bind(this);
        this.handleResetCardsButtonClick = this.handleResetCardsButtonClick.bind(this);

        this.state = {
            isGameStarted: false,
            isGameLastMove: false,
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

        // game is about to finish
        if (leftToWin === CONFIG_TRESHOLD && !this.state.isGameLastMove) {
            this.setState({
                isGameLastMove: true
            });

            this.props.togglePickAvailable(false);
            this.props.toggleCard();

            setTimeout(() => {
                this.props.removeCards();

                this.setState({
                    isGameComplete: true,
                    previousScore: moves
                });

                this.props.togglePickAvailable(true);
            }, CONFIG_CHECK_TIMEOUT);
        }

        // remove match or reset selected
        if (matchId !== prevProps.matchId) {
            this.props.togglePickAvailable(false);

            if (matchId) {
                setTimeout(() => {
                    this.props.removeCards(matchId);
                    this.props.togglePickAvailable(true);
                }, CONFIG_CHECK_TIMEOUT);
            } else {
                if (pickedIndexes.length === CONFIG_CLONES) {
                    setTimeout(() => {
                        this.props.resetPicks();
                        this.props.togglePickAvailable(true);
                    }, CONFIG_CHECK_TIMEOUT);
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
        setTimeout(() => this.props.highLightCardToggle(randomId, false), CONFIG_HINT_DURATION);
    }

    handleGameStart() {
        this.setState({
            isGameStarted: true,
            isGameComplete: false,
            isGameLastMove: false
        });

        this.handleReset();
    }

    renderCards() {
        const { cards, isPickAvailable } = this.props;

        return (
            cards.map((card, idx) => (
                <Card
                    id={card.id}
                    isDisabled={!isPickAvailable}
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

    renderDebugInfo() {
        return (
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
                        {
                            !this.state.isGameStarted &&
                            <section>
                                <Splash
                                    heading="Let's play Memory!"
                                >
                                    <Button
                                        size="large"
                                        mode="primary"
                                        onClick={this.handleGameStart}
                                    >
                                        Start
                                    </Button>
                                </Splash>
                            </section>
                        }
                        {
                            this.state.isGameStarted && this.state.isGameComplete &&
                            <section>
                                <Splash
                                    heading="Sweet! Here's your score:"
                                >
                                    <div className="content is-large">
                                        <div>Moves made: {this.props.moves}</div>
                                    </div>
                                    <br/>
                                    <Button
                                        size="large"
                                        mode="primary"
                                        onClick={this.handleGameStart}
                                    >
                                        One more time?
                                    </Button>
                                </Splash>
                            </section>
                        }
                        {
                            this.state.isGameStarted && !this.state.isGameComplete &&
                            <section>
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
                            </section>
                        }

                        { this.renderDebugInfo() }
                    </div>

                    <div className="column is-2">
                        {
                            this.state.isGameStarted &&
                            <section>
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
                                            <td>Last Game</td>
                                            <td className="has-text-right">{ this.state.previousScore }</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        }
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
    pickedIndexes: PropTypes.array,
    resetPicks: PropTypes.func,
    toggleCard: PropTypes.func,
    togglePickAvailable: PropTypes.func,
};

const mapDispatchToProps = {
    highLightCardToggle,
    removeCards,
    resetCards,
    resetPicks,
    toggleCard,
    togglePickAvailable
};

const mapStateToProps = state => {
    return {
        cards: state.cards,
        isPickAvailable: state.isPickAvailable,
        leftCards: leftCardsSelector(state),
        leftIds: leftIdsSelector(state),
        leftIndexes: leftIndexesSelector(state),
        matchId: matchIdSelector(state),
        moves: state.moves,
        pickedCards: pickedCardsSelector(state),
        pickedIndexes: state.pickedCardsIndexes
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
