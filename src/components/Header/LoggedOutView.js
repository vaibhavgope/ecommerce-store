import React, { Component } from 'react'

export default class LoggedOutView extends Component {
    render() {
        return (
            <>
                <div className="header-link" onClick={this.explore}>
                    Explore
                </div>

                <div className="header-link" onClick={this.login}>
                    Login
                </div>

                <div className="header-link">
                    <Button type="primary" onClick={this.register}>
                        Register
                    </Button>
                </div>
            </>
        )
    }
}
