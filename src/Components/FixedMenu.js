import React from 'react'
import { Dropdown, Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const FixedMenu = ({ title }) => (
  <Menu inverted style={{borderRadius: 0}}>
    <Menu.Item header>Campaign: '{title}'</Menu.Item>
    <Menu.Item as={Link} to='/campaign/settings'>Settings</Menu.Item>

    <Dropdown item simple text='Dropdown'>
      <Dropdown.Menu>
        <Dropdown.Item>List Item</Dropdown.Item>
        <Dropdown.Item>List Item</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Header>Header Item</Dropdown.Header>
        <Dropdown.Item>
          <i className='dropdown icon' />
          <span className='text'>Submenu</span>
          <Dropdown.Menu>
            <Dropdown.Item>List Item</Dropdown.Item>
            <Dropdown.Item>List Item</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  </Menu>
)

export default FixedMenu
