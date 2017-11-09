import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Image, List } from 'semantic-ui-react'
import { Auth, Database } from './../../Lib/firebase'
import LoginModal from './../Auth/LoginModal'

// IMAGES
import NoCampaignImage from './../../Images/no-campaign-image.png'

export default class Overview extends Component {
  render() {
    if(Auth.currentUser){
      return (
        <List relaxed='very' size='large' divided>
          { this.state && this.state.campaigns ?
              // Render campaigns
              Object.keys(this.state.campaigns).map(key => (
                <List.Item as={Link} to={'/campaign/' + key} key={key}>
                  <Image style={{marginRight: 15}} size='mini' src={this.state.campaigns[key].pictureURL || NoCampaignImage} />
                  <List.Content verticalAlign='middle'>
                    <List.Header>
                      {this.state.campaigns[key].name}
                    </List.Header>
                  </List.Content>
                </List.Item>
              ))
            :
              <List.Item>You don't have any campaigns yet.</List.Item>
          }
        </List>
      )
    } else {
      return (<p>Please <LoginModal trigger={<span style={{textDecoration: 'underline', cursor: 'pointer'}}>Sign In</span>} /> to see your campaigns.</p>)
    }
  }

  componentDidMount() {
    Auth.onAuthStateChanged((user) => {
      if (user){
        Database.ref('userdata').child(user.uid).child('campaigns').on('value', snapshot => {
          this.setState({ campaigns: snapshot.val() })
        })
      }
    })
  }
}