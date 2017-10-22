import React, { Component } from 'react'
import { Button, Form, Header, Segment } from 'semantic-ui-react'

import firebase, { Auth } from './../../Lib/firebase'

export default class AddCampaign extends Component {
  constructor(props){
    super(props)

    this.state = {
      uid: Auth.currentUser.uid,
      campaignName: '',
      players: [
        { name: '', level: '', hitPoints: '', armorClass: '' }
      ],
      settings: {
        shortRest: '1H',
        longRest: '8H',
        roundDuraction: '6'
      }
    }
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })
  handleSubmit = (e) => {
    e.preventDefault();
    const { campaignName, settings } = this.state

    var campaign = {
      campaignName,
      settings
    }

    // Send message to firebase
    firebase.database().ref(this.state.uid).child('campaigns').push( campaign )
    this.setState({
      uid: Auth.currentUser.uid,
      campaignName: '',
      players: [
        { name: '', level: '', hitPoints: '', armorClass: '' }
      ],
      settings: {
        shortRest: '1H',
        longRest: '8H',
        roundDuraction: '6'
      }
    })
  }

  render(){
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Input label='Campaign Name' type='text' name='campaignName' value={this.state.campaignName} onChange={this.handleChange} />

        {/*<Header dividing>Players</Header>
        <Segment basic>
          {
            this.state.players.map( player => (
              <Form.Group widths='equal' inline>
                <Form.Field>
                  <Input placeholder='Name' value={player.name} onChange={this.handleChange} />
                </Form.Field>
                <Form.Field>
                  <Input placeholder='Level' value={player.level} onChange={this.handleChange} />
                </Form.Field>
                <Form.Field>
                  <Input placeholder='Hit Points' value={player.hitPoints} onChange={this.handleChange} />
                </Form.Field>
                <Form.Field>
                  <Input placeholder='Armor Class' value={player.armorClass} onChange={this.handleChange} />
                </Form.Field>
              </Form.Group>
            ))
          }

          <Button>
            <Icon name='plus' />
            Add Player
          </Button>
        </Segment>*/}

        <Header dividing>Settings</Header>
        <Segment basic>
          <Form.Input label='Short Rest' type='text' placeholder='1H' name='shortRest' value={this.state.settings.shortRest} onChange={this.handleChange} />
          <Form.Input label='Long Rest' type='text' placeholder='8H' name='longRest' value={this.state.settings.longRest} onChange={this.handleChange} />
          <Form.Input label='Round Duration' type='text' placeholder='6' name='roundDuraction' value={this.state.settings.roundDuraction} onChange={this.handleChange} />
        </Segment>

        <Segment basic clearing>
          <Button color={'green'} floated='right' type='submit'>Save Campaign</Button>
        </Segment>

      </Form>
    )
  }
}
