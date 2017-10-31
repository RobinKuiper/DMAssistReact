import React, { Component } from 'react'
import { Button, Dropdown, Icon, Image, Menu, Popup, Sidebar } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { Auth } from './../../Lib/firebase'
import AdSense from 'react-adsense'

import LoginModal from './../Auth/LoginModal'

export default class MainSidebar extends Component {
  constructor(props){
    super(props)

    this.logout = this.logout.bind(this)

    this.state = { user: null }
  }

  render() {
    return (
      <Sidebar id='sidebar' animation={this.props.mobile ? 'overlay' : 'push'} width={!this.props.mobile && 'thin'} visible={this.props.visible} style={{color: '#fff', backgroundColor: '#1B1C1D'}}>
        <Menu fluid vertical inverted>
          {/*<Menu.Header onClick={() => alert('blaat')} style={{fontSize: '14pt', textAlign: 'left', padding: 20}}>
            DM <span style={{color: 'purple'}}>Assist</span>
            <Header.Subheader style={{fontSize: '7pt', fontWeight: 'lighter', marginLeft: 9}}>
              Making life of evil easier.
            </Header.Subheader>
            </Menu.Header>*/}
            <Menu.Header style={{textAlign: 'center'}}>
              { this.props.mobile && <Button floated='right' icon='sidebar' color='black' onClick={this.props.hideSidebar} />}
              <Image src={require('./../../Images/Logo.png')} />
            </Menu.Header>
          { Auth.currentUser ?
            <Dropdown item text={Auth.currentUser.displayName || Auth.currentUser.email}>
              <Dropdown.Menu>
                <Dropdown.Item disabled>Profile</Dropdown.Item>
                <Dropdown.Item onClick={this.logout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            :
            <LoginModal trigger={<Menu.Item name='Sign In'><Icon name='user' />Sign In</Menu.Item>} />
          }
          <Menu.Item>&nbsp;</Menu.Item>
          {/* TODO: Check if Link can be inline */}
          <Menu.Item as={Link} onClick={this.props.hideSidebar} to='/' name='dashboard'>
            <Icon name='home' />
            Dashboard
          </Menu.Item>
          <Menu.Item as={Link} onClick={this.props.hideSidebar} to='/monsters' name='monsters'>
            <Icon name='spy' />
            Monsters
          </Menu.Item>
          <Menu.Item as={Link} onClick={this.props.hideSidebar} to='/spells' name='spells'>
            <Icon name='book' />
            Spells
          </Menu.Item>
          <Menu.Item as={Link} onClick={this.props.hideSidebar} to='/campaigns' name='campaigns'>
            <Icon name='newspaper' />
            Campaigns
          </Menu.Item>
          <Popup content='Coming Soon!' trigger={<Menu.Item as={Link} onClick={this.props.hideSidebar} to='/' name='treasure' disabled>
            <Icon name='diamond' />
            Treasure Gen.
          </Menu.Item>} />
        </Menu>

        <div id='sideBarAdsense'>
        { process.env.NODE_ENV !== "development" &&
          <AdSense.Google client='ca-pub-2044382203546332' slot='5925054492' style={{marginTop: 40, width: 728, height: 90}} />
        }
        </div>

        <Menu vertical fluid inverted style={{position: 'fixed', bottom: 0, paddingBottom: 5}}>
          <Menu.Item as='a' href='https://discord.gg/VDqHRdz' target='_blank' title='Join our Discord!'>
            Discord
            <Icon name='text telephone' />
          </Menu.Item>
          <Menu.Item as={Link} onClick={this.props.hideSidebar} to='/about'>
            About
            <Icon name='info' />
          </Menu.Item>
          <Menu.Item style={{textAlign: 'center'}}>
            {/* TODO: Check paypal link */}
            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
              <input type="hidden" name="cmd" value="_s-xclick" />
              <input type="hidden" name="hosted_button_id" value="R2U39H94QXGSY" />
              <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" alt='PayPal - The safer, easier way to pay online!' />
              <img alt="" border="0" src="https://www.paypalobjects.com/nl_NL/i/scr/pixel.gif" width="1" height="1" />
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
