import React, { Component } from "react";
import { Button, Divider, Dropdown, Header, Input, List } from 'semantic-ui-react'
import { Auth, Database } from './../Lib/firebase'
import Panel from './../Containers/Panel'

export default class Encounters extends Component {
    constructor(props) {
        super(props)

        this.state = {
            encounter: null,
            encounters: [],
            encounterName: ''
        }
    }

    componentDidMount() {
        Auth.onAuthStateChanged((user) => {
            if (user){
                var eRef = Database.ref('userdata').child(user.uid).child('encounters')
                this.setState({ eRef })
                eRef.on('child_added', snapshot => {
                    var encounter = snapshot.val()
                    encounter.id = snapshot.key
                    this.setState({ encounter: encounter, encounters: [encounter].concat(this.state.encounters) })
                })
            }
        })
    }

    render() {
        return (
            <Panel auth={true} title={'Encounters'} content={this.content} loaded={true} />
        )
    }

    content = () => {
        var options = this.state.encounters.map(encounter => {
            return {
                key: encounter.id,
                value: encounter.id,
                text: encounter.name
            }
        })

        return (
            <div>
                <Button.Group>
                    <Button icon='plus' content='Create Encounter' positive onClick={this.createEncounter.bind(this)} />
                    <Button.Or />
                    <Dropdown button scrolling text="Select Encounter" options={options} disabled={options.length === 0 || options[0].text === ""} onChange={this.selectEncounter.bind(this)} />
                </Button.Group>

                { this.state.encounter && (
                    <div>
                        <Divider />

                        { this.state.encounter.name === '' ? (
                            <Input transparent placeholder='Encounter Name' value={this.state.encounterName} onChange={(e) => this.setState({ encounterName: e.target.value })} onKeyDown={this.handleNameChange.bind(this)} />
                        ) : (
                            <div>
                                <Header>{this.state.encounter.name}</Header>
                                <List>
                                    { this.state.encounter.monsters ?
                                        Object.keys(this.state.encounter.monsters).map(key => (
                                            <List.Item>{this.state.encounter.monsters[key].name}</List.Item>
                                        ))
                                        : (<List.Item>Add some monsters.</List.Item>)
                                    }
                                </List>
                            </div>
                        )}
                    </div>
                )}
            </div>
        )
    }

    addMonster = (monster) => {
        this.state.seRef.child('monsters').push(monster)
    }

    createEncounter = () => {
        this.state.eRef.push({ name: '' })
    }

    handleNameChange = (e) => {
        if(e.keyCode === 13) {
            this.state.eRef.child(this.state.encounter.id).update({ name: this.state.encounterName })

            var encounter = this.state.encounter
            encounter.name = this.state.encounterName
            this.setState({ encounter })
        }
    }

    selectEncounter = (e, {q, value}) => {
        var seRef = Database.ref('userdata').child(Auth.currentUser.uid).child('encounters').child(value)
        seRef.on('value', snapshot => {
            this.setState({ encounter: snapshot.val() })
        })
        this.setState({ seRef })
    }
}