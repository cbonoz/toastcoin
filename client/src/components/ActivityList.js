import React, { Component } from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import api from '../api/api';
import FlipMove from 'react-flip-move';

export default class ActivityList extends Component {

    constructor(params) {
        super(params);
    }
    
    componentWillMount() {
        
    }
      
    render() {
        return (
            <div>
                <h2>Recent Activity</h2>
                <hr/>
                <FlipMove 
                    duration={750} 
                    easing="ease-out">
                {this.props.activities.map(activity => (
                  <div className="large-text">{JSON.stringify(activity)}<br/><hr/></div>
                ))}
              </FlipMove>
            </div>
        )
    }
}
