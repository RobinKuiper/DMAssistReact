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
  save = (e) => {
    this.props.handleUpdate(e)
    this.setState({ open: false })
  }

  render() {
    const errorLabel = <Label color="red" pointing />
    const { item } = this.props

    return (
      <Modal 
        open={this.state.open} 
        onOpen={() => this.setState({ open: true }) } 
        onClose={() => this.setState({ open: false }) }
        closeIcon 
        trigger={this.props.trigger}>
        <Modal.Content>
          <Form size='massive' onValidSubmit={this.save.bind(this)}>
            <Form.Input
              required
              name='name'
              label='Name'
              type='text'
              value={this.state.name || item.name}
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
              name='initiative'
              label='Initiative'
              type='number'
              value={this.state.initiative || item.initiative}
              onChange={this.handleChange}
              errorLabel={ errorLabel }
            />
            
            <Form.Input
              name='hit_points'
              label='Hit Points'
              type='number'
              value={this.state.hit_points || item.hit_points}
              onChange={this.handleChange}
              errorLabel={ errorLabel }
            />

            <Form.Input
              name='armor_class'
              label='Armor Class'
              type='number'
              value={this.state.armor_class || item.armor_class}
              onChange={this.handleChange}
              errorLabel={ errorLabel }
            />

            <Form.Input
              name='level'
              label='Level'
              type='number'
              value={this.state.level || item.level}
              onChange={this.handleChange}
              errorLabel={ errorLabel }
            />
            
            <Button size='massive' fluid type='submit' content='Update' positive icon='save' />
          </Form>
        </Modal.Content>
      </Modal>
    )
  }
}
