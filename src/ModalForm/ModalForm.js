import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input} from 'reactstrap';

export default class ModalForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleToggle = this.handleToggle.bind(this);
        this.handleClickSubmitButton = this.handleClickSubmitButton.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
    }

    handleToggle() {
        this.props.toggle();
    }

    handleClickSubmitButton() {
        this.props.handleSubmitButton();
    }

    handleOnChange(e) {
        this.props.handleUpdateData(e.target.value, e.target.name, this.props.type);
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.props.modalState} toggle={this.handleToggle} >
                    <ModalHeader toggle={this.handleToggle}>{this.props.header}</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="name">Name</Label>
                            <Input type="text" name="name" id="name" value={this.props.state.astronautData.name} onChange={this.handleOnChange}/>
                        </FormGroup>

                        <FormGroup>
                            <Label for="name">Surname</Label>
                            <Input type="text" name="surname" id="surname" value={this.props.state.astronautData.surname} onChange={this.handleOnChange}/>
                        </FormGroup>

                        <FormGroup>
                            <Label for="name">Birthdate</Label>
                            <Input type="date" name="birthdate" id="birthdate" value={this.props.state.astronautData.birthdate} onChange={this.handleOnChange} />
                        </FormGroup>

                        <FormGroup>
                            <Label for="name">Superpower</Label>
                            <Input type="text" name="superpower" id="superpower" value={this.props.state.astronautData.superpower} onChange={this.handleOnChange}/>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleClickSubmitButton}>{this.props.type}</Button>{' '}
                        <Button color="secondary" onClick={this.handleToggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}