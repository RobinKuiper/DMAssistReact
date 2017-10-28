import React, { Component } from 'react'

import { Segment } from 'semantic-ui-react'

export default class Panel extends Component {
  render() {
    return (
      <Segment.Group raised>
        <Segment id="panelHeader" className='header' textAlign='center' inverted clearing>{this.props.title}</Segment>

        <Segment className='panel content' loading={!this.props.loaded}>
          <this.props.content />
        </Segment>

        { this.props.footer &&
          <Segment className='panel bottom' clearing loading={!this.props.loaded}>
            {<this.props.footer />}
          </Segment>
        }
      </Segment.Group>
    )
  }
}
