import React, { Component } from 'react'
import { Modal } from 'semantic-ui-react'

import MonsterLayout from './MonsterLayout'

export default class MonsterModal extends Component {
  constructor(props){
    super(props)

    this.state = { open: true }
  }

  render() {
    const monster = this.props.monster

    return (
      <Modal 
        /*open={this.state.open} 
        onOpen={() => this.setState({ open: true }) } 
        onClose={() => this.setState({ open: false }) }*/
        closeIcon 
        trigger={this.props.trigger}>
        <Modal.Content>
          { monster &&
            <MonsterLayout monster={monster} backButton={false} />
          }
        </Modal.Content>
      </Modal>
    )
  }
}
