import React, { Component } from 'react';
import { Auth, GoogleProvider } from './Lib/firebase'

import { Sidebar, Menu, Icon, Header, Image } from 'semantic-ui-react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import Dashboard from './Containers/Dashboard'
import Monsters from './Containers/Monsters'
import Monster from './Containers/Monster'
import Spells from './Containers/Spells'
import Campaigns from './Containers/Campaigns'
import TreasureGenerator from './Containers/TreasureGenerator'

import './App.css';

class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      user: null
    }

    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
  }

  componentDidMount() {
    Auth.onAuthStateChanged((user) => {
      if (user){
        this.setState({ user })
      }
    })
  }

  login() {
    Auth.signInWithPopup(GoogleProvider)
      .then((result) => {
        const user = result.user;
        this.setState({ user });
      })
  }

  logout() {
    Auth.signOut()
      .then(() => {
        this.setState({ user: null })
      });
  }

  render() {
    return (
      <div id='outer-container'>
        <Router>
          <div>
            <Sidebar as={Menu} animation='push' width='thin' visible={true} vertical inverted style={{color: '#fff'}}>
              <Menu.Header textAlign={'left'} onClick={() => alert('blaat')} style={{fontSize: '14pt', textAlign: 'left', padding: 20}}>
                DM <span style={{color: 'purple'}}>Assist</span>
                <Header.Subheader style={{fontSize: '7pt', fontWeight: 'lighter', marginLeft: 9}}>
                  Making life of evil easier.
                </Header.Subheader>
              </Menu.Header>
              { this.state.user ?
                <Menu.Item onClick={this.logout}>
                  <Image src={this.state.user.photoURL} avatar />
                  <span>{this.state.user.displayName}</span>
                </Menu.Item>
                :
                <Menu.Item onClick={this.login}>
                  <Icon name='google' />
                  Google Login
                </Menu.Item>
              }
              <Menu.Item>&nbsp;</Menu.Item>
              <Link to='/'>
                <Menu.Item name='dashboard' onClick={() => {return}}>
                  <Icon name='home' />
                  Dashboard
                </Menu.Item>
              </Link>
              <Link to='/monsters'>
                <Menu.Item name='monsters' onClick={() => {return}}>
                  <Icon name='spy' />
                  Monsters
                </Menu.Item>
              </Link>
              <Link to='/spells'>
                <Menu.Item name='spells' onClick={() => {return}}>
                  <Icon name='book' />
                  Spells
                </Menu.Item>
              </Link>
              <Link to='/campaigns'>
                <Menu.Item name='campaigns' onClick={() => {return}}>
                  <Icon name='newspaper' />
                  Campaigns
                </Menu.Item>
              </Link>
              <Link to='/treasure-generator'>
                <Menu.Item name='treasure' onClick={() => {return}}>
                  <Icon name='diamond' />
                  Treasure Gen.
                </Menu.Item>
              </Link>
            </Sidebar>

            <Sidebar.Pusher>

              <Route exact path='/' component={Dashboard} />
              <Route path='/monsters' component={Monsters} />
              <Route path='/monster/:monsterName' component={Monster} />
              <Route path='/spells' component={Spells} />
              <Route path='/campaigns' component={Campaigns} />
              <Route path='/treasure-generator' component={TreasureGenerator} />

            </Sidebar.Pusher>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
