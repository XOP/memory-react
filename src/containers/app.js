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
    hintsUsedSelector,
    leftIdsSelector,
    matchIdSelector
} from '../reducers';

import Button from '../components/button';
import Splash from '../components/splash';

import Card from './card';

import {
    CONFIG_CLONES,
    CONFIG_CHECK_TIMEOUT,
    CONFIG_HINT_DURATION,
    CONFIG_RESET_CLICKS,
    CONFIG_TRESHOLD
} from '../constants';

import resources from '../resources';

class App extends Component {
    constructor(props) {
        super(props);

        this.handleCardPick = this.handleCardPick.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleShowHint = this.handleShowHint.bind(this);
        this.handleGameStart = this.handleGameStart.bind(this);

        this.state = {
            failedMatchClicks: 0,
            isGameStarted: false,
            isGameLastMove: false,
            isGameComplete: false,
            previousScore: 0
        };
    }

    componentDidUpdate(prevProps) {
        /* eslint-disable react/no-did-update-set-state */

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

            setTimeout(() => {
                this.props.toggleCard();

                setTimeout(() => {
                    this.props.removeCards();

                    setTimeout(() => {
                        this.setState({
                            isGameComplete: true,
                            previousScore: moves
                        });

                        this.props.togglePickAvailable(true);
                    }, CONFIG_CHECK_TIMEOUT);
                }, CONFIG_CHECK_TIMEOUT / 2);
            }, CONFIG_CHECK_TIMEOUT / 2);
        }

        // remove match or reset selected
        if (matchId !== prevProps.matchId) {
            this.props.togglePickAvailable(false);

            if (matchId) {
                setTimeout(() => {
                    this.props.removeCards(matchId);
                    this.props.togglePickAvailable(true);

                    this.setState({
                        failedMatchClicks: 0
                    });
                }, CONFIG_CHECK_TIMEOUT);
            } else {
                if (pickedIndexes.length === CONFIG_CLONES) {
                    setTimeout(() => {
                        this.props.resetPicks();
                        this.props.togglePickAvailable(true);

                        this.setState({
                            failedMatchClicks: this.state.failedMatchClicks + 1
                        });
                    }, CONFIG_CHECK_TIMEOUT);
                }
            }
        }

        /* eslint-enable react/no-did-update-set-state */
    }

    handleCardPick({ index, isSelected }) {
        this.props.toggleCard(index, isSelected);
    }

    handleReset() {
        this.props.removeCards();

        setTimeout(() => {
            this.props.resetCards();

            this.setState({
                failedMatchClicks: 0
            });
        }, CONFIG_CHECK_TIMEOUT / 2);
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

    render() {
        return (
            <div className="section">
                <div className="section has-text-centered">
                    <h1 className="title is-1">{resources.title}</h1>
                </div>

                <div className="columns">
                    <div className="column is-8 is-offset-2">
                        {
                            !this.state.isGameStarted &&
                            <section>
                                <Splash
                                    heading={resources.start.heading}
                                >
                                    <Button
                                        size="large"
                                        mode="primary"
                                        onClick={this.handleGameStart}
                                    >
                                        {resources.controls.start}
                                    </Button>
                                </Splash>
                            </section>
                        }

                        {
                            this.state.isGameStarted && this.state.isGameComplete &&
                            <section>
                                <Splash
                                    heading={resources.result.heading}
                                >
                                    <div className="content is-large">
                                        <div>{resources.result.moves}: {this.props.moves}</div>
                                        <div>{resources.result.hints}: {this.props.hints}</div>
                                    </div>
                                    <br/>
                                    <Button
                                        size="large"
                                        mode="primary"
                                        onClick={this.handleGameStart}
                                    >
                                        {resources.controls.retry}
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
                                    {
                                        this.state.failedMatchClicks >= CONFIG_RESET_CLICKS &&
                                        <Button className="is-warning" size="medium" onClick={this.handleReset}>
                                            {resources.controls.restart}
                                        </Button>
                                    }
                                    <span>&nbsp;</span>
                                    {
                                        Boolean(this.props.hintsLeft) &&
                                        <Button className="is-info" size="medium" onClick={this.handleShowHint}>
                                            {resources.controls.hint}
                                            <span>&nbsp;</span>
                                            <span className="tag is-white">{ this.props.hintsLeft }</span>
                                        </Button>
                                    }
                                </section>
                            </section>
                        }
                    </div>

                    <div className="column is-2">
                        {
                            this.state.isGameStarted &&
                            <section>
                                <h2 className="title is-3 has-text-centered">
                                    {resources.score.heading}
                                </h2>
                                <div className="box">
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td>{resources.score.moves}</td>
                                            <td className="has-text-right">{ this.props.moves }</td>
                                        </tr>
                                        <tr>
                                            <td>{resources.score.lastGame}</td>
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
    highLightCardToggle: PropTypes.func,
    hints: PropTypes.number,
    hintsLeft: PropTypes.number,
    isPickAvailable: PropTypes.bool,
    leftIds: PropTypes.array,
    matchId: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
    ]),
    moves: PropTypes.number,
    pickedIndexes: PropTypes.array,
    removeCards: PropTypes.func,
    resetCards: PropTypes.func,
    resetPicks: PropTypes.func,
    toggleCard: PropTypes.func,
    togglePickAvailable: PropTypes.func,
};

App.defaultProps = {
    hints: 0
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
        hints: hintsUsedSelector(state),
        hintsLeft: state.hintsLeft,
        leftIds: leftIdsSelector(state),
        matchId: matchIdSelector(state),
        moves: state.moves,
        pickedIndexes: state.pickedCardsIndexes
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
