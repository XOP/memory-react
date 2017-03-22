/* eslint-disable import/default */

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import reducers from './reducers';

import App from './containers/app';

require('./favicon.ico');

import './main.scss';

render(
    <Provider store={createStore(reducers)}>
        <App />
    </Provider>,
    document.getElementById('app')
);
