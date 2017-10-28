import React from 'react'

import { Auth } from './../Lib/firebase'

import { Grid } from 'semantic-ui-react'

import Panel from './Panel'

import Add from './Campaigns/AddCampaign'
import Overview from './Campaigns/Overview'

import Login from './../Components/Login.js'

const Campaigns = ({campaigns}) => (
  <main>
    <Grid columns={2}>
      <Grid.Column width={10}>
        <Panel title={'Campaigns'} content={() => ( <Overview campaigns={campaigns} /> )} footer={false} loaded={true} />
      </Grid.Column>
      <Grid.Column width={6}>
        <Panel title='Add New Campaign' content={Add} footer={false} loaded={true} />
      </Grid.Column>
    </Grid>
  </main>
)

export default Campaigns
