import React, { Component } from 'react'
import logo from './../static/toast_yellow_trans.png';

export default class Header extends Component {
    render() {
        let title = "Toastcoin";
        return (
            <div className="App-header">
                <div className='header-content'>
                    <img src={logo} className="App-logo" alt={title} />
                    <div className="title-text">
                        Toast<span className="coin-text">coin</span>
                    </div>
                    {/* <span>A currency for restaurant rewards.</span> */}

                    <div className='phone-text'>
                        To start,<br/> Text your name to
                        <span className="phone-number-text">&nbsp;5555</span>.
                    </div>
                    <br/><hr/>
                </div>
            </div>
        )
    }
}
