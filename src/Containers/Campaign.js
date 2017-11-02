import React, { Component } from 'react'
import { Database, Auth } from './../Lib/firebase'
import { formatTime, toSeconds } from './../Lib/Common'
import { Button, Grid, Label, Popup, Segment, Table } from 'semantic-ui-react'
import { Form } from 'formsy-semantic-ui-react'
import Formsy from 'formsy-react'
import Panel from './../Components/UI/Panel'
import Turnorder from './../Components/Campaigns/Turnorder'
import Adsense from './../Components/Adsense'
//import FixedMenu from "./../Components/FixedMenu";
import CampaignSettingsModal from './../Components/Campaigns/CampaignSettingsModal'

Formsy.addValidationRule('isRequired', function (values, value) {
  return value !== null && value !== '';
});

export default class Campaign extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: null,
      campaign: null,
      turnorder: null,
      loaded: false,
      dropdownLoaded: false,
      campaignRef: null,
      turnorderRef: null,

      newPlayerName: '',
      newPlayerLevel: '',
      newPlayerHP: '',
      newPlayerAC: '',
    }

    this.addTime = this.addTime.bind(this)
  }

  render() {
    const campaign = this.state.campaign

    if(campaign){
      return (
        <div>
          {/*<FixedMenu title={this.state.campaign.name} />*/}
          <main>
            <Turnorder campaign={this.state.campaign} monsters={this.props.monsters} encounters={this.props.encounters} campaignRef={this.state.campaignRef} />

            <Segment raised>
              <Grid>
                <Grid.Column width={6}>
                  <Button.Group size='massive' color='blue' floated='left'>
                    <Popup content='Reset Session Time' trigger={<Button icon='undo' onClick={() => { this.state.campaignRef.child('/times/session').set(0) }}/>} />
                    <Button disabled>{formatTime(campaign.times.session)}</Button>
                  </Button.Group>

                  <Button.Group size='mini' color='blue' floated='left' basic vertical>
                    <Popup content={'Add ' + campaign.settings.shortRest + ' to your session time.'} trigger={<Button icon='plus' content='Short Rest' onClick={() => { this.addTime(campaign.settings.shortRest) }} />} />
                    <Popup content={'Add ' + campaign.settings.longRest + ' to your session time.'} trigger={<Button icon='plus' content='Long Rest' onClick={() => { this.addTime(campaign.settings.longRest) }} />} />
                  </Button.Group>
                </Grid.Column>

                <Grid.Column width={4}>
                  <Popup content='Coming Soon' trigger={<span>Public Link</span>} />
                </Grid.Column>

                <Grid.Column width={6} textAlign='right'>
                  <CampaignSettingsModal campaign={campaign} trigger={<Button icon='settings' content='Settings' color='blue' />} />
                </Grid.Column>
              </Grid>
            </Segment>

            <Panel title='Players' content={this.playerContent} loaded={this.state.loaded} closeable />

            { process.env.NODE_ENV !== "development" &&
              <Adsense client='ca-pub-2044382203546332' slot='7541388493' style={{marginTop: 40, width: 728, height: 90}} />
            }
          </main>
        </div>
      )
    }

    return <div>Loading...</div>
  }

  addPlayer() {
    var player = {
      name: this.state.newPlayerName,
      level: this.state.newPlayerLevel,
      hit_points: this.state.newPlayerHP,
      armor_class: this.state.newPlayerAC
    }

    Database.ref('userdata/'+Auth.currentUser.uid+'/campaigns/'+this.state.campaign.slug).child('players').push(player)
  }

  playerContent = () => {
    const errorLabel = <Label color="red" pointing/>
    let players = this.state.campaign.players

    return (
      <Form onValidSubmit={this.addPlayer.bind(this)}>
        <Table color={this.props.color} selectable stackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Level</Table.HeaderCell>
              <Table.HeaderCell>Hit Points</Table.HeaderCell>
              <Table.HeaderCell>Armor Class</Table.HeaderCell>
              <Table.HeaderCell colSpan={2} />
            </Table.Row>
          </Table.Header>

          <Table.Body>
            { players ?
                Object.keys(players).map(key => (
                  <Table.Row key={key}>
                    <Table.Cell>{players[key].name}</Table.Cell>
                    <Table.Cell>{players[key].level}</Table.Cell>
                    <Table.Cell>{players[key].hit_points}</Table.Cell>
                    <Table.Cell>{players[key].armor_class}</Table.Cell>
                    <Table.Cell>
                      <Button.Group size='mini'>
                        <Popup content={'Add ' + players[key].name + ' to the turnorder.'} trigger={<Button color='blue' icon='plus' onClick={() => this.state.campaignRef.child('turnorder').push(players[key]) } />} />
                        <Popup content={'Remove ' + players[key].name + ' from your campaign.'} trigger={<Button color='red' icon='remove' onClick={() => { this.state.campaignRef.child('players/'+key).remove() }} />} />
                      </Button.Group>
                    </Table.Cell>
                  </Table.Row>
                ))
              : (
                <Table.Row>
                  <Table.Cell colSpan={5}>No players added.</Table.Cell>
                </Table.Row>
              )
            }
          </Table.Body>
          
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell>
                <Form.Input 
                  name='name' 
                  placeholder='Name *' 
                  type='text' 
                  transparent 
                  value={this.state.newPlayerName} 
                  onChange={(e) => this.setState({ newPlayerName: e.target.value }) } 
                  validations="minLength:2,isWords,isRequired"
                  validationErrors={{
                      minLength: 'Minimal length is 2 letters',
                      isWords: 'No numbers or special characters allowed',
                      isRequired: 'Name is Required',
                  }} 
                  errorLabel={ errorLabel }
                />
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Form.Input 
                  name='level' 
                  placeholder='Level' 
                  type='number' 
                  transparent 
                  value={this.state.newPlayerLevel} 
                  onChange={(e) => this.setState({ newPlayerLevel: e.target.value }) } 
                  validations='isInt'
                  validationErrors={{
                      isInt: 'Must be a number',
                  }} 
                  errorLabel={ errorLabel }
                />
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Form.Input 
                  name='hit_points' 
                  placeholder='Hit Points' 
                  type='number' 
                  transparent 
                  value={this.state.newPlayerHP} 
                  onChange={(e) => this.setState({ newPlayerHP: e.target.value }) } 
                  validations='isInt'
                  validationErrors={{
                      isInt: 'Must be a number',
                  }} 
                  errorLabel={ errorLabel }
                />
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Form.Input 
                  name='armor_class' 
                  placeholder='Armor Class' 
                  type='number' 
                  transparent 
                  value={this.state.newPlayerAC} 
                  onChange={(e) => this.setState({ newPlayerAC: e.target.value }) } 
                  validations='isInt'
                  validationErrors={{
                      isInt: 'Must be a number',
                  }} 
                  errorLabel={ errorLabel }
                />
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Button icon='plus' content='Add' type='submit' />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </Form>
    )
  }

  addTime = (time) => {
    time = toSeconds(time)
    var campaign = this.state.campaign
    campaign.times.total += time
    campaign.times.session += time
    this.state.campaignRef.set(campaign)
  }

  componentDidMount() {
    const slug = this.props.match.params.campaignSlug
    Auth.onAuthStateChanged((user) => {
      if (user){
        this.setState({ user })
        var campaignRef = Database.ref('userdata/'+user.uid+'/campaigns/'+slug);
        var turnorderRef = campaignRef.child('turnorder');
        campaignRef.on('value', snapshot => {
          var campaign = snapshot.val()
          var turnorder = []

          /*if(campaign.turnorder){
            var turnorder = []
            var done = true
            console.log(campaign.turnorder)
            Object.keys(campaign.turnorder).map(key => {
              console.log(campaign.turnorder[key])
              var t = campaign.turnorder[key]
              t.id = key
              turnorder.push(t)

              if(!t.done){ done = false }
              return t;
            })

            if(done){
              for (var i = 0; i < turnorder.length; i++) {
                turnorder[i].done = false
              }
              const roundDuration = parseInt(campaign.settings.roundDuration, 10)
              campaign.round = (campaign.round) ? campaign.round + 1 : 1
              campaign.times.encounter += 
              campaign.times.session += roundDuration
              campaign.times.total += roundDuration
              campaign.turnorder = turnorder
              campaignRef.set(campaign)
            }
          }*/
          // Update React state when campaign is added to the firebase database
          this.setState({ campaign, campaignRef, turnorder, turnorderRef, loaded: true })
        });
      }
    })
  }
}
