import { combineReducers } from 'redux';

import arrayShuffle from 'array-shuffle';

import initCardsReducer from './initCardsReducer';
import initialState from './initialState';

import {
    CONFIG_CLONES, // todo: config clone

    REMOVED_CARDS,
    RESET_PICKS,
    TOGGLED_CARD,
    TOGGLED_PICK_AVAILABLE
} from '../constants';

const initCards = () => {
    const cards = initCardsReducer();

    const cardsWithId = cards.map((card, id) => Object.assign({}, card, { id }));
    const cardsDouble = cardsWithId.concat(cardsWithId.slice(0));
    const cardsWithIndex = cardsDouble.map((card, index) => Object.assign({}, card, { index }));

    return arrayShuffle(cardsWithIndex);
};

// fixme remove redundancy
const initCardsState = initCards();

const cardsReducer = (state = initCardsState, action) => {
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

// const pickedCardsSelector = (state) => {
//     return state.cards.filter(item => item.isSelected);
// };

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
    // pickedCards: pickedCardsSelector,

    isPickAvailable: isPickAvailableReducer
});

export default rootReducer;
