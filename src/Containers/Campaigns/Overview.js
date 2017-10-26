import React from 'react'
import { Link } from 'react-router-dom'
import { Image, List } from 'semantic-ui-react'

const Overview = ({ campaigns }) => (
  <List animated relaxed='very' size='large' divided>
    { campaigns.length !== 0 ?
        // Render campaigns
        campaigns.map( campaign => (
          <List.Item key={campaign.slug}>
            <Image size='mini' src={campaign.image ? campaign.image : './images/no-campaign-image.png'} />
            <List.Content verticalAlign='middle'>
              <List.Header>
                <Link to={'/campaign/'+campaign.slug}>{campaign.name}</Link>
              </List.Header>
            </List.Content>
          </List.Item>
        ))
      :
        <List.Item>You don't have any campaigns yet.</List.Item>
    }
  </List>
)

export default Overview
