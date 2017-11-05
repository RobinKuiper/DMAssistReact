import React, { Component } from "react";
import { Button, Divider, Dropdown, Grid, Header, Input, List, Popup } from 'semantic-ui-react'
import { Auth, Database } from './../Lib/firebase'
import Panel from './UI/Panel'
import MonsterModal from './MonsterModal'
import { CRtoEXP, formatNumber } from './../Lib/Common'
import LoginModal from './Auth/LoginModal'

import {Generator} from './../Lib/TreasureGenerator'

export default class Encounters extends Component {
    constructor(props) {
        super(props)

        this.state = {
            encounter: null,
            encounterName: '',
            percentage: 0,
            challenge_ratings: []
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
                this.challenge_ratings = []
                monsterInfo.monsters = Object.keys(this.state.encounter.monsters).map(key => {
                    var monster = this.state.encounter.monsters[key]
                    monsterInfo.total++
                    monsterInfo.exp += CRtoEXP(monster.challenge_rating)
                    this.challenge_ratings.push(monster.challenge_rating)
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

            let percentageOptions = []
            for(var i = 10; i <= 90; i+=10 ){
                percentageOptions.push({ text: i+'%', value: i, key: i })
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

                                    <Button.Group fluid>
                                        <Dropdown button name='percentage' options={percentageOptions} text={this.state.percentage > 0 ? this.state.percentage + '%' : '%'} onChange={(e, {value}) => this.setState({ percentage: value })} />
                                        <Button positive content='Generate Treasure' icon='diamond' onClick={this.generateTreasure} />
                                    </Button.Group>

                                    { this.state.encounter.treasure && (
                                        <Grid style={{marginTop: 20}}>
                                            <Grid.Column width={8}>
                                                <List>
                                                    <List.Item><Header>Currency</Header></List.Item>
                                                    { this.state.encounter.treasure.cp > 0 && <List.Item>CP: {this.state.encounter.treasure.cp} ({this.state.encounter.treasure.cp/100}GP)</List.Item> }
                                                    { this.state.encounter.treasure.sp > 0 && <List.Item>SP: {this.state.encounter.treasure.sp} ({this.state.encounter.treasure.sp/10}GP)</List.Item> }
                                                    { this.state.encounter.treasure.ep > 0 && <List.Item>EP: {this.state.encounter.treasure.ep} ({this.state.encounter.treasure.ep/2}GP)</List.Item> }
                                                    { this.state.encounter.treasure.gp > 0 && <List.Item>GP: {this.state.encounter.treasure.gp}</List.Item> }
                                                    { this.state.encounter.treasure.pp > 0 && <List.Item>PP: {this.state.encounter.treasure.pp} ({this.state.encounter.treasure.pp*2}GP)</List.Item> }
                                                </List>
                                            </Grid.Column>

                                            <Grid.Column width={8}>
                                                { this.state.encounter.treasure.gem && this.state.encounter.treasure.gem.length > 0 && (
                                                    <List>
                                                        <List.Item><Header>Gems</Header></List.Item>
                                                        { this.state.encounter.treasure.gem.map((item, i) => (
                                                            <List.Item key={i}>{item}</List.Item>
                                                        ))}
                                                    </List>
                                                )}

                                                { this.state.encounter.treasure.art && this.state.encounter.treasure.art.length > 0 && (
                                                    <List>
                                                        <List.Item><Header>Art</Header></List.Item>
                                                        { this.state.encounter.treasure.art.map((item, i) => (
                                                            <List.Item key={i}>{item}</List.Item>
                                                        ))}
                                                    </List>
                                                )}
                                            </Grid.Column>
                                        </Grid>
                                    )}

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

    generateTreasure = () => {
        const treasure = Generator(this.challenge_ratings, this.state.percentage)
        this.setState({ treasure })
        this.state.seRef.child('treasure').set(treasure)
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
        this.props.setEncounter(false)
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
        this.props.setEncounter(true)
    }

    selectEncounter = (e, {q, value}) => {
        this.setEncounter(value)
    }
}