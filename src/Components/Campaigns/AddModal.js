import React, { Component } from 'react'
import { Button, Grid, Label, Modal, Segment } from 'semantic-ui-react'
import { Form } from 'formsy-semantic-ui-react'
import { toSeconds } from './../../Lib/Common'

export default class AddModal extends Component {
    constructor(props) {
        super(props)

        this.state = { 
            name: '', 
            time: null,
            type: 'buffs'
        }
    }

    handleChange = (e, {name, value}) => this.setState({ [name]: value })

    add = () => {
        this.props.campaignRef.child('turnorder/'+this.props.item.id+'/'+this.state.type).push({ name: this.state.name, time: this.state.time ? toSeconds(this.state.time) : null })
        this.setState({ open: false })
    }

    render() {
        const errorLabel = <Label color="red" pointing/>
        const addOptions = [
            { text: 'Buff', value: 'buffs', key: 'buffs' },
            { text: 'Concentration', value: 'concentrations', key: 'concentrations' },
            { text: 'Condition', value: 'conditions', key: 'conditions' },
        ]

        return (
            <Modal 
                basic
                size='mini'
                blurred
                open={this.state.open} 
                onOpen={() => this.setState({ open: true }) } 
                onClose={() => this.setState({ open: false }) }
                closeIcon 
                trigger={this.props.trigger}>
                <Modal.Content>
                    <Segment stacked>
                        <Grid textAlign='center'>
                            <Grid.Column>
                                <Form onValidSubmit={this.add}>
                                    <Form.Select fluid options={addOptions} name='type' 
                                        value={this.state.type} 
                                        onChange={this.handleChange} 
                                        validations="minLength:2,isWords,isRequired"
                                        validationErrors={{
                                            minLength: 'Minimal length is 2 letters',
                                            isWords: 'No numbers or special characters allowed',
                                            isRequired: 'Type is Required',
                                        }} 
                                        errorLabel={ errorLabel }
                                    />
                                    <Form.Input fluid placeholder='Bless' name='name' 
                                        value={this.state.name}
                                        onChange={this.handleChange}
                                        validations="minLength:2,isWords,isRequired"
                                        validationErrors={{
                                            minLength: 'Minimal length is 2 letters',
                                            isWords: 'No numbers or special characters allowed',
                                            isRequired: 'Name is Required',
                                        }} 
                                        errorLabel={ errorLabel }
                                    />
                                    <Form.Input fluid placeholder='1h' name='time' 
                                        value={this.state.time}
                                        onChange={this.handleChange}
                                    />
                                    <Button positive icon='save' content='Add' type='submit' />
                                </Form>                                
                            </Grid.Column>
                        </Grid>
                    </Segment>
                </Modal.Content>
            </Modal>
        )
    }
}