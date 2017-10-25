import React, { Component } from 'react'
import { Divider, Grid, Header, Icon, List, Segment } from 'semantic-ui-react'

export default class About extends Component {
  render() {
    return (
      <main>
        <Grid columns={1} textAlign='center'>
          <Grid.Column>
            <Segment raised style={{paddingTop: 30, paddingBottom: 30}}>
              <Header as='h1' style={{marginBottom: 50}}>
                Dungeon Master Assist
                <Header.Subheader>Making life of evil easier.</Header.Subheader>
              </Header>

              <List style={{marginBottom: 50}}>
                <List.Item>Made by Robin Kuiper</List.Item>
                <List.Item as='a' href='http://rgjkuiper.nl' target='_blank'>
                  <Icon name='cloud' />
                  rgjkuiper.nl
                </List.Item>
                <List.Item as='a' href='mailto:robingjkuiper@gmail.com'>
                  <Icon name='mail' />
                  info@rgjkuiper.nl
                </List.Item>
                <List.Item as='a' href='https://discord.gg/VDqHRdz' target='_blank' title='Join our Discord!'>
                  <Icon name='text telephone' />
                  Join Discord!
                </List.Item>
              </List>

              <Divider />

              <span>Online Users: 0</span>

              <Header divided>Changelog:</Header>
            </Segment>
          </Grid.Column>
        </Grid>
      </main>
    )
  }
}
