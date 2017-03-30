import {
    TOGGLED_PICK_AVAILABLE
} from '../constants';

export const pickAvailableToggle = (available = true) => ({
    type: TOGGLED_PICK_AVAILABLE,
    payload: available
});

