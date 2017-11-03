import React from 'react'
import { Link } from 'react-router-dom'
import { Image, List } from 'semantic-ui-react'
import { Auth } from './../../Lib/firebase'
import LoginModal from './../Auth/LoginModal'

// IMAGES
import NoCampaignImage from './../../Images/no-campaign-image.png'

const Overview = ({ campaigns }) => {
  if(Auth.currentUser) { 
    return (
      <div>
        
        <List relaxed='very' size='large' divided>
          { campaigns.length !== 0 ?
              // Render campaigns
              campaigns.map( campaign => (
                <List.Item as={Link} to={'/campaign/'+campaign.slug} key={campaign.slug}>
                  <Image style={{marginRight: 15}} size='mini' src={campaign.pictureURL ? campaign.pictureURL : NoCampaignImage} />
                  <List.Content verticalAlign='middle'>
                    <List.Header>
                      {campaign.name}
                    </List.Header>
                    <List.Description>
                      <List horizontal divided>
                      { campaign.players && 
                        Object.keys(campaign.players).map(key => (
                          <List.Item key={key}>{campaign.players[key].name}</List.Item>
                        ))
                      }
                      </List>
                    </List.Description>
                  </List.Content>
                </List.Item>
              ))
            :
              <List.Item>You don't have any campaigns yet.</List.Item>
          }
        </List>

        
      </div>
    )
  }else{
    return (<p>Please <LoginModal trigger={<span style={{textDecoration: 'underline', cursor: 'pointer'}}>Sign In</span>} /> to see your campaigns.</p>)
  }
}

export default Overview
