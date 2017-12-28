import React from 'react'
import { Icon, Menu } from 'semantic-ui-react'

const FixedMenu = ({ showSidebar }) => (
  <div>
  <Menu inverted style={{borderRadius: 0}} fixed='top'>
    <Menu.Item onClick={showSidebar}><Icon name='sidebar' /></Menu.Item>
    <Menu.Item header>DM <span style={{color: 'purple'}}>Assist</span></Menu.Item>
  </Menu>

  <div style={{marginBottom: 60}}></div>
  </div>
)

export default FixedMenu
