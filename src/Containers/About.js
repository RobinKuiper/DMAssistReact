import React, { Component } from 'react'
import { Divider, Grid, Header, Icon, List, Segment } from 'semantic-ui-react'

export default class About extends Component {
  render() {
    return (
      <main>
        <span>Version 0.2.2 Beta -</span>
        <Grid columns={1} textAlign='center'>
          <Grid.Column>
            <Segment raised style={{paddingTop: 30, paddingBottom: 30}}>
              <Header as='h1' style={{marginBottom: 50}}>
                Dungeon Master Assist
                <Header.Subheader>Making life of evil easier.</Header.Subheader>
              </Header>

              <List style={{marginBottom: 50}}>
                <List.Item>Made by Robin Kuiper</List.Item>
                <List.Item as='a' href='http://robinkuiper.nu' target='_blank'>
                  <Icon name='cloud' />
                  robinkuiper.nu
                </List.Item>
                <List.Item as='a' href='https://www.facebook.com/DMAssist5e' target='_blank'>
                  <Icon name='facebook' />
                  Facebook
                </List.Item>
                <List.Item as='a' href='skype:robinkuiper.eu?chat'>
                  <Icon name='skype' />
                  Skype Me!
                </List.Item>
                <List.Item as='a' href='https://discord.gg/VDqHRdz' target='_blank' title='Join our Discord!'>
                  <Icon name='text telephone' />
                  Join Discord!
                </List.Item>
                <List.Item as='a' href='https://trello.com/b/kjjqAYvx/dmassist' target='_blank' title='Roadmap!'>
                  <Icon name='trello' />
                  Trello
                </List.Item>
                <List.Item as='a' href='https://trello.com/b/kjjqAYvx/dmassist' target='_blank' title='Source at Github!'>
                  <Icon name='github' />
                  Github
                </List.Item>
              </List>

              <p><strong>Special thanks to:</strong><br />
              Jordy Kuiper & Dennis Siemons - Helped with all the monsters, spells & testing.</p>

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
