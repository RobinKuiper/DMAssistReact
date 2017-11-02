import React, { Component } from 'react';
import firebase, { Auth } from './Lib/firebase'

import { Dimmer, Loader, Message, Sidebar } from 'semantic-ui-react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { PropsRoute, PrivateRoute } from './Lib/Router'

import MainSidebar from './Components/UI/Sidebar'
import Skype from './Components/Skype'
import FixedMenu from './Components/UI/FixedMenu'

import Dashboard from './Containers/Dashboard'
import Monsters from './Containers/Monsters'
import Spells from './Containers/Spells'
import Campaigns from './Containers/Campaigns'
import Campaign from './Containers/Campaign'
import TreasureGenerator from './Containers/TreasureGenerator'
import About from './Containers/About'
import { Default, Mobile } from './Lib/Responsive'
import AuthFunctionality from './Components/Auth/AuthFunctionality'
import Profile from './Containers/Profile'

const __LIMIT__ = process.env.NODE_ENV === "development" ? 2 : 1000
const __LOAD_TIMEOUT__ = process.env.NODE_ENV === "development" ? 700 : 300
const __LOAD_SHIT__ = process.env.NODE_ENV === "development" ? false : true

class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      user: null,
      campaigns: [],
      encounters: [],
      monsters: [],
      spells: [],
      loaded: false,
      loadStep: 0,
      loadSteps: ['Loading Monsters...', 'Loading Spells...']
    }
  }

  setLoaded = (index) => {
    var loadStep = this.state.loadStep + 1
    this.setState({ loadStep })
    return (this.state.loadStep >= this.state.loadSteps.length)
  }

  componentWillMount(){
    if(__LOAD_SHIT__) this.loadMonsters()
    else this.setState({ loaded: true })
  }

  loadMonsters = () => {
    let db = firebase.database()
    let mRef = db.ref('monsters').limitToLast(__LIMIT__);

    var t;
    mRef.on('child_added', snapshot => {
      snapshot.val().id = snapshot.key
      this.setState({ monsters: [snapshot.val()].concat(this.state.monsters) })

      if(!this.state.loaded){
        clearTimeout(t)
        t = setTimeout(() => {
          this.setState({ loaded: this.setLoaded() })
          this.loadSpells()
        }, __LOAD_TIMEOUT__)
      }
    })
  }

  loadSpells = () => {
    let db = firebase.database()
    let sRef = db.ref('spells').limitToLast(__LIMIT__);

    var t
    sRef.on('child_added', snapshot => {
      snapshot.val().id = snapshot.key
      this.setState({ spells: [snapshot.val()].concat(this.state.spells)  })

      if(!this.state.loaded){
        clearTimeout(t)
        t = setTimeout(() => this.setState({ loaded: this.setLoaded() }), __LOAD_TIMEOUT__)
      }
    })
  }

  render() {
    return (
      <div id='outer-container'>
        <Dimmer active={!this.state.loaded}>
          <Loader size='massive'>{this.state.loadSteps[this.state.loadStep]}</Loader>
        </Dimmer>

        <Default><Skype /></Default>
        <Router>
          <div>
            <Default>
              <MainSidebar mobile={false} visible={true} />
            </Default>
            <Mobile>
              <FixedMenu showSidebar={() => this.setState({ sidebarVisible: true })} />
              <MainSidebar mobile={true} visible={this.state.sidebarVisible} hideSidebar={() => this.setState({ sidebarVisible: false })} />
            </Mobile>
            
            <Sidebar.Pusher onClick={() => this.setState({ sidebarVisible: false })}>

              { this.state.user && !this.state.user.emailVerified && !this.state.verification_mail_send && <Message error content={<p>Your email address is not verified. Click the link in the verification mail, or <span style={{textDecoration: 'underline', cursor: 'pointer'}} onClick={() => this.sendVerification()}>send another mail</span>.</p>} /> }
              
              <PropsRoute exact path='/' component={Dashboard} campaigns={this.state.campaigns} monsters={this.state.monsters} spells={this.state.spells} />
              <Route path='/about' component={About} />
              <PropsRoute path='/monsters' component={Monsters} monsters={this.state.monsters} encounters={this.state.encounters} />
              <PropsRoute path='/spells' component={Spells} spells={this.state.spells} />
              <PropsRoute path='/campaigns' component={Campaigns} redirectTo="/" campaigns={this.state.campaigns} />
              <PrivateRoute path='/campaign/:campaignSlug' redirectTo="/" component={Campaign} monsters={this.state.monsters} encounters={this.state.encounters} />
              <Route path='/treasure-generator' component={TreasureGenerator} />
              <Route path='/profile' component={Profile} />

              <Route path='/auth' component={AuthFunctionality} />              

            </Sidebar.Pusher>
          </div>
        </Router>
      </div>
    )
  }

  sendVerification = () => {
    this.setState({ verification_mail_send: true })
    Auth.currentUser.sendEmailVerification()
  }

  keepTrackOfDatabase = (ref, stateName) => {
    ref.on('child_added', snapshot => {
      var item = snapshot.val()
      item.id = snapshot.key
      this.setState({ [stateName]: [item].concat(this.state[stateName]) })
    })

    ref.on('child_changed', snapshot => {
      let items = this.state[stateName],
      changed_item = snapshot.val()

      changed_item.id = snapshot.key

      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if(item.id === changed_item.id){
          items[i] = changed_item
          this.setState({ [stateName]: items })
          break;
        }
      }
    })

    ref.on('child_removed', snapshot => {
      let items = this.state[stateName],
      removed_item_id = snapshot.key

      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if(item.id === removed_item_id){
          items.splice(i, 1)
          this.setState({ [stateName]: items })
          break;
        }
      }
    })
  }

  componentDidMount() {
    Auth.onAuthStateChanged((user) => {
      if (user){
        this.setState({ user })

        // Get the userdata reference
        let uDataRef = firebase.database().ref('userdata').child(this.state.user.uid);

        // Get the campaigns reference in userdata
        let cRef = uDataRef.child('campaigns');
        this.keepTrackOfDatabase(cRef, 'campaigns')
        let eRef = uDataRef.child('encounters')
        this.keepTrackOfDatabase(eRef, 'encounters')

      }else{
        this.setState({ campaigns: [] })
      }
    })
  }
}

export default App;
