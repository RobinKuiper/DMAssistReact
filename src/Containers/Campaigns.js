import React, { Component } from 'react'

import { Auth } from './../Lib/firebase'

import { Grid } from 'semantic-ui-react'

import Panel from './Panel'

import Add from './Campaigns/AddCampaign'
import Overview from './Campaigns/Overview'

export default class Campaigns extends Component {
  constructor(props){
    super(props)

    this.state = {
      loaded: true,
      add: false
    }
  }

  render() {
    return (
      <main>
        <Grid columns={2}>
          <Grid.Column width={10}>
            <Panel title={'Campaigns'} content={Overview} footer={false} loaded={this.state.loaded} />
          </Grid.Column>
          <Grid.Column width={6}>
            <Panel title='Add New Campaign' content={Add} footer={false} loaded={this.state.loaded} />
          </Grid.Column>
        </Grid>
      </main>
    )
  }
}
