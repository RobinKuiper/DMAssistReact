import React, { Component } from 'react'
import { Divider, Grid, Header, Icon, List, Segment } from 'semantic-ui-react'

export default class About extends Component {
  render() {
    return (
      <main>
        <span>Version 0.1.7 Beta -</span>
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
                <List.Item as='a' href='skype:robinkuiper.eu?chat'>
                  <Icon name='skype' />
                  Skype Me!
                </List.Item>
                <List.Item as='a' href='https://discord.gg/VDqHRdz' target='_blank' title='Join our Discord!'>
                  <Icon name='text telephone' />
                  Join Discord!
                </List.Item>
              </List>

              <p><strong>Special thanks to:</strong><br />
              Jordy Kuiper & Dennis Siemons - Helped with all the monsters and spells.</p>

              <Divider />

              {/*<span>Online Users: 0</span>*/}

              <Header dividing>Changelog:</Header>
            </Segment>
          </Grid.Column>
        </Grid>
      </main>
    )
  }
}
