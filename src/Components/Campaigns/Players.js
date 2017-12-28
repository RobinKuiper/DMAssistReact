import React, { Component } from 'react'
import { Button, Label, List, Popup, Table } from 'semantic-ui-react'
import { Form } from 'formsy-semantic-ui-react'
import Panel from './../UI/Panel'
import { func, object } from 'prop-types'
import { Mobile, Default } from './../../Lib/Responsive'

export default class Players extends Component {
    static propTypes = {
        players: object,
        handleSubmit: func.isRequired,
        handleRemove: func.isRequired,
        handleAdd: func.isRequired
    }

    render() {
        return (
            <Panel title='Players' content={this.content.bind(this)} closeable />
        )
    }
    
    content(){
        const { 
            handleAdd,
            handleRemove,
            handleSubmit,
            players
        } = this.props
        const errorLabel = <Label color="red" pointing/>

        return (
            <Form onValidSubmit={handleSubmit}>
                <Mobile>
                    <List>
                    { players ?
                        Object.keys(players).map(key => (
                            <List.Item key={key}>
                                <List.Content floated='right'>
                                    <Button.Group>
                                        <Popup content={'Add ' + players[key].name + ' to the turnorder.'} trigger={<Button type='button' color='blue' icon='plus' onClick={() => handleAdd(key)} />} />
                                        <Popup content={'Remove ' + players[key].name + ' from your campaign.'} trigger={<Button type='button' color='red' icon='remove' onClick={() => handleRemove(key)} />} />
                                    </Button.Group>
                                </List.Content>
                                <List.Content>
                                    <List.Header>{players[key].name}</List.Header>
                                    <List.Description>
                                        <List horizontal>
                                            <List.Item>LVL {players[key].level}</List.Item>
                                            <List.Item>HP {players[key].hit_points}</List.Item>
                                            <List.Item>AC {players[key].armor_class}</List.Item>
                                        </List>
                                    </List.Description>
                                </List.Content>
                            </List.Item>
                        ))
                        : <List.Item>No players added (yet).</List.Item>
                    }
                    </List>

                    <Button fluid icon='plus' color='green' content='Add Player' disabled />
                </Mobile>

                <Default>
                    <Table color='black' selectable stackable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell>Level</Table.HeaderCell>
                                <Table.HeaderCell>Hit Points</Table.HeaderCell>
                                <Table.HeaderCell>Armor Class</Table.HeaderCell>
                                <Table.HeaderCell colSpan={2} />
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                        { players ?
                            Object.keys(players).map(key => (
                                <Table.Row key={key}>
                                <Table.Cell>{players[key].name}</Table.Cell>
                                <Table.Cell>{players[key].level}</Table.Cell>
                                <Table.Cell>{players[key].hit_points}</Table.Cell>
                                <Table.Cell>{players[key].armor_class}</Table.Cell>
                                <Table.Cell>
                                    <Button.Group size='mini'>
                                        <Popup content={'Add ' + players[key].name + ' to the turnorder.'} trigger={<Button type='button' color='blue' icon='plus' onClick={() => handleAdd(key)} />} />
                                        <Popup content={'Remove ' + players[key].name + ' from your campaign.'} trigger={<Button type='button' color='red' icon='remove' onClick={() => handleRemove(key)} />} />
                                    </Button.Group>
                                </Table.Cell>
                                </Table.Row>
                            ))
                            : (
                            <Table.Row>
                                <Table.Cell colSpan={5}>No players added (yet).</Table.Cell>
                            </Table.Row>
                            )
                        }
                        </Table.Body>

                        <Table.Footer>
                            <Table.Row>
                                <Table.HeaderCell>
                                    <Form.Input 
                                        name='name' 
                                        placeholder='Name *' 
                                        type='text' 
                                        transparent 
                                        validations="minLength:2,isWords,isRequired"
                                        validationErrors={{
                                            minLength: 'Minimal length is 2 letters',
                                            isWords: 'No numbers or special characters allowed',
                                            isRequired: 'Name is Required',
                                        }} 
                                        errorLabel={ errorLabel }
                                    />
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    <Form.Input 
                                        name='level' 
                                        placeholder='Level' 
                                        type='number' 
                                        transparent 
                                        validations='isInt'
                                        validationErrors={{
                                            isInt: 'Must be a number',
                                        }} 
                                        errorLabel={ errorLabel }
                                    />
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    <Form.Input 
                                        name='hit_points' 
                                        placeholder='Hit Points' 
                                        type='number' 
                                        transparent 
                                        validations='isInt'
                                        validationErrors={{
                                            isInt: 'Must be a number',
                                        }} 
                                        errorLabel={ errorLabel }
                                    />
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    <Form.Input 
                                        name='armor_class' 
                                        placeholder='Armor Class' 
                                        type='number' 
                                        transparent 
                                        validations='isInt'
                                        validationErrors={{
                                            isInt: 'Must be a number',
                                        }} 
                                        errorLabel={ errorLabel }
                                    />
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    <Button icon='plus' content='Add' type='submit' />
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                </Default>
            </Form>
        )
    }
}