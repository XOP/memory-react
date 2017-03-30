import { combineReducers } from 'redux';

import arrayShuffle from 'array-shuffle';

import cardsReducer from './cardsReducer';
import initialState from './initialState';

import {
    TOGGLED_PICK_AVAILABLE
} from '../constants';

const cardsSelector = () => {
    const cards = cardsReducer();

    const cardsWithId = cards.map((card, id) => Object.assign({}, card, { id }));
    const cardsDouble = cardsWithId.concat(cardsWithId.slice(0));

    return arrayShuffle(cardsDouble);
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
    cards: cardsSelector,

    isPickAvailable: isPickAvailableReducer
});

export default rootReducer;
