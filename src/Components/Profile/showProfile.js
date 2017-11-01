import React, { Component } from 'react'
import { Database, Auth } from './../../Lib/firebase'
import { Divider, Header, Image, Segment } from 'semantic-ui-react'

export default class ShowProfile extends Component {
    constructor(props){
        super(props)

        this.state = {
            user: null
        }
    }

    render() {
        return (
            <main>
                <Segment loading={!this.state.user} textAlign='center'>
                    <Image centered size='medium' src={this.state.user && this.state.user.photoURL} />
                    <Header as='h1'>{this.state.user && (this.state.user.displayName || this.state.user.email)}</Header>

                    <Divider />

                    <p>{this.state.profile && this.state.profile.bio}</p>
                </Segment>
            </main>
        )
    }

    componentDidMount() {
        Auth.onAuthStateChanged((user) => {
            if (user){
                Database.ref('userdata/'+user.uid+'/profile').on('value', snapshot =>{
                    this.setState({ profile: snapshot.val() })
                })
                this.setState({ user, loading: false })
            }
        })
    }
}