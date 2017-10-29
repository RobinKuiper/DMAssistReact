import React from 'react'

import { Grid } from 'semantic-ui-react'

import Panel from './Panel'

import Add from './Campaigns/AddCampaign'
import Overview from './Campaigns/Overview'

const Campaigns = ({campaigns}) => (
  <main>
    <Grid columns={2} stackable>
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
