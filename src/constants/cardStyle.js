import { CONFIG_CHECK_TIMEOUT } from './index';

const timeoutSeconds = `${CONFIG_CHECK_TIMEOUT / 1000 / 4}s`;

const cardWidth = '15vh';
const cardHeight = '15vh';
const cardMaxHeight = '128px';
const cardMaxWidth = '128px';

export const CARD_BACK_STYLE = {
    backgroundColor: '#3273dc'
};

export const CARD_BACK_HIGHLIGHTED_STYLE = Object.assign({}, CARD_BACK_STYLE, {
    outline: '2px solid #999',
    outlineOffset: '6px'
});

export const CARD_DEFAULT_STYLE = {
    display: 'inline-block',
    width: cardWidth,
    height: cardHeight,
    maxWidth: cardMaxWidth,
    maxHeight: cardMaxHeight,
    padding: '1vh',
    margin: '1vh',
    border: '1px solid',
    borderColor: '#fff',
    borderRadius: '3px',
    transition: `all ${timeoutSeconds} ease-out`,
    opacity: '1'
};

export const CARD_SELECTED_STYLE = {
    borderColor: '#328bdc'
};

export const CARD_REMOVED_STYLE = {
    opacity: '0',
    visibility: 'hidden',
    transform: 'translateY(-50%)'
};
