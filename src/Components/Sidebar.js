import React, { Component } from 'react'
import { Dropdown, Header, Icon, Menu, Sidebar } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { Auth } from './../Lib/firebase'

import LoginDropdownMenu from './LoginDropdownMenu'

export default class MainSidebar extends Component {
  constructor(props){
    super(props)

    this.logout = this.logout.bind(this)

    this.state = { user: null }
  }

  render() {
    return (
      <Sidebar id='sidebar' animation='push' width='thin' visible={true} style={{color: '#fff', backgroundColor: '#1B1C1D'}}>
        <Menu fluid vertical inverted>
          <Menu.Header onClick={() => alert('blaat')} style={{fontSize: '14pt', textAlign: 'left', padding: 20}}>
            DM <span style={{color: 'purple'}}>Assist</span>
            <Header.Subheader style={{fontSize: '7pt', fontWeight: 'lighter', marginLeft: 9}}>
              Making life of evil easier.
            </Header.Subheader>
          </Menu.Header>
          { Auth.currentUser ?
            <Dropdown item text={Auth.currentUser.displayName}>
              <Dropdown.Menu>
                <Dropdown.Item>Profile</Dropdown.Item>
                <Dropdown.Item onClick={this.logout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            :
            <LoginDropdownMenu text='Sign In' item />
          }
          <Menu.Item>&nbsp;</Menu.Item>
          {/* TODO: Check if Link can be inline */}
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
            {/* TODO: Check paypal link */}
            <form action='https://www.paypal.com/cgi-bin/webscr' method='post' target='_blank'>
              <input type='hidden' name='cmd' value='_s-xclick' />
              <input type='hidden' name='hosted_button_id' value='KHTW2FPB83NJJ' />
              <input type='image' src='https://www.paypal.com/en_US/i/btn/btn_donate_LG.gif' border='0' name='submit' alt='PayPal - The safer, easier way to pay online!' />
              <img alt='' border='0' src='https://www.paypalobjects.com/nl_NL/i/scr/pixel.gif' width='1' height='1' />
            </form>
          </Menu.Item>
        </Menu>
      </Sidebar>
    )
  }

  /**
   * Login with one of the login providers
   * @param  {object} provider The login provider as per Firebase.js
   */
  login(provider) {
    Auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        this.setState({ user });
      })
  }

  /**
   * User Sign Out
   */
  logout() {
    Auth.signOut()
      .then(() => {
        this.setState({ user: null })
      })
  }
}
