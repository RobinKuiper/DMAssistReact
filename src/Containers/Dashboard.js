import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Grid, Icon, List, Message, Statistic } from 'semantic-ui-react'
import { Auth } from './../Lib/firebase'
import Adsense from './../Components/Adsense'
import Panel from './../Components/UI/Panel'

import TreasureGenerator from './../Components/TreasureGenerator'

import SpellModal from './../Components/SpellModal'

import LoginModal from './../Components/Auth/LoginModal'

export default class Dashboard extends Component {
  constructor(props){
    super(props)

    this.state = {
      showMessage: localStorage.getItem('showMessage') === 'false' ? false : true
    }
  }

  render() {
    return (
      <main>

        <Grid stackable>
          <Grid.Column width={6}>
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  <Panel title={'Campaigns'} content={this.renderCampaigns.bind(this)} footer={false} loaded={true} />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column>
                  <Panel title={'Latest Monsters'} content={this.renderMonsters.bind(this)} footer={false} loaded={true} />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column>
                  <Panel title={'Latest Spells'} content={this.renderSpells.bind(this)} footer={false} loaded={true} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>

          <Grid.Column width={10} as={Grid}>
            <Grid.Row>
              <Grid.Column>
                <TreasureGenerator />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column>
                <Panel title={'Statistics'} content={this.renderStatistics.bind(this)} footer={false} loaded={true} />
              </Grid.Column>
            </Grid.Row>
          </Grid.Column>
        </Grid>

        { this.state.showMessage && (
          <Message info icon onDismiss={() => { 
            this.setState({ showMessage: false })
            localStorage.setItem('showMessage', false);
          }}>
            <Icon name='info' />
            <Message.Content>
              <Message.Header>Why were some monsters/spells removed?</Message.Header>
              <p>I have decided to remove all none SRD (System Reference Document) monsters/spells from this tool. This is to prevent getting into copyright trouble with Wizards of the Coast.</p>
              <p>Custom monster will be added soon, this way you can make every monster from every source without putting this tool at risk.</p>
              <p>Thank you for your understanding.</p>
            </Message.Content>
          </Message>
        )}

        { process.env.NODE_ENV !== "development" &&
          <Adsense client='ca-pub-2044382203546332' slot='7541388493' style={{marginTop: 40, width: 728, height: 90}} />
        }
      </main>
    )
  }

  renderCampaigns = () => {
    if(Auth.currentUser){
      return (
        <List>
        { this.props.campaigns.length !== 0 ?
            this.props.campaigns.slice(this.props.campaigns.length-5, this.props.campaigns.length).map(item => {
              return <List.Item as={Link} to={'/campaign/'+item.slug} key={item.slug}>{item.name}</List.Item>
            })
          :
            <List.Item>You don't have any campaigns yet.</List.Item>
        }
        </List>
      )
    }else{
      return (
        <p>Please <LoginModal trigger={<span style={{textDecoration: 'underline', cursor: 'pointer'}}>Sign In</span>} /> to see your campaigns</p>
      )
    }
  }

  renderMonsters = () => (
    <List>
    { this.props.monsters.slice(this.props.monsters.length-5, this.props.monsters.length).map(item => 
      <List.Item as={Link} to={'/monster/'+item.slug} key={item.slug}>{item.name}</List.Item>
    )}
    </List>
  )

  renderSpells = () => (
    <List>
    { this.props.spells.slice(this.props.spells.length-5, this.props.spells.length).map(item =>
      <SpellModal key={item.slug} spell={item} trigger={<List.Item as='a'>{item.name}</List.Item>} />
    )}
    </List>
  )

  renderStatistics = () => (
    <div>
      <Statistic.Group>
        <Statistic as={Link} to='/monsters'>
          <Statistic.Value>{this.props.monsters.length}</Statistic.Value>
          <Statistic.Label>Monsters</Statistic.Label>
        </Statistic>

        <Statistic as={Link} to='/spells'>
          <Statistic.Value>{this.props.spells.length}</Statistic.Value>
          <Statistic.Label>Spells</Statistic.Label>
        </Statistic>

        <Statistic as={Link} to='/monsters'>
          <Statistic.Value>0</Statistic.Value>
          <Statistic.Label>My Monsters</Statistic.Label>
        </Statistic>

        <Statistic as={Link} to='/spells'>
          <Statistic.Value>0</Statistic.Value>
          <Statistic.Label>My Spells</Statistic.Label>
        </Statistic>

        <Statistic as={Link} to='/campaigns'>
          <Statistic.Value>{this.props.campaigns.length}</Statistic.Value>
          <Statistic.Label>My Campaigns</Statistic.Label>
        </Statistic>
      </Statistic.Group>
    </div>
  )
}
