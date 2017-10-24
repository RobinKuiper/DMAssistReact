import React, { Component } from 'react'
import { Button, Form, Header, Segment } from 'semantic-ui-react'

import firebase, { Auth } from './../../Lib/firebase'
import { Slugify } from './../../Lib/Common'

export default class AddCampaign extends Component {
  constructor(props){
    super(props)

    this.state = {
      user: Auth.currentUser,
      loaded: false,
      name: '',
      players: [
        { name: '', level: '', hitPoints: '', armorClass: '' }
      ],
      settings: {
        shortRest: '1H',
        longRest: '8H',
        roundDuration: '6'
      }
    }
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })
  handleSubmit = (e) => {
    e.preventDefault();
    const { name, settings } = this.state

    var campaign = {
      name,
      slug: Slugify(name),
      turnorder: [],
      players: [],
      settings
    }

    // Send campaign to firebase
    firebase.database().ref('userdata/'+this.state.user.uid+'/campaigns/'+Slugify(campaign.name)).set( campaign )

    // Empty form
    this.setState({
      campaignName: '',
      players: [
        { name: '', level: '', hitPoints: '', armorClass: '' }
      ],
      settings: {
        shortRest: '1H',
        longRest: '8H',
        roundDuration: '6'
      }
    })
  }

  render(){
    return (
      <Form onSubmit={this.handleSubmit.bind(this)} loading={!this.state.loaded}>
        <Form.Input label='Campaign Name' type='text' name='name' value={this.state.campaignName} onChange={this.handleChange} />

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
          <Form.Input label='Round Duration' type='text' placeholder='6' name='roundDuration' value={this.state.settings.roundDuration} onChange={this.handleChange} />
        </Segment>

        <Segment basic clearing>
          <Button color={'green'} floated='right' type='submit'>Save Campaign</Button>
        </Segment>

      </Form>
    )
  }

  componentDidMount() {
    Auth.onAuthStateChanged((user) => {
      if (user){
        this.setState({ user, loaded: true })
      }
    })
  }
}
