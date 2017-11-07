import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Database, Auth } from './../Lib/firebase'
import { formatTime, toSeconds } from './../Lib/Common'
import { Button, Grid, Popup, Segment } from 'semantic-ui-react'
import Turnorder from './../Components/Campaigns/Turnorder'
import Adsense from './../Components/Adsense'
//import FixedMenu from "./../Components/FixedMenu";
import CampaignSettingsModal from './../Components/Campaigns/CampaignSettingsModal'
import Players from './../Components/Campaigns/Players'

export default class Campaign extends Component {
  constructor(props) {
    super(props)

    this.state = {
      campaign: null,
      turnorder: null,
      dropdownLoaded: false,
      campaignRef: null,
      turnorderRef: null,
    }

    this.addTime = this.addTime.bind(this)
  }

  render() {
    const campaign = this.state.campaign

    if(campaign){
      return (
        <div>
          { this.state.removed && <Redirect to='/campaigns' />}
          {/*<FixedMenu title={this.state.campaign.name} />*/}
          <main>
            <Turnorder campaign={campaign} monsters={this.props.monsters} encounters={this.props.encounters} campaignRef={this.state.campaignRef} />

            <Players players={campaign.players} handleSubmit={this.addPlayer.bind(this)} handleRemove={this.removePlayer.bind(this)} handleAdd={this.addPlayerToTurnorder.bind(this)} />
            
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
                  <CampaignSettingsModal alert={alert} campaign={campaign} trigger={<Button icon='settings' content='Settings' color='blue' />} />
                </Grid.Column>
              </Grid>
            </Segment>

            { process.env.NODE_ENV !== "development" &&
              <Adsense client='ca-pub-2044382203546332' slot='7541388493' style={{marginTop: 40, width: 728, height: 90}} />
            }
          </main>
        </div>
      )
    }

    return <div>Loading...</div>
  }

  addPlayer(e) {
    for(var i in e){
      e[i] = e[i] || null
    }

    const player = e

    console.log(player)
    Database.ref('/campaigns/'+this.state.campaign.key).child('players').push(player)
  }

  removePlayer(key){
    Database.ref('/campaigns/'+this.state.campaign.key).child('players').child(key).remove()
  }

  addPlayerToTurnorder(key){
    let player = this.state.campaign.players[key]
    player.player = true
    this.addToTurnorder(player)
  }

  addToTurnorder = (item, monster=false) => {
    if(item === null) this.props.campaignRef.child('turnorder').push({ done: false })
    else if(item.name){ 
      item.done = false
      item.monster = monster
      Database.ref('/campaigns/'+this.state.campaign.key).child('turnorder').push(item)
    }else if(Array.isArray(item)){
      for(var i = 0; i < item.length; i++){

        item[i] = (item[i].name) ? item[i] : { name: '' }
        item[i].done = false
        item[i].monster = monster

        Database.ref('/campaigns/'+this.state.campaign.key).child('turnorder').push(item[i])
      }
    }
  }

  addTime = (time) => {
    time = toSeconds(time)
    var campaign = this.state.campaign
    campaign.times.total += time
    campaign.times.session += time

    const types = ['buffs', 'concentrations', 'conditions']

    if(campaign.turnorder){
      for(var key in campaign.turnorder) {
        for(var i = 0; i < types.length; i++)
        if(campaign.turnorder[key][types[i]]){
          for(var bKey in campaign.turnorder[key][types[i]]){
            if(campaign.turnorder[key][types[i]][bKey].time) campaign.turnorder[key][types[i]][bKey].time -= time
            if(campaign.turnorder[key][types[i]][bKey].time <= 0) campaign.turnorder[key][types[i]][bKey] = null
          }
        }
      }
    }

    Database.ref('campaigns/'+campaign.key).set(campaign)
  }

  componentDidMount() {
    const key = this.props.match.params.key
    Auth.onAuthStateChanged((user) => {
      if (user){
        Database.ref('/campaigns/'+key).on('value', snapshot => {
          var campaign = snapshot.val()
          console.log(campaign)
          if(campaign){
            campaign.key = snapshot.key
            this.setState({ campaign })
          } else this.setState({ removed: true })
        });
      }
    })
  }
}
