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

        case REMOVED_CARDS:
            return state.filter(item => item.id !== action.payload);

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

const pickedCardsSelector = state => {
    return state.cards.filter(item => state.pickedCardsIndexes.indexOf(item.index) > -1);
};

const matchesSelector = state => {
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

const isPickAvailableReducer = (state = initialState.isPickAvailable, action) => {
    switch (action.type) {
        case TOGGLED_PICK_AVAILABLE:
            return action.payload;

        default:
            return state;
    }
};

const rootReducer = combineReducers({
    cards: cardsReducer,

    pickedCardsIndexes: pickedCardsIndexesReducer,

    isPickAvailable: isPickAvailableReducer
});

export {
    matchesSelector,
    pickedCardsSelector
};

export default rootReducer;
