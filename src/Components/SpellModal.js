import React, { Component } from 'react'
import { Dimmer, Loader, Modal } from 'semantic-ui-react'
import { Database } from './../Lib/firebase'

import SpellLayout from './SpellLayout'

export default class SpellModal extends Component {
  state = { spell: null }

  componentDidMount(){
    const ref = this.props.spell.custom ? 'custom_spells' : 'spell_data'
    Database.ref(ref).child(this.props.spell.key).on('value', snapshot => {
      this.setState({ spell: snapshot.val() })
    })
  }

  render() {
    return (
      <Modal 
        closeIcon 
        trigger={this.props.trigger}>
        <Modal.Content>
          <Dimmer active={!this.state.spell}>
            <Loader size='massive'></Loader>
          </Dimmer>

          { this.state.spell &&
            <SpellLayout spell={this.state.spell} backButton={false} />
          }
        </Modal.Content>
      </Modal>
    )
  }
}
