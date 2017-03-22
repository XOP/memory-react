import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container">
                <div className="columns">
                    <div className="column is-half is-offset-one-quarter-desktop">

                        <h1>Memory</h1>

                    </div>
                </div>
            </div>
        );
    }
}

App.propTypes = {

};

const mapDispatchToProps = {

};

const mapStateToProps = state => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
