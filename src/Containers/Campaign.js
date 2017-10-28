import React, { Component } from 'react'
import { Database, Auth } from './../Lib/firebase'
import { formatTime, toSeconds } from './../Lib/Common'
import { Button, Grid, Input, Popup, Segment } from 'semantic-ui-react'
import Panel from './Panel'
import TableFull from './../Components/Table'
import Turnorder from './../Components/Turnorder'
//import FixedMenu from "./../Components/FixedMenu";

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
              <Grid columns={2}>
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

                <Grid.Column width={10}>
                  Public Link
                </Grid.Column>
              </Grid>
            </Segment>

            <Panel title='Players' content={this.playerContent} loaded={this.state.loaded} />
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
    const tableConfig = {
      headerCells: [
        { content: 'Name', sortName: 'name' },
        { content: 'Level', sortName: 'level' },
        { content: 'HP', sortName: 'hit_points' },
        { content: 'AC', sortName: 'armor_class' },
        { content: '', colSpan: 2 },
      ],
      bodyRows: [],
      footerCells: [
        { content: (<Input placeholder='Name' type='text' transparent value={this.state.newPlayerName} onChange={(e) => this.setState({ newPlayerName: e.target.value }) } />) },
        { content: (<Input placeholder='Level' type='number' transparent value={this.state.newPlayerLevel} onChange={(e) => this.setState({ newPlayerLevel: e.target.value }) } />) },
        { content: (<Input placeholder='Hit Points' type='number' transparent value={this.state.newPlayerHP} onChange={(e) => this.setState({ newPlayerHP: e.target.value }) } />) },
        { content: (<Input placeholder='Armor Class' type='number' transparent value={this.state.newPlayerAC} onChange={(e) => this.setState({ newPlayerAC: e.target.value }) } />) },
        { content: (<Button icon='plus' content='Add' onClick={this.addPlayer.bind(this)} />) }
      ]
    }

    var players = this.state.campaign.players
    if(players){
      tableConfig.bodyRows = Object.keys(players).map(key => {
        return {
          key,
          cells: [
            { content: players[key].name },
            { content: players[key].level },
            { content: players[key].hit_points },
            { content: players[key].armor_class },
            { content: (
              <Button.Group size='mini'>
                <Popup content={'Add ' + players[key].name + ' to the turnorder.'} trigger={<Button color='blue' icon='plus' onClick={() => this.state.campaignRef.child('turnorder').push(players[key]) } />} />
                <Popup content={'Remove ' + players[key].name + ' from your campaign.'} trigger={<Button color='red' icon='remove' onClick={() => { this.state.campaignRef.child('players/'+key).remove() }} />} />
              </Button.Group>
            )}
          ]
        }
      });
    }

    return (
      <TableFull color='black' headerCells={tableConfig.headerCells} bodyRows={tableConfig.bodyRows} footerCells={tableConfig.footerCells} />
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

          if(campaign.turnorder){
            var turnorder = []
            var done = true
            Object.keys(campaign.turnorder).map(key => {
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
              campaign.round = (campaign.round) ? campaign.round + 1 : 1
              campaign.times.encounter += parseInt(campaign.settings.roundDuration, 10)
              campaign.times.session += parseInt(campaign.settings.roundDuration, 10)
              campaign.times.total += parseInt(campaign.settings.roundDuration, 10)
              campaign.turnorder = turnorder
              campaignRef.set(campaign)
            }
          }
          // Update React state when campaign is added to the firebase database
          this.setState({ campaign, campaignRef, turnorder, turnorderRef, loaded: true })
        });
      }
    })
  }
}
