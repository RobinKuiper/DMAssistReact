import React, { Component } from 'react'
import { Button, Form, Header, Segment } from 'semantic-ui-react'

import { Database, Auth } from './../../Lib/firebase'
import { Slugify } from './../../Lib/Common'
import LoginModal from './../../Components/LoginModal'

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
      round: 0,
      times: {
        encounter: 0,
        session: 0,
        total: 0
      },
      settings
    }

    // Send campaign to firebase
    Database.ref('userdata/'+this.state.user.uid+'/campaigns/'+Slugify(campaign.name)).set( campaign )

    // Empty form
    this.setState({
      campaignName: '',
      players: [
        { name: '', level: '', hitPoints: '', armorClass: '' }
      ],
      settings: {
        shortRest: '1H',
        longRest: '8H',
        roundDuration: 6
      }
    })
  }

  render(){
    if(Auth.currentUser) {
      return (
        <Form loading={!this.state.loaded} size='tiny'>
          <Form.Input label='Campaign Name' type='text' name='name' value={this.state.campaignName} onChange={this.handleChange} />

          {/*<Header dividing>Players</Header>

          <Form.Group compact>
            <Form.Input placeholder='Name' onChange={this.handleChange} />
            <Form.Input placeholder='Level' onChange={this.handleChange} />
            <Form.Input placeholder='Hit Points' onChange={this.handleChange} />
            <Form.Input placeholder='Armor Class' onChange={this.handleChange} />
          </Form.Group>

          <Button icon='plus' content='Add Player' />*/}

          <Header dividing>Settings</Header>
          <Form.Input label='Short Rest' type='text' placeholder='1H' name='shortRest' value={this.state.settings.shortRest} onChange={this.handleChange} />
          <Form.Input label='Long Rest' type='text' placeholder='8H' name='longRest' value={this.state.settings.longRest} onChange={this.handleChange} />
          <Form.Input label='Round Duration' type='text' placeholder='6' name='roundDuration' value={this.state.settings.roundDuration} onChange={this.handleChange} />

          <Segment basic clearing>
            <Button color={'green'} floated='right' type='submit' onClick={this.handleSubmit.bind(this)}>Save Campaign</Button>
          </Segment>

        </Form>
      )
    } else {
      return (<p>Please <LoginModal trigger={<span style={{textDecoration: 'underline', cursor: 'pointer'}}>Sign In</span>} /> to add campaigns.</p>)
    }
  }

  componentDidMount() {
    Auth.onAuthStateChanged((user) => {
      if (user){
        this.setState({ user, loaded: true })
      }
    })
  }
}
