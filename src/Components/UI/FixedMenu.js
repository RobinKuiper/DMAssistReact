import React from 'react'
import { Icon, Menu } from 'semantic-ui-react'

const FixedMenu = ({ showSidebar }) => (
  <Menu inverted style={{borderRadius: 0}}>
    <Menu.Item onClick={showSidebar}><Icon name='sidebar' /></Menu.Item>
    <Menu.Item header>DM <span style={{color: 'purple'}}>Assist</span></Menu.Item>
  </Menu>
)

export default FixedMenu
