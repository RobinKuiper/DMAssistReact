import React, { Component } from 'react';
import { Auth, GoogleProvider, FacebookProvider } from './Lib/firebase'

import { Button, Dropdown, Sidebar, Menu, Icon, Header, Image } from 'semantic-ui-react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import Dashboard from './Containers/Dashboard'
import Monsters from './Containers/Monsters'
import Spells from './Containers/Spells'
import Campaigns from './Containers/Campaigns'
import Campaign from './Containers/Campaign'
import TreasureGenerator from './Containers/TreasureGenerator'
import About from './Containers/About'

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

  login(provider) {
    Auth.signInWithPopup(provider)
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
            <Sidebar id='sidebar' animation='push' width='thin' visible={true} style={{color: '#fff', backgroundColor: '#1B1C1D'}}>
              <Menu fluid vertical inverted>
                <Menu.Header textAlign={'left'} onClick={() => alert('blaat')} style={{fontSize: '14pt', textAlign: 'left', padding: 20}}>
                  DM <span style={{color: 'purple'}}>Assist</span>
                  <Header.Subheader style={{fontSize: '7pt', fontWeight: 'lighter', marginLeft: 9}}>
                    Making life of evil easier.
                  </Header.Subheader>
                </Menu.Header>
                { this.state.user ?
                  <Dropdown item text={this.state.user.displayName}>
                    <Dropdown.Menu>
                      <Dropdown.Item>Profile</Dropdown.Item>
                      <Dropdown.Item onClick={this.logout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  :
                  <Dropdown item text='Sign In'>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => {this.login(GoogleProvider)}}><Button fluid color='google plus' icon='google' content='Google Login' /></Dropdown.Item>
                      <Dropdown.Item onClick={() => {this.login(FacebookProvider)}}><Button color='facebook' icon='facebook' content='Facebook Login' /></Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                }
                <Menu.Item>&nbsp;</Menu.Item>
                <Link to='/'>
                  <Menu.Item name='dashboard'>
                    <Icon name='home' />
                    Dashboard
                  </Menu.Item>
                </Link>
                <Link to='/monsters'>
                  <Menu.Item name='monsters'>
                    <Icon name='spy' />
                    Monsters
                  </Menu.Item>
                </Link>
                <Link to='/spells'>
                  <Menu.Item name='spells'>
                    <Icon name='book' />
                    Spells
                  </Menu.Item>
                </Link>
                <Link to='/campaigns'>
                  <Menu.Item name='campaigns'>
                    <Icon name='newspaper' />
                    Campaigns
                  </Menu.Item>
                </Link>
                <Link to='/treasure-generator'>
                  <Menu.Item name='treasure'>
                    <Icon name='diamond' />
                    Treasure Gen.
                  </Menu.Item>
                </Link>
              </Menu>

              <Menu vertical fluid inverted style={{position: 'fixed', bottom: 0, paddingBottom: 5}}>
                <Menu.Item as='a' href='https://discord.gg/VDqHRdz' target='_blank' title='Join our Discord!'>
                  Discord
                  <Icon name='text telephone' />
                </Menu.Item>
                <Link to='/about'>
                  <Menu.Item>
                    About
                    <Icon name='info' />
                  </Menu.Item>
                </Link>
                <Menu.Item>
                  <form action='https://www.paypal.com/cgi-bin/webscr' method='post' target='_blank'>
                    <input type='hidden' name='cmd' value='_s-xclick' />
                    <input type='hidden' name='hosted_button_id' value='KHTW2FPB83NJJ' />
                    <input type='image' src='https://www.paypal.com/en_US/i/btn/btn_donate_LG.gif' border='0' name='submit' alt='PayPal - The safer, easier way to pay online!' />
                    <img alt='' border='0' src='https://www.paypalobjects.com/nl_NL/i/scr/pixel.gif' width='1' height='1' />
                  </form>
                </Menu.Item>
              </Menu>
            </Sidebar>

            <Sidebar.Pusher>

              <Route exact path='/' component={Dashboard} />
              <Route path='/about' component={About} />
              <Route path='/monsters' component={Monsters} />
              <Route path='/spells' component={Spells} />
              <Route path='/campaigns' component={Campaigns} />
              <Route path='/campaign/:campaignSlug' component={Campaign} />
              <Route path='/treasure-generator' component={TreasureGenerator} />

            </Sidebar.Pusher>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
