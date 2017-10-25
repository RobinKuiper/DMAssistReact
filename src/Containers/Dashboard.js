import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Grid, List, Statistic } from 'semantic-ui-react'
import firebase, { Auth } from './../Lib/firebase'
import Panel from './Panel'

import MonsterModal from './../Components/MonsterModal'
import SpellModal from './../Components/SpellModal'

export default class Dashboard extends Component {
  constructor(props){
    super(props)

    this.state = {
      user: null,
      campaigns: [],
      monsters: [],
      spells: [],
      statistics: null,
      loaded: {
        campaigns: false,
        monsters: false,
        spells: false,
        general: false,
        statistics: false
      },
    }
  }

  render() {
    return (
      <main>
        <Grid columns={3}>
          <Grid.Row>
            <Grid.Column>
              <Panel title={'Campaigns'} content={this.renderCampaigns.bind(this)} footer={false} loaded={this.state.loaded.campaigns} />
            </Grid.Column>

            <Grid.Column>
              <Panel title={'Latest Monsters'} content={this.renderMonsters.bind(this)} footer={false} loaded={this.state.loaded.monsters} />
            </Grid.Column>

            <Grid.Column>
              <Panel title={'Latest Spells'} content={this.renderSpells.bind(this)} footer={false} loaded={this.state.loaded.spells} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={10}>
              <Panel title={'Statistics'} content={this.renderStatistics.bind(this)} footer={false} loaded={this.state.loaded.statistics} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </main>
    )
  }

  renderCampaigns = () => (
    <List>
    { this.state.campaigns.map(item => {
      return <List.Item key={item.slug}><Link to={'/campaign/'+item.slug}>{item.name}</Link></List.Item>
    })}
    </List>
  )

  renderMonsters = () => (
    <List>
    { this.state.monsters.map(item => {
      return <MonsterModal key={item.slug} monster={item} trigger={<List.Item as='a'>{item.name}</List.Item>} />
    })}
    </List>
  )

  renderSpells = () => (
    <List>
    { this.state.spells.map(item => {
      return <SpellModal key={item.slug} spell={item} trigger={<List.Item as='a'>{item.name}</List.Item>} />
    })}
    </List>
  )

  renderStatistics = () => (
    <div>
    { this.state.loaded.statistics &&
      <Statistic.Group>
        <Statistic>
          <Statistic.Value><Link to='/monsters'>{this.state.statistics.monsters_count}</Link></Statistic.Value>
          <Statistic.Label><Link to='/monsters'>Monsters</Link></Statistic.Label>
        </Statistic>

        <Statistic>
          <Statistic.Value><Link to='/monsters'>0</Link></Statistic.Value>
          <Statistic.Label><Link to='/monsters'>My Monsters</Link></Statistic.Label>
        </Statistic>

        <Statistic>
          <Statistic.Value><Link to='/spells'>{this.state.statistics.spells_count}</Link></Statistic.Value>
          <Statistic.Label><Link to='/spells'>Spells</Link></Statistic.Label>
        </Statistic>

        <Statistic>
          <Statistic.Value><Link to='/spells'>0</Link></Statistic.Value>
          <Statistic.Label><Link to='/spells'>My Spells</Link></Statistic.Label>
        </Statistic>
      </Statistic.Group>
    }
    </div>
  )

  setLoaded = (index) => {
    var loaded = this.state.loaded
    loaded[index] = true

    return loaded
  }

  componentDidMount() {
    Auth.onAuthStateChanged((user) => {
      if (user){
        this.setState({ user })

        firebase.database().ref('userdata/'+user.uid+'/campaigns').on('child_added', (snapshot) => {
          this.setState({ campaigns: [snapshot.val()].concat(this.state.campaigns), loaded: this.setLoaded('campaigns') })
        });

        firebase.database().ref('monsters').limitToLast(5).on('child_added', (snapshot) => {
          this.setState({ monsters: [snapshot.val()].concat(this.state.monsters), loaded: this.setLoaded('monsters') })
        });

        firebase.database().ref('spells').limitToLast(5).on('child_added', (snapshot) => {
          this.setState({ spells: [snapshot.val()].concat(this.state.spells), loaded: this.setLoaded('spells') })
        });

        firebase.database().ref('statistics').on('value', (snapshot) => {
          this.setState({ statistics: snapshot.val(), loaded: this.setLoaded('statistics') })
        });

        this.setState({ loaded: this.setLoaded('general') })
      }
    })
  }
}
