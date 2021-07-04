import React, { Component } from 'react'

export default class LoggedInView extends Component {
    render() {
        return (
            <>
                <div className="header-link" onClick={this.props.explore}>
                    Explore
                </div>

                <div className="header-link" onClick={this.props.login}>
                    Logout
                </div>
            </>
        )
    }
}
