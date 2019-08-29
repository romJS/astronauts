import React, { Component } from 'react';

export default class TableHead extends  Component {

    constructor(props) {
        super(props)
    }

    render() {
        return(
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>Brithdate</th>
                    <th>Superpower</th>
                    <th></th>
                </tr>
            </thead>
        )
    }
}