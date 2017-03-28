import { combineReducers } from 'redux';

import arrayShuffle from 'array-shuffle';

import cardsReducer from './cardsReducer';
import initialState from './initialState';

const cardsSelector = () => {
    const cards = cardsReducer();

    const cardsWithId = cards.map((card, id) => Object.assign({}, card, { id }));
    const cardsDouble = cardsWithId.concat(cardsWithId.slice(0));

    return arrayShuffle(cardsDouble);
};

const rootReducer = combineReducers({
    cards: cardsSelector
});

export default rootReducer;
