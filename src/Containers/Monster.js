import React, { Component } from 'react'
import { Grid, Header } from 'semantic-ui-react'
import { Database } from './../Lib/firebase'

import MonsterLayout from './../Components/MonsterLayout'

export default class MonsterModal extends Component {
    state = { monster: null, loading: true }

    componentWillMount(){
        const slug = this.props.match.params.slug
        const custom = this.props.match.params.custom
        const ref = custom === 'custom' ? 'custom_monsters' : 'monster_data'
        Database.ref(ref).child(slug).on('value', snapshot => {
            this.setState({ monster: snapshot.val(), loading: false })
        })
    }

    render() {
        const {monster, loading} = this.state
        return (
            <main>
                <Grid>
                    <Grid.Column width={1} />

                    <Grid.Column width={14} loading={loading}>
                        { monster && 
                            <MonsterLayout monster={monster} backButton={true} history={this.props.history} />
                        }
                    </Grid.Column>
                </Grid>
            </main>
        )
    }
}
