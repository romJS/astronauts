import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button } from 'reactstrap';

import TableHead from "./table/TableHead";
import TableBody from "./table/TableBody";
import TableRow from './table/TableRow';
import ModalForm from './modalForm/ModalForm';


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
          message: '',

          newAstronautModal: false,
          editAstronautModal: false
      };

      const LOCALHOST = 'http://localhost:3000';
      const HEROKU = 'https://pure-retreat-56664.herokuapp.com';
      this.URL = LOCALHOST;

      this.toggleModalForm = this.toggleModalForm.bind(this);
      this.createAstronaut = this.createAstronaut.bind(this);
      this.updateAstronaut = this.updateAstronaut.bind(this);
      this.deleteAstronaut = this.deleteAstronaut.bind(this);
      this.handleEditAstronaut = this.handleEditAstronaut.bind(this);
      this.handleChangeAstronautData = this.handleChangeAstronautData.bind(this);
  }

  componentDidMount() {
      this.getAstronauts();
  }

  toggleModalForm(type = false) {
      if(!type)
          this.setState( {newAstronautModal: !this.state.newAstronautModal} );
      else
          this.setState( { editAstronautModal: !this.state.editAstronautModal} );

      this._clearAstronautData();
  }

// -----------------------------------------------------------------
  handleChangeAstronautData(value, inputName) {
      const { astronautData } = this.state;
      astronautData[inputName] = value;
      this.setState( {astronautData: astronautData});
  }

  handleEditAstronaut(props) {
      const { name, surname, birthdate, superpower} = props;
      const id = props._id;
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
          message: ''
      })
  }

// API actions --------------------------------------------------------
  getAstronauts() {
      axios.get(this.URL + '/astronauts')
          .then( response => this.setState( {astronauts: response.data} ));
  }

  createAstronaut() {
      const {name, surname, birthdate, superpower} = this.state.astronautData;

      axios.post(this.URL + '/astronauts',{name, surname, birthdate, superpower})
          .then( response => {
              const { astronauts } = this.state;

              astronauts.push(response.data);

              this.setState( { astronauts, newAstronautModal: !this.state.newAstronautModal } );
              this._clearAstronautData();
          })
          .catch(err => {
              this.setState({message: 'Please fill in empty fields.'});
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
      if(window.confirm('Do you really want to delete the astronaut?')) {
          axios.delete(this.URL + '/astronauts/' + id)
              .then( response => this.getAstronauts() );
      }
  }

  render() {
      const astronauts = this.state.astronauts.map( (astronaut, index) => {
          return (
              <TableRow
                  key={index + 1}
                  astronaut={astronaut}
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
                  <TableHead />
                  <TableBody astronauts={astronauts}/>
              </Table>

              <div>
                  <Button className="my-3" color="primary" onClick={() => this.toggleModalForm(false)}>Add astronaut</Button>
                  <ModalForm
                    header="Add astronaut"
                    type="Add"
                    modalState={this.state.newAstronautModal}
                    state={this.state}
                    toggle={this.toggleModalForm}
                    handleSubmitButton={this.createAstronaut}
                    handleUpdateData={this.handleChangeAstronautData}
                    editMode={false}
                  />

                  <ModalForm
                      header="Edit astronaut"
                      type="Update"
                      modalState={this.state.editAstronautModal}
                      state={this.state}
                      toggle={this.toggleModalForm}
                      handleSubmitButton={this.updateAstronaut}
                      handleUpdateData={this.handleChangeAstronautData}
                      editMode={true}
                  />
              </div>
          </div>
      );
  }
}