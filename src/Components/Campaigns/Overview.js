import React from 'react'
import { Link } from 'react-router-dom'
import { Image, List } from 'semantic-ui-react'
import { Auth } from './../../Lib/firebase'
import LoginModal from './../Auth/LoginModal'

const Overview = ({ campaigns }) => { 
    if(Auth.currentUser) { 
      return (
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
    }else{
      return (<p>Please <LoginModal trigger={<span style={{textDecoration: 'underline', cursor: 'pointer'}}>Sign In</span>} /> to see your campaigns.</p>)
    }
  }

export default Overview
