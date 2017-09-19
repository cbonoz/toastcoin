import React, { Component } from 'react'
import {Row, Col, Grid} from 'react-bootstrap';
import Header from './Header';
import ActivityList from './ActivityList';
import UserList from './UserList';
import api from './../api/api';
import constants from './../helper/constants';
import openSocket from 'socket.io-client';

export default class Home extends Component {
    
    constructor(props) {
        super(props)

        this.state = {
            users: [],
            activities: [],
            socket: null
        }

    }

    
    componentWillMount() {
        this._requestUsers();
        const socket = openSocket(api.socketUrl);
        this.setState({socket: socket});
    }
    

    _subscribeToActivity() {
        const self = this;
        this.state.socket.on('activity', (activity) => {
            self.state.activities.push(activity);
        });
    }

    _createUser(id, name, balance) {
        return  {id: id, name: name, balance: balance}
    }

    _requestUsers() {
        const self = this;
        const requestUrl = api.getUsers();
        console.log('requestUsers: ' + requestUrl);

        // TODO: implement response set of users.
        self.setState({users: [1,2,3,4].map((x) => 
            self._createUser(x, `User${x}`, constants.initialBalance))
        });

    }
    
    
    render() {
        return (
            <div>
                <div className='home-content'>
                    {/* <Grid>
                        <Row className="show-grid">
                            <UserList/>
                            <ActivityList/>
                        </Row>
                    </Grid>
 */}
                    <Row className="show-grid">
                        <Col xs={12} md={6} className="App-header left-column">
                            <Header/>
                            <UserList users={this.state.users}/>
                        </Col>
                        <Col xs={12} md={6} className='right-column'>
                            <ActivityList activities={this.state.activities}/>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}
