import React, { Component } from 'react';
import { __LOCAL__, Auth, Database } from './Lib/firebase'

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
import Monster from './Containers/Monster'
import Spell from './Containers/Spell'
import './Lib/Validation'
import Alert from './Components/Alert'

const __LIMIT__ = process.env.NODE_ENV === "development" ? __LOCAL__ ? 2 : 2 : 1000
const __LOAD_TIMEOUT__ = process.env.NODE_ENV === "development" ? __LOCAL__ ? 200 : 700 : 300
const __LOAD_SHIT__ = process.env.NODE_ENV === "development" ? __LOCAL__ ? false : false : true

class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      user: null,
      monsters: [],
      custom_monsters: [],
      spells: [],
      custom_spells: [],
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
    let mRef = Database.ref('monsters').limitToLast(__LIMIT__);

    var t;
    mRef.on('child_added', snapshot => {
      let monster = snapshot.val()
      monster.key = snapshot.key
      this.setState({ monsters: [monster].concat(this.state.monsters) })

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
    let sRef = Database.ref('spells').limitToLast(__LIMIT__);

    var t
    sRef.on('child_added', snapshot => {
      let spell = snapshot.val()
      spell.key = snapshot.key
      this.setState({ spells: [spell].concat(this.state.spells)  })

      if(!this.state.loaded){
        clearTimeout(t)
        t = setTimeout(() => this.setState({ loaded: this.setLoaded() }), __LOAD_TIMEOUT__)
      }
    })
  }

  Alert = (message, type, icon, time = 5000) => {
    this.alert.showAlert(message, type, icon, time)
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
            
            <Sidebar.Pusher>{/*onClick={() => this.setState({ sidebarVisible: false })}*/}
              <Alert ref={instance => { this.alert = instance }} />

              { Auth.currentUser && !Auth.currentUser.emailVerified && !this.state.verification_mail_send && <Message error content={<p>Your email address is not verified. Click the link in the verification mail, or <span style={{textDecoration: 'underline', cursor: 'pointer'}} onClick={() => this.sendVerification()}>send another mail</span>.</p>} /> }
              
              <PropsRoute exact path='/' component={Dashboard} campaigns={this.state.campaigns} custom_monsters={this.state.custom_monsters} monsters={this.state.monsters} custom_spells={this.state.custom_spells} spells={this.state.spells} alert={this.Alert} />
              <Route path='/about' component={About} alert={this.Alert} />
              <PropsRoute path='/monsters/:custom?' component={Monsters} custom_monsters={this.state.custom_monsters} monsters={this.state.monsters} encounters={this.state.encounters} alert={this.Alert} />
              <PropsRoute path='/monster/:slug/:custom?' component={Monster} />
              <PropsRoute path='/spells' component={Spells} custom_spells={this.state.custom_spells} spells={this.state.spells} alert={this.Alert} />
              <PropsRoute path='/spell/:slug/:custom?' component={Spell} />
              <PropsRoute path='/campaigns' component={Campaigns} redirectTo="/" alert={this.Alert} />
              <PrivateRoute path='/campaign/:key' redirectTo="/" component={Campaign} monsters={this.state.monsters} encounters={this.state.encounters} alert={this.Alert} />
              <Route path='/treasure-generator' component={TreasureGenerator} alert={this.Alert} />
              <Route path='/profile' component={Profile} alert={this.Alert} />

              <Route path='/auth' component={AuthFunctionality} alert={this.Alert} />              

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
}

export default App;
