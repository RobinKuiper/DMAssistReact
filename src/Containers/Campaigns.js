import React from 'react'

import Panel from './../Components/UI/Panel'

import AddCampaign from './../Components/Campaigns/AddCampaign'
import Overview from './../Components/Campaigns/Overview'

const Campaigns = ({campaigns, alert}) => (
  <main>
      <Panel title={'Campaigns'} content={() => ( <Overview campaigns={campaigns} /> )} footer={false} alert={alert} />

      <AddCampaign alert={alert} />
  </main>
)

export default Campaigns
