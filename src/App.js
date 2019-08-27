import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button } from 'reactstrap';

import TableHead from "./Table/TableHead";
import TableBody from "./Table/TableBody";
import TableRow from './Table/TableRow';
import ModalForm from './ModalForm/ModalForm';


export default class App extends Component {

  constructor(props) {
      super(props);
      this.state = {
          astronauts: [],
          astronautData: {
              id:'',
              name: '',
              surname: '',
              birthdate: '',
              superpower: ''
          },

      newAstronautModal: false,
      editAstronautModal: false,
      }

      this.URL = 'http://localhost:3000';
      this.toggleNewAstronaut = this.toggleNewAstronaut.bind(this);
      this.toggleEditAstronaut = this.toggleEditAstronaut.bind(this);
      this.createAstronaut = this.createAstronaut.bind(this);
      this.updateAstronaut = this.updateAstronaut.bind(this);
      this.deleteAstronaut = this.deleteAstronaut.bind(this);
      this.handleEditAstronaut = this.handleEditAstronaut.bind(this);
      this.handleChangeAstronautData = this.handleChangeAstronautData.bind(this);
  }

// lifecycle method
  componentDidMount() {
      this.getAstronauts();
  }

// togglers --------------------------------------------------------
  toggleNewAstronaut() {
      this.setState( {newAstronautModal: !this.state.newAstronautModal} );
  }

  toggleEditAstronaut() {
      this.setState( { editAstronautModal: !this.state.editAstronautModal} );
      this._clearAstronautData();
  }

// -----------------------------------------------------------------
  handleChangeAstronautData(value, inputName, astronautType) {
      const { astronautData }= this.state;
      astronautData[inputName] = value;
      this.setState( {astronautData: astronautData});
  }

  handleEditAstronaut(id, name, surname, birthdate, superpower) {
      this.setState({
          astronautData: {id, name, surname, birthdate, superpower},
          editAstronautModal: !this.state.editAstronautModal
      });
  }

  _clearAstronautData() {
      this.setState({
          astronautData: {
              id: '',
              name: '',
              surname: '',
              birthdate: '',
              superpower: ''
          },
      })
  }

// API actions --------------------------------------------------------
  getAstronauts() {
      axios.get(this.URL + '/astronauts')
          .then( response => {
              this.setState( {astronauts: response.data})
          });
  }

  createAstronaut() {
      const {name, surname, birthdate, superpower} = this.state.astronautData;

      axios.post(this.URL + '/astronauts',{name, surname, birthdate, superpower})
          .then( response => {
              const { astronauts }= this.state;

              astronauts.push(response.data);

              this.setState( { astronauts, newAstronautModal: !this.state.newAstronautModal } )
              this._clearAstronautData();
          });
  }

  updateAstronaut(id) {
      const {name, surname, birthdate, superpower} = this.state.astronautData;

      axios.put(this.URL + '/astronauts/' + this.state.astronautData.id,
          {name, surname, birthdate, superpower})
          .then( response => this.getAstronauts() );

      this.setState({ editAstronautModal: false} );
      this._clearAstronautData();
  }

  deleteAstronaut(id) {
      if(window.confirm('Opravdu chcete tuto položku smazat?')) {
          axios.delete(this.URL + '/astronauts/' + id)
              .then( response => this.getAstronauts() );
      }
  }

  render() {
      const astronauts = this.state.astronauts.map( (astronaut, index) => {
          return (
              <TableRow
                  key={index + 1}
                  id={astronaut._id}
                  name={astronaut.name}
                  surname={astronaut.surname}
                  birthdate={astronaut.birthdate}
                  superpower={astronaut.superpower}
                  onEditAstronaut={this.handleEditAstronaut}
                  onDeleteAstronaut={this.deleteAstronaut}
              />
          )
      });

      return (
          <div className="App">
              <h1 className="align-self-center">Astronauts</h1>
              <br />
              <Table>
                  <TableHead/>
                  <TableBody astronauts={astronauts} />
              </Table>

              <div>
                  <Button className="my-3" color="primary" onClick={this.toggleNewAstronaut}>Add astronaut</Button>
                  <ModalForm
                    header="Add astronaut"
                    type="Add"
                    modalState={this.state.newAstronautModal}
                    state={this.state}
                    toggle={this.toggleNewAstronaut}
                    handleSubmitButton={this.createAstronaut}
                    handleUpdateData={this.handleChangeAstronautData}
                  />

                  <ModalForm
                      header="Edit astronaut"
                      type="Update"
                      modalState={this.state.editAstronautModal}
                      state={this.state}
                      toggle={this.toggleEditAstronaut}
                      handleSubmitButton={this.updateAstronaut}
                      handleUpdateData={this.handleChangeAstronautData}
                  />
              </div>
          </div>
      );
  }
}