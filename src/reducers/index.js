import { combineReducers } from 'redux';

import arrayShuffle from 'array-shuffle';
import _uniq from 'lodash/uniq';

import initCardsReducer from './initCardsReducer';
import initialState from './initialState';

import {
    CONFIG_CLONES,

    REMOVED_CARDS,
    RESET_CARDS,
    RESET_PICKS,
    TOGGLED_CARD,
    TOGGLED_CARD_HIGHLIGHT,
    TOGGLED_PICK_AVAILABLE
} from '../constants';

const initCards = () => {
    const cards = initCardsReducer();

    // {...} -> {..., id}
    const cardsWithId = cards.map((card, id) => Object.assign({}, card, { id }));

    // duplicating initial array N times
    const cardsCloned = new Array(CONFIG_CLONES).fill(null).reduce((acc) => {
        return acc.concat(cardsWithId.slice(0))
    }, []);

    // {...} -> {..., index}
    const cardsWithIndex = cardsCloned.map((card, index) => Object.assign({}, card, { index }));

    return arrayShuffle(cardsWithIndex);
};

// =================================================================================================================
// Reducers
// =================================================================================================================

const cardsReducer = (state = initCards(), action) => {
    switch (action.type) {
        case TOGGLED_CARD: {
            return state.map(item => {
                if (item.index === action.payload.index) {
                    return  {
                        ...item,
                        isSelected: action.payload.isSelected
                    }
                } else {
                    return item;
                }
            });
        }

        case TOGGLED_CARD_HIGHLIGHT: {
            return state.map(item => {
                if (item.id === action.payload.id) {
                    return  {
                        ...item,
                        isHighlighted: action.payload.isHighlighted
                    }
                } else {
                    return item;
                }
            });
        }

        case RESET_CARDS: {
            return initCards();
        }

        case RESET_PICKS: {
            return state.map(item => {
                return  {
                    ...item,
                    isSelected: false
                }
            });
        }

        case REMOVED_CARDS: {
            if (action.payload === null) {
                return [];
            }

            return state.map(item => {
                if (item.id === action.payload) {
                    return  {
                        ...item,
                        isRemoved: true
                    }
                } else {
                    return item;
                }
            });
        }

        default:
            return state;
    }
};

const pickedCardsIndexesReducer = (state = initialState.pickedCardsIndexes, action) => {
    switch (action.type) {
        case TOGGLED_CARD: {
            if (action.payload.isSelected) {
                return state.concat(action.payload.index);
            } else {
                return state.filter(item => item !== action.payload.index);
            }
        }

        case REMOVED_CARDS:
        case RESET_CARDS:
        case RESET_PICKS: {
            return initialState.pickedCardsIndexes;
        }

        default:
            return state;
    }
};

const isPickAvailableReducer = (state = initialState.isPickAvailable, action = {}) => {
    switch (action.type) {
        case TOGGLED_PICK_AVAILABLE:
            return action.payload;

        default:
            return state;
    }
};

const movesReducer = (state = initialState.moves, action = {}) => {
    switch (action.type) {
        case TOGGLED_CARD:
            return state + 1;

        case RESET_CARDS:
            return initialState.moves;

        default:
            return state;
    }
};

const removedCardsIdsReducer = (state = initialState.removedCardsIds, action) => {
    switch (action.type) {
        case REMOVED_CARDS:
            return state.concat(action.payload);

        case RESET_CARDS:
            return initialState.removedCardsIds;

        default:
            return state;
    }
};

// =================================================================================================================
// Selectors
// =================================================================================================================

const pickedCardsSelector = state => {
    return state.cards.filter(item => state.pickedCardsIndexes.indexOf(item.index) > -1);
};

const leftCardsSelector = state => {
    return state.cards.filter(item => state.removedCardsIds.indexOf(item.id) === -1);
};

const leftIdsSelector = state => {
    return _uniq(leftCardsSelector(state).map(item => item.id));
};

const matchIdSelector = state => {
    const pickedCards = pickedCardsSelector(state);

    if (pickedCards.length !== CONFIG_CLONES) {
        return null;
    }

    const pickedCardsIds = pickedCards.map(item => item.id);

    if (_uniq(pickedCardsIds).length === 1) {
        return pickedCardsIds[0].toString();
    } else {
        return false;
    }
};

const rootReducer = combineReducers({
    cards: cardsReducer,
    isPickAvailable: isPickAvailableReducer,
    moves: movesReducer,
    pickedCardsIndexes: pickedCardsIndexesReducer,
    removedCardsIds: removedCardsIdsReducer
});

export {
    leftCardsSelector,
    leftIdsSelector,
    matchIdSelector,
    pickedCardsSelector
};

export default rootReducer;
