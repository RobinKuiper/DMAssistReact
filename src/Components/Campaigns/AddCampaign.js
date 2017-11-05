import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Button, Header, Label, Segment } from 'semantic-ui-react'
import { Form } from 'formsy-semantic-ui-react'

import { Database, Auth } from './../../Lib/firebase'
import { Slugify } from './../../Lib/Common'

export default class AddCampaign extends Component {
  constructor(props){
    super(props)

    this.state = {
      created: null,
      name: '',
      settings: {
        shortRest: '1H',
        longRest: '8H',
        roundDuration: '6S'
      }
    }
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })
  save = (e) => {
    const { name, settings } = this.state

    var campaign = {
      name,
      slug: Slugify(name),
      round: 0,
      times: {
        encounter: 0,
        session: 0,
        total: 0
      },
      settings
    }

    // Send campaign to firebase
    Database.ref('userdata/'+Auth.currentUser.uid+'/campaigns/'+campaign.slug).set( campaign )
      .then(() => { 
        this.props.alert('Your campaign is saved!', 'success', 'checkmark') 
        this.setState({ created: campaign.slug })
      })
  }

  render(){
    const errorLabel = <Label color="red" pointing='left' />

    if(Auth.currentUser) {
      return (
        <Segment raised>
          { this.state.created && <Redirect to={'/campaign/'+this.state.created} /> }
          <Header dividing>Create New Campaign</Header>
          <Form onValidSubmit={this.save}>
            <Form.Group>
              <Form.Input
                required
                inline
                name='name'
                label='Name'
                type='text'
                value={this.state.name}
                onChange={(e) => this.setState({ name: e.target.value }) }
                validations="minLength:2,isWords"
                validationErrors={{
                    minLength: 'Minimal length is 2 letters',
                    isWords: 'No numbers or special characters allowed',
                    isDefaultRequiredValue: 'Name is Required',
                }} 
                errorLabel={ errorLabel }
              />
              <Button icon='save' positive content='Create' type='submit' />
            </Form.Group>
          </Form>
        </Segment>
      )
    } else return null
  }
}
