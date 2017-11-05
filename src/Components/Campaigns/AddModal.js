import React, { Component } from 'react'
import { Input, Modal, Select } from 'semantic-ui-react'

export default class AddModal extends Component {
    constructor(props) {
        super(props)

        this.state = {}
    }

    render() {
        const addOptions = [
            { text: 'Buff', value: 'buff', key: 'buff' },
            { text: 'Concentration', value: 'concentration', key: 'concentration' },
            { text: 'Condition', value: 'condition', key: 'condition' },
        ]

        return (
            <Modal 
                basic
                open={this.state.open} 
                onOpen={() => this.setState({ open: true }) } 
                onClose={() => this.setState({ open: false }) }
                closeIcon 
                trigger={this.props.trigger}>
                <Modal.Content>
                    <Select options={addOptions} />
                    <Input placeholder='1h' />
                </Modal.Content>
            </Modal>
        )
    }
}