import React, { Component } from 'react';
import {Button} from "reactstrap";


export default class TableRow extends Component {

    handleEditClick() {
        this.props.onEditAstronaut(this.props)
    }

    handleDeleteClick() {
       this.props.onDeleteAstronaut(this.props.id);
    }

    _formatDate(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const day = d.getDate();
        return `${day}. ${month}. ${year}`;
    }

    render() {
        const date = this._formatDate(this.props.birthdate);
        return (
            <tr>
                <td>{this.props.name}</td>
                <td>{this.props.surname}</td>
                <td>{date}</td>
                <td>{this.props.superpower}</td>
                <td>
                    <Button color="primary"
                            size="sm"
                            className="mr-2"
                            onClick={this.handleEditClick.bind(this)}>
                            Edit
                    </Button>
                    <Button color="danger"
                            size="sm"
                            onClick={this.handleDeleteClick.bind(this)}>
                            Delete
                    </Button>
                </td>
            </tr>
        )
    }
}