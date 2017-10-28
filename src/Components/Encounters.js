import React, { Component } from "react";
import { Button, Divider, Dropdown, Header, Input, List, Popup } from 'semantic-ui-react'
import { Auth, Database } from './../Lib/firebase'
import Panel from './../Containers/Panel'
import MonsterModal from './MonsterModal'
import { CRtoEXP, formatNumber } from './../Lib/Common'
import LoginModal from './LoginModal'

export default class Encounters extends Component {
    constructor(props) {
        super(props)

        this.state = {
            encounter: null,
            encounterName: ''
        }
    }

    componentDidMount() {
        Auth.onAuthStateChanged((user) => {
            if (user){
                var eRef = Database.ref('userdata').child(user.uid).child('encounters')
                this.setState({ eRef })
            }
        })
    }

    render() {
        return (
            <Panel title={'Encounters'} content={this.content} loaded={true} />
        )
    }

    content = () => {
        if(Auth.currentUser){
            var options = this.props.encounters.map(encounter => {
                return {
                    key: encounter.id,
                    value: encounter.id,
                    text: encounter.name
                }
            })

            var monsterInfo = { monsters: (<List.Item>No monsters found.</List.Item>), total: 0, exp: 0, aexp: 0 }
            if(this.state.encounter && this.state.encounter.monsters){
                monsterInfo.monsters = Object.keys(this.state.encounter.monsters).map(key => {
                    var monster = this.state.encounter.monsters[key]
                    monsterInfo.total++
                    monsterInfo.exp += CRtoEXP(monster.challenge_rating)
                    return (
                        <List.Item key={key}>
                            <List.Content floated='right'><Button size='mini' negative icon='remove' onClick={() => this.state.seRef.child('monsters').child(key).remove()} /></List.Content>
                            <List.Content>
                                <List.Header as='a'>
                                    <MonsterModal monster={monster} trigger={<span>{monster.name}</span>} />
                                    <Header.Subheader style={{fontWeight: 0, fontSize: '9pt'}}>{monster.size} {monster.type}</Header.Subheader>
                                </List.Header>
                            </List.Content>
                        </List.Item>
                    )
                })
                switch(monsterInfo.total){
                    case 1: monsterInfo.aexp = monsterInfo.exp * 1; break;
                    case 2: monsterInfo.aexp = monsterInfo.exp * 1.5; break;
                    case 3: case 4: case 5: case 6: monsterInfo.aexp = monsterInfo.exp * 2; break;
                    case 7: case 8: case 9: case 10: monsterInfo.aexp = monsterInfo.exp * 2.5; break;
                    case 11: case 12: case 13: case 14: monsterInfo.aexp = monsterInfo.exp * 3; break;
                    default: monsterInfo.aexp = monsterInfo.exp * 4;
                }
            }

            return (
                <div>
                    <div style={{textAlign: 'center'}}>
                        <Button.Group>
                            <Button icon='plus' content='Create' positive onClick={this.createEncounter.bind(this)} />
                            <Button.Or />
                            {/*TODO: Dropdown not refreshing */}
                            <Dropdown button scrolling text="Select" options={options} disabled={options.length === 0} onChange={this.selectEncounter.bind(this)} />
                        </Button.Group>
                    </div>

                    { this.state.encounter && (
                        <div>
                            <Divider />

                            { this.state.encounter.name === '' ? (
                                <Input transparent placeholder='Encounter Name' value={this.state.encounterName} onChange={(e) => this.setState({ encounterName: e.target.value })} onKeyDown={this.handleNameChange.bind(this)} />
                            ) : (
                                <div>
                                    <Header>{this.state.encounter.name}</Header>

                                    <List>
                                        <List.Item>Monsters: {formatNumber(monsterInfo.total)}</List.Item>
                                        <List.Item>Total XP: {formatNumber(monsterInfo.exp)}</List.Item>
                                        <List.Item><Popup content='The amount of monsters makes an encounter harder' trigger={<span>Adjusted XP</span>} />: {formatNumber(monsterInfo.aexp)}</List.Item>
                                    </List>

                                    <Divider />

                                    <List>
                                        {monsterInfo.monsters}
                                    </List>

                                    <Divider />

                                    <Button fluid negative content='Remove Encounter' icon='remove' onClick={this.removeEncounter} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )
        }else{
            return (<p>Please <LoginModal trigger={<span style={{textDecoration: 'underline', cursor: 'pointer'}}>Sign In</span>} /> to create encounters.</p>)   
        }
    }

    addMonster = (monster) => {
        this.state.seRef.child('monsters').push(monster)
    }

    createEncounter = () => {
        var r = this.state.eRef.push()
        r.set({ name: '' })
        this.setEncounter(r.key)
    }

    removeEncounter = () => {
        this.state.seRef.remove()
        this.props.setEcounter(false)
    }

    handleNameChange = (e) => {
        if(e.keyCode === 13) {
            this.state.eRef.child(this.state.encounter.id).update({ name: this.state.encounterName })

            var encounter = this.state.encounter
            encounter.name = this.state.encounterName
            this.setState({ encounter })
        }
    }

    setEncounter = (id) => {
        if(this.state.seRef) this.state.seRef.off()
        var seRef = Database.ref('userdata').child(Auth.currentUser.uid).child('encounters').child(id)
        seRef.on('value', snapshot => {
            var encounter = snapshot.val()
            if(encounter !== null) encounter.id = snapshot.key
            this.setState({ encounter })
        })
        this.setState({ seRef })
        this.props.setEcounter(true)
    }

    selectEncounter = (e, {q, value}) => {
        this.setEncounter(value)
    }
}