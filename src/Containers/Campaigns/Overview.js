import React from 'react'
import { Link } from 'react-router-dom'
import { Image, List } from 'semantic-ui-react'

const Overview = ({ campaigns }) => (
  <List animated relaxed='very' size='large' divided>
    { campaigns.length !== 0 ?
        // Render campaigns
        campaigns.map( campaign => (
          <List.Item as={Link} to={'/campaign/'+campaign.slug} key={campaign.slug}>
            <Image size='mini' src={campaign.image ? campaign.image : './images/no-campaign-image.png'} />
            <List.Content verticalAlign='middle'>
              <List.Header>
                {campaign.name}
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
