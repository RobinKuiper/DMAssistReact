import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import { Database } from './../Lib/firebase'

import SpellLayout from './../Components/Spells/SpellLayout'

export default class MonsterModal extends Component {
    state = { spell: null, loading: true }

    componentWillMount(){
        const key = this.props.match.params.slug
        const custom = this.props.match.params.custom
        const ref = custom === 'custom' ? 'custom_spells' : 'spell_data'
        Database.ref(ref).child(key).on('value', snapshot => {
            let spell = snapshot.val()
            if(spell){
                spell.key = key
                this.setState({ spell, loading: false })
            } else this.setState({ spell: null, loading: true })
        })
    }

    render() {
        const {spell, loading} = this.state
        return (
            <main>
                <Grid>
                    <Grid.Column width={1} />

                    <Grid.Column width={14} loading={loading}>
                        { spell && 
                            <SpellLayout spell={spell} backButton={true} history={this.props.history} />
                        }
                    </Grid.Column>
                </Grid>
            </main>
        )
    }
}
