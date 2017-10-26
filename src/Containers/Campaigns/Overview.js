import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import firebase, { Auth } from './../../Lib/firebase'
import { Image, List } from 'semantic-ui-react'

export default class Overview extends Component {
  constructor(props){
    super(props)

    console.log(props)
  }

  render() {
    return (
      <List animated relaxed='very' size='large' divided>
        {
          // Render campaigns
          this.props.campaigns.map( campaign => (
            <List.Item key={campaign.slug}>
              <Image size='mini' src={campaign.image ? campaign.image : './images/no-campaign-image.png'} />
              <List.Content verticalAlign='middle'>
                <List.Header>
                  <Link to={'/campaign/'+campaign.slug}>{campaign.name}</Link>
                </List.Header>
              </List.Content>
            </List.Item>
          ))
        }
      </List>
    )
  }
}
