import React, { Component } from 'react'
import { Modal } from 'semantic-ui-react'
import SpellLayout from './SpellLayout'

export default class SpellModal extends Component {
  render() {
    const spell = this.props.spell

    return (
      <Modal closeIcon trigger={this.props.trigger}>
        <Modal.Content>
          { spell &&
            <SpellLayout spell={spell} backButton={false} />
          }
        </Modal.Content>
      </Modal>
    )
  }
}
