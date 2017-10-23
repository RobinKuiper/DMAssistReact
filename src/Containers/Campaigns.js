import React, { Component } from 'react'

import { Auth } from './../Lib/firebase'

import { Button, Grid, Segment } from 'semantic-ui-react'

import Panel from './Panel'

import Add from './Campaigns/AddCampaign'
import Overview from './Campaigns/Overview'

export default class Campaigns extends Component {
  constructor(props){
    super(props)

    this.state = {
      user: Auth.currentUser,
      loaded: true,
      add: false
    }
  }

  render() {
    return (
      <main>
        <Grid columns={1}>
          <Grid.Column>
            <Panel title={'Campaigns'} content={this.renderContent.bind(this)} footer={false} loaded={this.state.loaded} />
          </Grid.Column>
        </Grid>
      </main>
    )
  }

  renderContent = () => {
    return (this.state.user) ? (this.state.add) ? <Add /> : <Overview /> : <div>Login</div>
  }

  componentDidMount() {
    Auth.onAuthStateChanged((user) => {
      if (user){
        this.setState({ user })
      }
    })
  }
}
