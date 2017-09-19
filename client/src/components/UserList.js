import React, { Component } from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import api from '../api/api';
import constants from '../helper/constants';

/* List of users sorted by their balance */
export default class UserList extends Component {
    
    render() {
        return (
            <div className="user-list-content">
                <h2 className='white'>Toast Coiners</h2>
                {/* <h4 className="user-list-header-text">Toast Coiners</h4> */}
                <BootstrapTable data={ this.props.users } options={ { noDataText: 'No participants yet.' } }>
                    <TableHeaderColumn dataField='id' isKey={ true }>User ID</TableHeaderColumn>
                    <TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
                    <TableHeaderColumn dataField='balance'>Balance</TableHeaderColumn>
                </BootstrapTable>
            </div>
        )
    }
}
