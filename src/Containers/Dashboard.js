import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button, Grid, List, Statistic } from 'semantic-ui-react'
import { Auth } from './../Lib/firebase'
import AdSense from 'react-adsense'
import Panel from './Panel'

import MonsterModal from './../Components/MonsterModal'
import SpellModal from './../Components/SpellModal'

import LoginModal from './../Components/LoginModal'

export default class Dashboard extends Component {
  render() {
    return (
      <main>
        <Button content='Send Mail' onClick={() =>{
          Auth.currentUser.sendEmailVerification()
          .then(data => {
            console.log(data)
            console.log('Mail Send')
          })
          .catch(error => {
            console.log(error)
            console.log('Mail Not Send')
          })
        }} />
        <Grid columns={3}>
          <Grid.Row>
            <Grid.Column>
              <Panel title={'Campaigns'} content={this.renderCampaigns.bind(this)} footer={false} loaded={true} />
            </Grid.Column>

            <Grid.Column>
              <Panel title={'Latest Monsters'} content={this.renderMonsters.bind(this)} footer={false} loaded={true} />
            </Grid.Column>

            <Grid.Column>
              <Panel title={'Latest Spells'} content={this.renderSpells.bind(this)} footer={false} loaded={true} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={10}>
              <Panel title={'Statistics'} content={this.renderStatistics.bind(this)} footer={false} loaded={true} />
            </Grid.Column>
          </Grid.Row>
        </Grid>

        { process.env.NODE_ENV !== "development" &&
          <AdSense.Google client='ca-pub-2044382203546332' slot='7541388493' style={{marginTop: 40, width: 728, height: 90}} />
        }
      </main>
    )
  }

  renderCampaigns = () => {
    if(Auth.currentUser){
      return (
        <List>
        { this.props.campaigns.length !== 0 ?
            this.props.campaigns.slice(this.props.campaigns.length-5, this.props.campaigns.length).map(item => {
              return <List.Item as={Link} to={'/campaign/'+item.slug} key={item.slug}>{item.name}</List.Item>
            })
          :
            <List.Item>You don't have any campaigns yet.</List.Item>
        }
        </List>
      )
    }else{
      return (
        <p>Please <LoginModal trigger={<span style={{textDecoration: 'underline', cursor: 'pointer'}}>Sign In</span>} /> to see your campaigns</p>
      )
    }
  }

  renderMonsters = () => (
    <List>
    { this.props.monsters.slice(this.props.monsters.length-5, this.props.monsters.length).map(item => {
      return <MonsterModal key={item.slug} monster={item} trigger={<List.Item as='a'>{item.name}</List.Item>} />
    })}
    </List>
  )

  renderSpells = () => (
    <List>
    { this.props.spells.slice(this.props.spells.length-5, this.props.spells.length).map(item => {
      return <SpellModal key={item.slug} spell={item} trigger={<List.Item as='a'>{item.name}</List.Item>} />
    })}
    </List>
  )

  renderStatistics = () => (
    <div>
      <Statistic.Group>
        <Statistic as={Link} to='/monsters'>
          <Statistic.Value>{this.props.monsters.length}</Statistic.Value>
          <Statistic.Label>Monsters</Statistic.Label>
        </Statistic>

        <Statistic as={Link} to='/spells'>
          <Statistic.Value>{this.props.spells.length}</Statistic.Value>
          <Statistic.Label>Spells</Statistic.Label>
        </Statistic>

        <Statistic as={Link} to='/monsters'>
          <Statistic.Value>0</Statistic.Value>
          <Statistic.Label>My Monsters</Statistic.Label>
        </Statistic>

        <Statistic as={Link} to='/spells'>
          <Statistic.Value>0</Statistic.Value>
          <Statistic.Label>My Spells</Statistic.Label>
        </Statistic>

        <Statistic as={Link} to='/campaigns'>
          <Statistic.Value>{this.props.campaigns.length}</Statistic.Value>
          <Statistic.Label>My Campaigns</Statistic.Label>
        </Statistic>
      </Statistic.Group>
    </div>
  )
}
