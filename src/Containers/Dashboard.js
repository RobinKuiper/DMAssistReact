import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Grid, List, Statistic } from 'semantic-ui-react'
import { Auth } from './../Lib/firebase'
import Panel from './Panel'

import MonsterModal from './../Components/MonsterModal'
import SpellModal from './../Components/SpellModal'

import LoginModal from './../Components/LoginModal'

export default class Dashboard extends Component {
  render() {
    return (
      <main>
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
      </main>
    )
  }

  renderCampaigns = () => {
    if(Auth.currentUser){
      return (
        <List>
        { this.props.campaigns.length !== 0 ?
            this.props.campaigns.slice(this.props.campaigns.length-5, this.props.campaigns.length).map(item => {
              return <List.Item key={item.slug}><Link to={'/campaign/'+item.slug}>{item.name}</Link></List.Item>
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
        <Statistic>
          <Statistic.Value><Link to='/monsters'>{this.props.monsters.length}</Link></Statistic.Value>
          <Statistic.Label><Link to='/monsters'>Monsters</Link></Statistic.Label>
        </Statistic>

        <Statistic>
          <Statistic.Value><Link to='/spells'>{this.props.spells.length}</Link></Statistic.Value>
          <Statistic.Label><Link to='/spells'>Spells</Link></Statistic.Label>
        </Statistic>

        <Statistic>
          <Statistic.Value><Link to='/monsters'>0</Link></Statistic.Value>
          <Statistic.Label><Link to='/monsters'>My Monsters</Link></Statistic.Label>
        </Statistic>

        <Statistic>
          <Statistic.Value><Link to='/spells'>0</Link></Statistic.Value>
          <Statistic.Label><Link to='/spells'>My Spells</Link></Statistic.Label>
        </Statistic>

        <Statistic>
          <Statistic.Value><Link to='/campaigns'>{this.props.campaigns.length}</Link></Statistic.Value>
          <Statistic.Label><Link to='/campaigns'>My Campaigns</Link></Statistic.Label>
        </Statistic>
      </Statistic.Group>
    </div>
  )
}
