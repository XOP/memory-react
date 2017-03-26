import { combineReducers } from 'redux';

import arrayShuffle from 'array-shuffle';

import cardsReducer from './cardsReducer';
import initialState from './initialState';

const cardsSelector = () => {
    const cards = cardsReducer();
    const cardsDouble = cards.concat(cards.slice(0));

    return arrayShuffle(cardsDouble);
};

const rootReducer = combineReducers({
    cards: cardsSelector
});

export default rootReducer;
