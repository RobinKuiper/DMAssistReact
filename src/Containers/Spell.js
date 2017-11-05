import React, { Component } from 'react'
import { Grid, Header } from 'semantic-ui-react'
import { Database } from './../Lib/firebase'

import SpellLayout from './../Components/SpellLayout'

export default class MonsterModal extends Component {
    constructor(props){
        super(props)

        this.state = { spell: null }
    }

    componentWillMount() {
        const slug = this.props.match.params.slug
        Database.ref('spells/'+slug).on('value', snapshot => {
            this.setState({ spell: snapshot.val() })
        })
    }

    render() {
        if(this.state.spell){
            const spell = this.state.spell
            return (
                <main>
                    <Grid>
                        <Grid.Column width={1} />

                        <Grid.Column width={14}>
                            <SpellLayout spell={spell} backButton={true} history={this.props.history} />
                        </Grid.Column>
                    </Grid>
                </main>
            )
        } else {
            return (<Header>Spell not found</Header>)
        }
    }
}
