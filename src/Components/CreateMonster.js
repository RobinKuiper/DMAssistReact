import React, { Component } from 'react'
import Panel from './../Containers/Panel'
import { Button, Checkbox, Divider, Dropdown, Grid, Header, Label, List, Popup, Table, Segment } from 'semantic-ui-react'
import { Form } from 'formsy-semantic-ui-react'
import { Auth, Database } from './../Lib/firebase'
import { Slugify } from './../Lib/Common'


export default class CreateMonster extends Component {
    constructor(props) { 
        super(props) 

        this.state = {
            options: {
                skills: [ { value: 'Perception +6', text: 'Perception +6' }, { value: 'Steahlth +3', text: 'Steahlth +3' } ],
                senses: [ { value: 'Blindsight 30ft.', text: 'Blindsight 30ft.' }, { value: 'Darkvision 60ft.', text: 'Darkvision 60ft.' }, { value: 'Darkvision 120ft.', text: 'Darkvision 120ft.' }, { value: 'Truesight', text: 'Truesight' }],
                saves: [ { value: 'Dex +3', text: 'Dex +3' }, { value: 'Con +2', text: 'Con +2' }, { value: 'Wis +3', text: 'Wis +3' } ]
            },
            public: false,
            traits: [ {} ],
            actions: [ {} ],
            reactions: [ {} ],
            legendary_actions: [ {} ],

            // Placeholders
            languages: '',
            senses: null,
            saves: null,
            skills: null,
            damage_immunities: null,
            damage_resistances: null,
            damage_vulnerabilities: null,
            condition_immunities: null
        }
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value })
    handleChangeArray = (type, name, value, index) => {
        var items = this.state[type]
        items[index][name] = value
        this.setState({ traits: items })
    }
    handleAddition = (type, value) => {
        var options = this.state.options
        options[type] = [{ text: value, value }, ...this.state.options[type]]
        this.setState({
            options: options
        })
    }

    save = () => {
        const { name, size, type, armor_class, hit_points, speed, alignment, languages, 
            challenge_rating, strength, dexterity, constitution, intelligence, wisdom, 
            charisma, skills, senses, saves, damage_immunities, damage_resistances, 
            damage_vulnerabilities, condition_immunities, traits, actions, reactions, legendary_actions } = this.state

        const monster = { name, size, type, armor_class, hit_points, speed, alignment, languages, 
            challenge_rating, strength, dexterity, constitution, intelligence, wisdom, 
            charisma, skills, senses, saves, damage_immunities, damage_resistances, 
            damage_vulnerabilities, condition_immunities, traits, actions, reactions, legendary_actions,
            slug: Slugify(name),
            uid: Auth.currentUser.uid,
            public: this.state.public,
            custom: true
        }

        Database.ref('userdata/'+Auth.currentUser.uid+'/monsters/'+monster.slug).set(monster)
            .then(e => {
                console.log(e)
                if(monster.public) {
                    Database.ref('custom_monsters/'+monster.slug).set(monster)
                        .then(e => {
                            console.log(e)
                        })
                        .catch(e => {
                            console.log(e)
                        })
                }
            })
            .catch(e => {
                console.log(e)
            })
    }

    render () {
        return (
            <Grid columns={2} stackable>
                <Grid.Column width={11}>
                    <Panel title='Create Monster' content={this.content} />
                </Grid.Column>

                <Grid.Column width={5}>
                    <Panel title='Options' content={this.options} />
                </Grid.Column>
            </Grid>
        )
    }

    //Monster will be validated before showing up public
    options = () => {
        return (
            <div>
                <Popup content='Coming Soon.' trigger={<Checkbox disabled toggle label='Public?' name='public' checked={this.state.public} onChange={(e, {checked}) => this.setState({ public: checked })} />} />
                <Divider />
                <Button positive fluid size='large' content='Save Monster' icon='save' type='submit' form='form' />
            </div>
        )
    }

    content = () => {
        var crOptions = [
            { key: 0.125, value: 0.125, text: '1/8' },
            { key: 0.25, value: 0.25, text: '1/4' },
            { key: 0.5, value: 0.5, text: '1/2' }, 
        ]
        for(var i = 1; i <= 30; i++){
            crOptions.push({ key: i, value: i, text: i })
        }

        var alignments = ['Unaligned', 'Any Alignment', '-', 'Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil', '-', 'Any Evil', 'Any Good', 'Any Neutral', 'Any Lawful', 'Any Chaotic']
        var alignOptions = alignments.map((alignment, i) => {
            return alignment !== '-' ? { key: alignment, value: alignment, text: alignment } : { key: i, value: i, text: '----', disabled: true }
        })

        var dmgTypes = ['Acid', 'Bludgeoning', 'Cold', 'Fire', 'Force', 'Lightning', 'Necrotic', 'Piercing', 'Poison', 'Psychic', 'Slasing', 'Thunder']
        var dmgOptions = dmgTypes.map(type => {
            return { key: type, value: type, text: type }
        })

        var conditions = ['Blinded', 'Charmed', 'Deafened', 'Fatiqued', 'Frightened', 'Grappled', 'Incapacitated', 'Invisible', 'Paralyzed', 'Petrified', 'Poisoned', 'Prone', 'Restrained', 'Stunned', 'Unconscious', 'Exhaustion']
        var conOptions = conditions.map(condition => {
            return { key: condition, value: condition, text: condition }
        })

        var sizes = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan']
        var sizeOptions = sizes.map(size => {
            return { key: size, value: size, text: size }
        })

        var types = ['Aberration', 'Beast', 'Celestial', 'Construct', 'Dragon', 'Elemental', 'Fey', 'Fiend', 'Giant', 'Humanoid', 'Monstrosity', 'Ooze', 'Plant', 'Undead']
        var typeOptions = types.map(type => {
            return { key: type, value: type, text: type }
        })

        const errorLabel = <Label color="red" pointing/>

        return (
            <Form onValidSubmit={this.save} id='form'>
                <Segment raised>
                    <Form.Input  
                        focus 
                        label='Name' 
                        type='text' 
                        placeholder='Zombie' 
                        name='name' 
                        value={this.state.name} 
                        onChange={this.handleChange}
                        required
                        validations="minLength:2,isWords"
                        validationErrors={{
                            minLength: 'Minimal length is 2 letters',
                            isWords: 'No numbers or special characters allowed',
                            isDefaultRequiredValue: 'Name is Required',
                        }} 
                        errorLabel={ errorLabel }
                    />
                    <Form.Group widths='equal'>
                        <Form.Select 
                            label='Size' 
                            options={sizeOptions} 
                            placeholder='Medium' 
                            name='size'
                            value={this.state.size} 
                            onChange={this.handleChange} 
                            required
                            validationErrors={{
                                isDefaultRequiredValue: 'Required Field',
                            }} 
                            errorLabel={ errorLabel }
                        />
                        <Form.Select 
                            label='type' 
                            options={typeOptions} 
                            placeholder='Undead' 
                            name='type' 
                            value={this.state.type} 
                            onChange={this.handleChange}
                            required
                            validationErrors={{
                                isDefaultRequiredValue: 'Required Field',
                            }} 
                            errorLabel={ errorLabel }
                        />
                    </Form.Group>
                    <Segment.Group>
                        <Segment>
                            <Grid columns={2}>
                                <Grid.Column>
                                    <List>
                                        <List.Item>
                                            <Form.Input 
                                                inline label='Armor Class' 
                                                type='number' 
                                                placeholder='8' 
                                                name='armor_class' 
                                                value={this.state.armor_class} 
                                                onChange={this.handleChange}
                                                required
                                                validations='isInt'
                                                validationErrors={{
                                                    isInt: 'Must be a number',
                                                    isDefaultRequiredValue: 'Required Field',
                                                }} 
                                                errorLabel={ errorLabel }
                                            />
                                        </List.Item>
                                        <List.Item>
                                            <Form.Input 
                                                inline 
                                                label='Hit Points' 
                                                type='number' 
                                                placeholder='22' 
                                                name='hit_points' 
                                                value={this.state.hit_points} 
                                                onChange={this.handleChange}
                                                required
                                                validations='isInt'
                                                validationErrors={{
                                                    isInt: 'Must be a number',
                                                    isDefaultRequiredValue: 'Required Field',
                                                }} 
                                                errorLabel={ errorLabel }
                                            />
                                        </List.Item>
                                        <List.Item>
                                            <Form.Input 
                                                inline 
                                                label='Speed' 
                                                type='text' 
                                                placeholder='20 ft., fly 50 ft.' 
                                                name='speed' 
                                                value={this.state.speed}
                                                onChange={this.handleChange}
                                                required
                                                validationErrors={{
                                                    isDefaultRequiredValue: 'Required Field',
                                                }} 
                                                errorLabel={ errorLabel }
                                            />
                                        </List.Item>
                                    </List>
                                </Grid.Column>

                                <Grid.Column>
                                    <List>
                                        <List.Item>
                                            <Form.Select 
                                                inline 
                                                label='Alignment' 
                                                options={alignOptions} 
                                                placeholder='Neutral Evil' 
                                                name='alignment' 
                                                value={this.state.alignment} 
                                                onChange={this.handleChange}
                                                required
                                                validationErrors={{
                                                    isDefaultRequiredValue: 'Required Field',
                                                }} 
                                                errorLabel={ errorLabel }
                                            />
                                        </List.Item>
                                        <List.Item>
                                            <Form.Input inline label='Languages' type='text' placeholder='Common, Dragonic' name='languages' value={this.state.languages} onChange={this.handleChange} />
                                        </List.Item>
                                        <List.Item>
                                            <Form.Select 
                                                inline 
                                                label='Challenge' 
                                                options={crOptions} 
                                                placeholder='1/4' 
                                                name='challenge_rating' 
                                                value={this.state.challenge_rating}
                                                onChange={this.handleChange}
                                                required
                                                validationErrors={{
                                                    isDefaultRequiredValue: 'Required Field',
                                                }} 
                                                errorLabel={ errorLabel }
                                            />
                                        </List.Item>
                                    </List>
                                </Grid.Column>
                            </Grid>

                            <Divider />

                            <Table color='black' fixed>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>STR</Table.HeaderCell>
                                        <Table.HeaderCell>DEX</Table.HeaderCell>
                                        <Table.HeaderCell>CON</Table.HeaderCell>
                                        <Table.HeaderCell>INT</Table.HeaderCell>
                                        <Table.HeaderCell>WIS</Table.HeaderCell>
                                        <Table.HeaderCell>CHA</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell>
                                            <Form.Input 
                                                type='number' 
                                                placeholder='13'  
                                                name='strength' 
                                                value={this.state.str}
                                                onChange={this.handleChange}
                                                required
                                                validations='isInt'
                                                validationErrors={{
                                                    isInt: 'Must be a number',
                                                    isDefaultRequiredValue: 'Required Field',
                                                }} 
                                                errorLabel={ errorLabel }
                                            />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Form.Input 
                                                type='number' 
                                                placeholder='6'  
                                                name='dexterity' 
                                                value={this.state.dex} 
                                                onChange={this.handleChange}
                                                required
                                                validations='isInt'
                                                validationErrors={{
                                                    isInt: 'Must be a number',
                                                    isDefaultRequiredValue: 'Required Field',
                                                }} 
                                                errorLabel={ errorLabel }
                                            />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Form.Input 
                                                type='number' 
                                                placeholder='16'  
                                                name='constitution' 
                                                value={this.state.con} 
                                                onChange={this.handleChange}
                                                required
                                                validations='isInt'
                                                validationErrors={{
                                                    isInt: 'Must be a number',
                                                    isDefaultRequiredValue: 'Required Field',
                                                }} 
                                                errorLabel={ errorLabel }
                                            />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Form.Input 
                                                type='number' 
                                                placeholder='3'  
                                                name='intelligence' 
                                                value={this.state.int} 
                                                onChange={this.handleChange}
                                                required
                                                validations='isInt'
                                                validationErrors={{
                                                    isInt: 'Must be a number',
                                                    isDefaultRequiredValue: 'Required Field',
                                                }} 
                                                errorLabel={ errorLabel }
                                            />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Form.Input 
                                                type='number' 
                                                placeholder='6'  
                                                name='wisdom' 
                                                value={this.state.wis}
                                                onChange={this.handleChange}
                                                required
                                                validations='isInt'
                                                validationErrors={{
                                                    isInt: 'Must be a number',
                                                    isDefaultRequiredValue: 'Required Field',
                                                }} 
                                                errorLabel={ errorLabel }
                                            />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Form.Input 
                                                type='number' 
                                                placeholder='5'  
                                                name='charisma' 
                                                value={this.state.cha} 
                                                onChange={this.handleChange}
                                                required
                                                validations='isInt'
                                                validationErrors={{
                                                    isInt: 'Must be a number',
                                                    isDefaultRequiredValue: 'Required Field',
                                                }} 
                                                errorLabel={ errorLabel }
                                            />
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>

                            <Divider />

                            <Grid columns={2}>
                                <Grid.Column>
                                    <List>
                                        <List.Item><Dropdown placeholder='Skills' fluid multiple search selection allowAdditions options={this.state.options.skills} name='skills' value={this.state.skills} onChange={this.handleChange} onAddItem={(e, { value }) => this.handleAddition('skills', value)} /></List.Item>
                                        <List.Item><Dropdown placeholder='Senses' fluid multiple search selection allowAdditions options={this.state.options.senses} name='senses' value={this.state.senses} onChange={this.handleChange} onAddItem={(e, { value }) => this.handleAddition('senses', value)} /></List.Item>
                                        <List.Item><Dropdown placeholder='Saves' fluid multiple search selection allowAdditions options={this.state.options.saves} name='saves' value={this.state.saves} onChange={this.handleChange} onAddItem={(e, { value }) => this.handleAddition('saves', value)} /></List.Item>
                                    </List>
                                </Grid.Column>

                                <Grid.Column>
                                    <List>
                                        <List.Item><Dropdown placeholder='Damage Immunities' fluid multiple selection options={dmgOptions} name='damage_immunities' value={this.state.damage_immunities} onChange={this.handleChange} /></List.Item>
                                        <List.Item><Dropdown placeholder='Condition Immunities' fluid multiple selection options={conOptions} name='condition_immunities' value={this.state.condition_immunities} onChange={this.handleChange} /></List.Item>
                                        <List.Item><Dropdown placeholder='Damage Vulnerabilities' fluid multiple selection options={dmgOptions} name='damage_vulnerabilities' value={this.state.damage_vulnerabilities} onChange={this.handleChange} /></List.Item>
                                        <List.Item><Dropdown placeholder='Damage Resistances' fluid multiple selection options={dmgOptions} name='damage_resistances' value={this.state.damage_resistances} onChange={this.handleChange} /></List.Item>
                                    </List>
                                </Grid.Column>
                            </Grid>

                            <Divider />

                            <div>
                                <div>
                                    <Header style={{display: 'inline-block'}}>Traits&nbsp;</Header>
                                    <Popup content='Add Trait' trigger={<Button icon='plus' type='button' size='tiny' onClick={() => this.add('traits')} />} />
                                </div>
                                <List>
                                { this.state.traits.map((item, i) => (
                                    <List.Item>
                                        <Form.Input type='text' placeholder='Multiattack' value={item.name}  name='name' onChange={(e, { name, value }) => this.handleChangeArray('traits', name, value, i)} />
                                        <Form.TextArea placeholder='The Zombie makes three attacks.' value={item.desc} name='desc' onChange={(e, { name, value }) => this.handleChangeArray('traits', name, value, i)} />
                                    </List.Item>
                                ))}
                                </List>
                            </div>

                            <Divider />
                            
                            <div>
                                <div>
                                    <Header style={{display: 'inline-block'}}>Actions&nbsp;</Header>
                                    <Popup content='Add Action' trigger={<Button icon='plus' type='button' size='tiny' onClick={() => this.add('actions')} />} />
                                </div>
                                <List>
                                { this.state.actions.map((item, i) => (
                                    <List.Item>
                                        <Form.Input type='text' placeholder='Multiattack' value={item.name}  name='name' onChange={(e, { name, value }) => this.handleChangeArray('actions', name, value, i)} />
                                        <Form.TextArea placeholder='The Zombie makes three attacks.' value={item.desc} name='desc' onChange={(e, { name, value }) => this.handleChangeArray('actions', name, value, i)} />
                                    </List.Item>
                                ))}
                                </List>
                            </div>

                            <Divider />
                            
                            <div>
                                <div>
                                    <Header style={{display: 'inline-block'}}>Reactions&nbsp;</Header>
                                    <Popup content='Add Reaction' trigger={<Button icon='plus' type='button' size='tiny' onClick={() => this.add('reactions')} />} />
                                </div>
                                <List>
                                { this.state.reactions.map((item, i) => (
                                    <List.Item>
                                        <Form.Input type='text' placeholder='Multiattack' value={item.name}  name='name' onChange={(e, { name, value }) => this.handleChangeArray('reactions', name, value, i)} />
                                        <Form.TextArea placeholder='The Zombie makes three attacks.' value={item.desc} name='desc' onChange={(e, { name, value }) => this.handleChangeArray('reactions', name, value, i)} />
                                    </List.Item>
                                ))}
                                </List>
                            </div>

                            <Divider />
                            
                            <div>
                                <div>
                                    <Header style={{display: 'inline-block'}}>Legendary Actions&nbsp;</Header>
                                    <Popup content='Add Legendary Action' trigger={<Button icon='plus' type='button' size='tiny' onClick={() => this.add('legendary_actions')} />} />
                                </div>
                                <List>
                                { this.state.legendary_actions.map((item, i) => (
                                    <List.Item>
                                        <Form.Input type='text' placeholder='Multiattack' value={item.name}  name='name' onChange={(e, { name, value }) => this.handleChangeArray('legendary_actions', name, value, i)} />
                                        <Form.TextArea placeholder='The Zombie makes three attacks.' value={item.desc} name='desc' onChange={(e, { name, value }) => this.handleChangeArray('legendary_actions', name, value, i)} />
                                    </List.Item>
                                ))}
                                </List>
                            </div>
                        </Segment>
                    </Segment.Group>
                </Segment>                
            </Form>
        )
    }

    add = (type) => {
        var items = this.state[type]
        items.push({ name: '' })
        this.setState({ [type]: items })
    }
}