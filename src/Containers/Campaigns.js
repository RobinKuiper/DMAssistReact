import React from 'react'

import Panel from './../Components/UI/Panel'

import AddCampaign from './../Components/Campaigns/AddCampaign'
import Overview from './../Components/Campaigns/Overview'

import Affiliate from './../Components/Affiliate'

const Campaigns = ({alert}) => (
  <main>
      <Panel title={'Campaigns'} content={() => ( <Overview /> )} footer={false} alert={alert} />

      <AddCampaign alert={alert} />

      <Affiliate 
        title='Buy Star Wars KOTOR Comics and Graphic Novels at TFAW.com' 
        alt='Buy Star Wars KOTOR Comics and Graphic Novels at TFAW.com' 
        url='http://shareasale.com/r.cfm?b=213589&amp;u=1651477&amp;m=8908&amp;urllink=&amp;afftrack=' 
        image='https://i.shareasale.com/image/8908/728_KOTOR.gif' 
      />
  </main>
)

export default Campaigns
