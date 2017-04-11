import React, { PropTypes } from 'react';

const Splash = ({ children, heading, text }) => (
    <section className="memory-game-splash">
        <div className="section has-text-centered">
            <h1 className="title is-2">
                { heading }
            </h1>
            {
                text &&
                <h2 className="subtitle is-4">
                    { text }
                </h2>
            }
            {
                children &&
                <div className="section">
                    { children }
                </div>
            }
        </div>
    </section>
);

Splash.propTypes = {
    children: PropTypes.node,
    heading: PropTypes.node,
    text: PropTypes.node
};

export default Splash;
