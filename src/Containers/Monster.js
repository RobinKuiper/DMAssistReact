import React, { Component } from 'react'
import { Grid, Header } from 'semantic-ui-react'
import { Database } from './../Lib/firebase'

import MonsterLayout from './../Components/MonsterLayout'

export default class MonsterModal extends Component {
    constructor(props){
        super(props)

        this.state = { monster: null }
    }

    componentWillMount() {
        const slug = this.props.match.params.slug
        Database.ref('monsters/'+slug).on('value', snapshot => {
            this.setState({ monster: snapshot.val() })
        })
    }

    render() {
        if(this.state.monster){
            const monster = this.state.monster
            return (
                <main>
                    <Grid>
                        <Grid.Column width={1} />

                        <Grid.Column width={14}>
                            <MonsterLayout monster={monster} backButton={true} history={this.props.history} />
                        </Grid.Column>
                    </Grid>
                </main>
            )
        } else {
            return (<Header>Monster not found</Header>)
        }
    }
}
