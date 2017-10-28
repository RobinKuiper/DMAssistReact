import React, { Component } from 'react'
import { Auth } from './../Lib/firebase'
import Login from './../Components/Login'

import { Segment } from 'semantic-ui-react'

export default class Panel extends Component {
  render() {
    return (
      <Segment.Group raised>
        <Segment id="panelHeader" className='header' textAlign='center' inverted clearing>{this.props.title}</Segment>

        <Segment className='panel content' loading={!this.props.loaded}>
          { this.checkAuth ?
              (<this.props.content />)
            : (<Login />)}
        </Segment>

        { this.props.footer &&
          <Segment className='panel bottom' clearing loading={!this.props.loaded}>
            {<this.props.footer />}
          </Segment>
        }
      </Segment.Group>
    )
  }

  checkAuth = () => {
    return this.props.auth ? Auth.currentUser && true : false
  }
}
