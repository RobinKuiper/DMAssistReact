import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import { Database } from './../Lib/firebase'
import { Default, isMatchingDevice } from './../Lib/Responsive'

import MonsterLayout from './../Components/Monsters/MonsterLayout'

export default class MonsterModal extends Component {
    state = { monster: null, loading: true }

    componentWillMount(){
        const key = this.props.match.params.slug
        const custom = this.props.match.params.custom
        const ref = custom === 'custom' ? 'custom_monsters' : 'monster_data'
        Database.ref(ref).child(key).on('value', snapshot => {
            let monster = snapshot.val()
            if(monster){
                monster.key = key
                this.setState({ monster, loading: false })
            } else this.setState({ monster: null, loading: true })
        })
    }

    render() {
        const {monster, loading} = this.state
        return (
            <main>
                <Grid>
                    <Default>
                        <Grid.Column width={1} />
                    </Default>

                    <Grid.Column width={isMatchingDevice('DESKTOP') && 14} loading={loading}>
                        { monster && 
                            <MonsterLayout monster={monster} backButton={true} history={this.props.history} />
                        }
                    </Grid.Column>
                </Grid>
            </main>
        )
    }
}
