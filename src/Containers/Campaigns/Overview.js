import React, { Component } from 'react'

import firebase, { Auth } from './../../Lib/firebase'

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
    let campaignRef = firebase.database().ref(this.state.user.uid).child('campaigns').orderByKey().limitToLast(100);
    campaignRef.on('child_added', snapshot => {
      let campaign = snapshot.val()
      campaign.id = snapshot.key
      // Update React state when campaign is added to the firebase database
      this.setState({ campaigns: [campaign].concat(this.state.campaigns) })
    })
  }

  render() {
    return (
      <ul>
        {
          // Render campaigns
          this.state.campaigns.map( campaign => <li key={campaign.id}>{campaign.campaignName}</li>)
        }
      </ul>
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
