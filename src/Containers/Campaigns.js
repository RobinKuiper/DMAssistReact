import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import { Button, Grid, Segment } from 'semantic-ui-react'

import Add from './Campaigns/AddCampaign'
import Overview from './Campaigns/Overview'

export default class Campaigns extends Component {
  constructor(props){
    super(props)

    this.state = {
      loaded: true
    }
  }

  render() {
    return (
      <main>
      <Router>
        <Grid columns={1}>
          <Grid.Column>
            <Segment.Group raised>
              <Segment className='panel header' textAlign='center' inverted clearing>
                Campaigns

                <Link to='/campaigns/add'>
                  <Button icon='add' color='green' floated='right' inverted circular />
                </Link>
              </Segment>

              <Segment className='panel content' loading={!this.state.loaded}>
                <Route path='/campaigns/add' component={Add} />
                <Route path='/campaigns/overview' component={Overview} />
              </Segment>

              <Segment className='panel bottom' clearing></Segment>
            </Segment.Group>
          </Grid.Column>
        </Grid>
      </Router>
      </main>
    )
  }
}
