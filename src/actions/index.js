import {
    TOGGLED_CARD,
    TOGGLED_CARD_HIGHLIGHT,
    REMOVED_CARDS,
    RESET_CARDS,
    RESET_PICKS,
    TOGGLED_PICK_AVAILABLE
} from '../constants';

export const pickAvailableToggle = (available = true) => ({
    type: TOGGLED_PICK_AVAILABLE,
    payload: available
});

export const toggleCard = (index, isSelected) => ({
    type: TOGGLED_CARD,
    payload: { index, isSelected }
});

export const removeCards = (id = '') => ({
    type: REMOVED_CARDS,
    payload: id === '' ? null : +id // string to number coercion
});

export const resetCards = () => ({
    type: RESET_CARDS
});

export const resetPicks = () => ({
    type: RESET_PICKS
});

export const highLightCardToggle = (id, isHighlighted) => ({
    type: TOGGLED_CARD_HIGHLIGHT,
    payload: { id, isHighlighted }
});
