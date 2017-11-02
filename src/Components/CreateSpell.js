import React, { Component } from 'react'
import Panel from './UI/Panel'
import { Button, Checkbox, Divider, Dropdown, Grid, Header, Icon, Label, List, Popup, Table, Segment } from 'semantic-ui-react'
import { Form } from 'formsy-semantic-ui-react'
import { Auth, Database } from './../Lib/firebase'
import { Slugify, formatSpellLevel } from './../Lib/Common'

export default class CreateSpell extends Component {
    constructor(props) { 
        super(props) 

        this.state = {
            options: {
                ranges: [ 
                    { key: 0, value: 0, text: 'Self' }, 
                    { key: -1, value: -1, text: 'Touch' },
                    { key: -2, value: -2, text: 'Touch' },
                    { key: -3, value: -3, text: 'Touch' },
                    { key: -4, value: -4, text: 'Touch' },
                    { key: -5, value: -5, text: 'Touch' },
                    { key: 2222, value: 2222, text: '1 Mile' },
                    { key: 5555, value: 5555, text: '500 Miles' },
                ]
            },
            public: false,
            needMaterial: false,

            // Placeholders
            desc: '',
            higher_level: '',
            material: ''
        }
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value })
    handleChangeArray = (type, name, value, index) => {
        var items = this.state[type]
        items[index][name] = value
        this.setState({ [type]: items })
    }
    handleAddition = (type, value) => {
        var options = this.state.options
        options[type] = [{ text: value, value }, ...this.state.options[type]]
        this.setState({
            options: options
        })
    }

    save = () => {
        const { name, school, level, casting_time, range, duration, classes, desc, higher_level, components, material } = this.state

        const spell = { name, school, level, casting_time, range, duration, classes, desc, higher_level, components, material,
            slug: Slugify(name),
            uid: Auth.currentUser.uid,
            public: this.state.public,
            custom: true
        }

        Database.ref('userdata/'+Auth.currentUser.uid+'/spells/'+spell.slug).set(spell)
            .then(() => {
                this.props.onSuccess()
                if(spell.public) {
                    Database.ref('custom_monsters/'+spell.slug).set(spell)
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
                    <Panel title='Create Spell' content={this.content} />
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
                <Button positive fluid size='large' content='Save Spell' icon='save' type='submit' form='form' />
            </div>
        )
    }

    content = () => {
        let levelOptions = []
        for(var i = 0; i <= 9; i++){
            levelOptions.push({ key: i, value: i, text: formatSpellLevel(i) })
        }

        var schools = ['Abjuration', 'Conjuration', 'Divination', 'Enchantment', 'Evocation', 'Illusion', 'Necromancy', 'Transmutation']
        var schoolOptions = schools.map((school, i) => {
            return { key: school, value: school, text: school }
        })

        var classes = ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Sorcerer', 'Rogue', 'Warlock', 'Wizard']
        var classOptions = classes.map((c, i) => {
            return { key: c, value: c, text: c }
        })

        var components = ['Verbal', 'Somatic', 'Material']
        var componentOptions = components.map((c, i) => {
            return { key: c, value: c, text: c }
        })

        const errorLabel = <Label color="red" pointing/>

        return (
            <Form onValidSubmit={this.save} id='form'>
                <Segment raised>
                    <Form.Input  
                        focus 
                        label='Name' 
                        type='text' 
                        placeholder='Zone of Truth' 
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
                            label='School' 
                            options={schoolOptions} 
                            placeholder='Enchantment' 
                            name='school'
                            value={this.state.size} 
                            onChange={this.handleChange} 
                            required
                            validationErrors={{
                                isDefaultRequiredValue: 'Required Field',
                            }} 
                            errorLabel={ errorLabel }
                        />
                        <Form.Select 
                            label='Level' 
                            options={levelOptions} 
                            placeholder='2nd' 
                            name='level' 
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
                                                inline 
                                                label={(<span><Icon name='clock' /> Casting Time</span>)}
                                                type='text' 
                                                placeholder='1 Action' 
                                                name='casting_time' 
                                                value={this.state.casting_time} 
                                                onChange={this.handleChange}
                                                required
                                                validationErrors={{
                                                    isDefaultRequiredValue: 'Required Field',
                                                }} 
                                                errorLabel={ errorLabel }
                                            />
                                        </List.Item>
                                        <List.Item>
                                            <Form.Select 
                                                inline
                                                search 
                                                selection 
                                                allowAdditions 
                                                options={this.state.options.ranges} 
                                                name='range' 
                                                label={(<span><Icon name='wifi' /> Range</span>)}
                                                value={this.state.range} 
                                                onChange={this.handleChange} 
                                                onAddItem={(e, { value }) => this.handleAddition('ranges', value)}
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
                                                label={(<span><Icon name='history' /> Duration</span>)}
                                                type='text' 
                                                placeholder='10 minutes' 
                                                name='duration' 
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
                                                label='Classes' 
                                                multiple 
                                                search 
                                                selection 
                                                options={classOptions} 
                                                name='classes' 
                                                value={this.state.classes} 
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

                            <Form.TextArea 
                                label='Description' 
                                name='desc' 
                                value={this.state.desc}
                                onChange={this.handleChange} 
                                required
                                validationErrors={{
                                    isDefaultRequiredValue: 'Required Field',
                                }} 
                                errorLabel={ errorLabel }
                            />
                            <Form.TextArea label='At Higher Levels' name='higher_level' value={this.state.higher_level} onChange={this.handleChange} />

                            <Divider />

                            <Form.Group>
                                <Form.Select 
                                    width={8}
                                    label='Components' 
                                    multiple 
                                    search 
                                    selection 
                                    options={componentOptions} 
                                    name='components' 
                                    value={this.state.components} 
                                    onChange={(e, { name, value }) => {
                                        this.handleChange(e, { name, value })
                                        this.setState({ needMaterial: value.indexOf('Material') >= 0 })
                                    }} 
                                    required
                                    validationErrors={{
                                        isDefaultRequiredValue: 'Required Field',
                                    }} 
                                    errorLabel={ errorLabel }
                                />

                                { this.state.needMaterial && 
                                    <Form.Input 
                                        width={8} 
                                        focus 
                                        label='Material' 
                                        type='text' 
                                        placeholder='Dragon Eye' 
                                        name='material' 
                                        value={this.state.material} 
                                        onChange={this.handleChange}
                                        required
                                        validationErrors={{
                                            isDefaultRequiredValue: 'Name is Required',
                                        }} 
                                        errorLabel={ errorLabel }
                                    />
                                }
                            </Form.Group>

                        </Segment>
                    </Segment.Group>
                </Segment>                
            </Form>
        )
    }
}