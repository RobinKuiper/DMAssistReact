import React, { Component } from 'react';
import firebase, { Auth } from './Lib/firebase'

import { Dimmer, Loader, Segment, Sidebar } from 'semantic-ui-react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { PropsRoute, PrivateRoute } from './Lib/Router'

import MainSidebar from './Components/Sidebar'

import Dashboard from './Containers/Dashboard'
import Monsters from './Containers/Monsters'
import Spells from './Containers/Spells'
import Campaigns from './Containers/Campaigns'
import Campaign from './Containers/Campaign'
import TreasureGenerator from './Containers/TreasureGenerator'
import About from './Containers/About'

import './App.css';

const __LIMIT__ = process.env.NODE_ENV === "development" ? 1 : 1000

// TODO: Maybe get all the items (monsters, spells, etc) from the database here, and pass them through
class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      user: null,
      campaigns: [],
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
    this.loadMonsters()
  }

  loadMonsters = () => {
    let db = firebase.database()
    let mRef = db.ref('monsters').limitToLast(__LIMIT__);

    mRef.on('child_added', snapshot => {
      snapshot.val().id = snapshot.key
      this.setState({ monsters: [snapshot.val()].concat(this.state.monsters) })

      if(!this.state.loaded){
        var t;
        clearTimeout(t)
        t = setTimeout(() => {
          this.setState({ loaded: this.setLoaded() })
          this.loadSpells()
        }, 1000)
      }
    })
  }

  loadSpells = () => {
    let db = firebase.database()
    let sRef = db.ref('spells').limitToLast(__LIMIT__);

    sRef.on('child_added', snapshot => {
      snapshot.val().id = snapshot.key
      this.setState({ spells: [snapshot.val()].concat(this.state.spells)  })

      if(!this.state.loaded){
        var t
        clearTimeout(t)
        t = setTimeout(() => this.setState({ loaded: this.setLoaded() }), 1000)
      }
    })
  }

  render() {
      return (this.state.loaded) ? (
        <div id='outer-container'>
          <Router>
            <div>
              <MainSidebar />

              <Sidebar.Pusher>

                <PropsRoute exact path='/' component={Dashboard} campaigns={this.state.campaigns} monsters={this.state.monsters} spells={this.state.spells} />
                <Route path='/about' component={About} />
                <PropsRoute path='/monsters' component={Monsters} monsters={this.state.monsters} />
                <PropsRoute path='/spells' component={Spells} spells={this.state.spells} />
                <PropsRoute path='/campaigns' component={Campaigns} redirectTo="/" campaigns={this.state.campaigns} />
                <PrivateRoute path='/campaign/:campaignSlug' redirectTo="/" component={Campaign} monsters={this.state.monsters} />
                <Route path='/treasure-generator' component={TreasureGenerator} />

              </Sidebar.Pusher>
            </div>
          </Router>
        </div>
      ) : (
        <Segment style={{height: '100%'}}>
          <Dimmer active>
            <Loader size='massive'>{this.state.loadSteps[this.state.loadStep]}</Loader>
          </Dimmer>
        </Segment>
      );
  }

  componentDidMount() {
    Auth.onAuthStateChanged((user) => {
      if (user){
        this.setState({ user })

        let uDataRef = firebase.database().ref('userdata').child(this.state.user.uid);
        let cRef = uDataRef.child('campaigns');
        cRef.on('child_added', snapshot => {
          snapshot.val().id = snapshot.key
          this.setState({ campaigns: [snapshot.val()].concat(this.state.campaigns) })
        })
      }else{
        this.setState({ campaigns: [] })
      }
    })
  }
}

export default App;
