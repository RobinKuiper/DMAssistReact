import React, { Component } from 'react'
import { Button, Label, Modal } from 'semantic-ui-react'
import { Form } from 'formsy-semantic-ui-react'

export default class AddPlayerModal extends Component {
  constructor(props){
    super(props)

    this.state = {

    }
  }

  handleChange = (e, { name, value }) => { this.setState({ [name]: value })}

  render() {
    const errorLabel = <Label color="red" pointing />

    return (
      <Modal 
        open={this.state.open} 
        onOpen={() => this.setState({ open: true }) } 
        onClose={() => this.setState({ open: false }) }
        closeIcon 
        trigger={this.props.trigger}>
        <Modal.Content>
          <Form size='massive' onValidSubmit={this.props.handleSubmit}>
            <Form.Input
              required
              name='name'
              label='Name'
              type='text'
              value={this.state.name}
              onChange={this.handleChange}
              validations="minLength:2,isWords"
              validationErrors={{
                  minLength: 'Minimal length is 2 letters',
                  isWords: 'No numbers or special characters allowed',
                  isDefaultRequiredValue: 'Name is Required',
              }} 
              errorLabel={ errorLabel }
            />
            
            <Form.Input
              name='hit_points'
              label='Hit Points'
              type='number'
              value={this.state.hit_points}
              onChange={this.handleChange}
              errorLabel={ errorLabel }
            />

            <Form.Input
              name='armor_class'
              label='Armor Class'
              type='number'
              value={this.state.armor_class}
              onChange={this.handleChange}
              errorLabel={ errorLabel }
            />

            <Form.Input
              name='level'
              label='Level'
              type='number'
              value={this.state.level}
              onChange={this.handleChange}
              errorLabel={ errorLabel }
            />
            
            <Button size='massive' fluid type='submit' content='Save' positive icon='save' />
          </Form>
        </Modal.Content>
      </Modal>
    )
  }
}
