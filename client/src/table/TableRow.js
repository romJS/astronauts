import React, { Component } from 'react';
import {Button} from "reactstrap";


export default class TableRow extends Component {

    handleEditClick() {
        this.props.onEditAstronaut(this.props.astronaut)
    }

    handleDeleteClick() {
       this.props.onDeleteAstronaut(this.props.astronaut._id);
    }

    _formatDate(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const day = d.getDate();
        return `${day}. ${month}. ${year}`;
    }

    render() {
        const date = this._formatDate(this.props.astronaut.birthdate);
        const {name, surname, superpower} = this.props.astronaut;
        return (
            <tr>
                <td>{name}</td>
                <td>{surname}</td>
                <td>{date}</td>
                <td>{superpower}</td>
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