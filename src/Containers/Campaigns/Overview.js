import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import firebase, { Auth } from './../../Lib/firebase'
import { Image, List } from 'semantic-ui-react'

export default class Overview extends Component {
  constructor(props){
    super(props)

    this.state = {
      user: Auth.currentUser,
      campaigns: []
    }
  }

  componentWillMount(){
    // Create reference to campaigns in firebase database
    let campaignRef = firebase.database().ref('userdata/'+this.state.user.uid).child('campaigns').orderByKey().limitToLast(100);
    campaignRef.on('child_added', snapshot => {
      let campaign = snapshot.val()
      campaign.id = snapshot.key
      // Update React state when campaign is added to the firebase database
      this.setState({ campaigns: [campaign].concat(this.state.campaigns) })
    })
  }

  render() {
    return (
      <List animated relaxed='very' size='large' divided>
        {
          // Render campaigns
          this.state.campaigns.map( campaign => (
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

  componentDidMount() {
    Auth.onAuthStateChanged((user) => {
      if (user){
        this.setState({ user })
      }
    })
  }
}
