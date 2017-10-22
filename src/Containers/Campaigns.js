import React, { Component } from 'react'

import { Auth } from './../Lib/firebase'

import { Button, Grid, Segment } from 'semantic-ui-react'

import Add from './Campaigns/AddCampaign'
import Overview from './Campaigns/Overview'

export default class Campaigns extends Component {
  constructor(props){
    super(props)

    this.state = {
      user: Auth.currentUser,
      loaded: true,
      add: false
    }
  }

  render() {
    return (
      <main>
        <Grid columns={1}>
          <Grid.Column>
            <Segment.Group raised>
              <Segment className='panel header' textAlign='center' inverted clearing>
                Campaigns

                <Button icon='add' color='green' floated='right' inverted circular onClick={() => this.setState({add: true})} />
              </Segment>

              <Segment className='panel content' loading={!this.state.loaded}>
                { this.state.user ?
                    this.state.add ? <Add />
                    : <Overview />
                  : <div>Login</div>
                }
              </Segment>

              <Segment className='panel bottom' clearing></Segment>
            </Segment.Group>
          </Grid.Column>
        </Grid>
      </main>
    )
  }

  componentDidMount() {
    Auth.onAuthStateChanged((user) => {
      if (user){
        this.setState({ user })
      }
    })
  }
}
