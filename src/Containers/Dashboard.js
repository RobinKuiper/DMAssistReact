import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Grid, Header, Icon, Image, Item, List, Message, Segment } from 'semantic-ui-react'
import { Auth, Database } from './../Lib/firebase'
import Panel from './../Components/UI/Panel'

import LoginModal from './../Components/Auth/LoginModal'
import Affiliate from './../Components/Affiliate'

import CampaignSS from './../Images/Screenshots/campaign.png'
import MonstersSS from './../Images/Screenshots/monsters.png'
import NoCampaignImage from './../Images/no-campaign-image.jpg'

import { Lightbox } from './../Components/UI/Lightbox'

export default class Dashboard extends Component {
  constructor(props){
    super(props)

    this.state = {
      showMessage: localStorage.getItem('showMessage') === 'false' ? false : true,
      loading_campaigns: true,
    }
  }

  render() {
    return (
      <main>
        <Grid stackable>
          <Grid.Column width={10}>
            <Segment raised>
              <Header dividing>
                DMAssist
                <Header.Subheader>Making life of evil easier!</Header.Subheader>
              </Header>

              <p>This tool is designed to help good dungeon master be even better!</p>

              <p>
                You can keep track of your turnorder, create monster encounters which your players can fight, lookup the spells you want to use against them, etc.
              </p>
              <p>
                At the moment this is a beta version and more futures are incoming!
              </p>

              <Image.Group size='medium'>
                <Lightbox src={CampaignSS} trigger={(<Image src={CampaignSS} bordered title="Campaign Screenshot" />)} />
                <Lightbox src={MonstersSS} trigger={(<Image src={MonstersSS} bordered title="Monsters screenshot" />)} />
              </Image.Group>
            </Segment>
          </Grid.Column>

          <Grid.Column width={6}>
            <Panel title={'Your Campaigns'} content={this.renderCampaigns.bind(this)} footer={false} />

            <Affiliate 
              title='Get the new Aliens comic book series!' 
              alt='Get the new Aliens comic book series!' 
              url='http://shareasale.com/r.cfm?b=188076&amp;u=1651477&amp;m=8908&amp;urllink=&amp;afftrack=' 
              image='https://i.shareasale.com/image/728_aliens3.gif'
            />
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
              <p>But you can make your own custom monsters/spells, this way you can make every monster/spell from every source without putting this tool at risk.</p>
              <p>Thank you for your understanding.</p>
            </Message.Content>
          </Message>
        )}
      </main>
    )
  }

  renderCampaigns = () => {
    if(Auth.currentUser){
      return (
        <Grid stackable>
        { this.state.campaigns  ?
            Object.keys(this.state.campaigns).map(key => {
              let item = this.state.campaigns[key]
              
              return (
                <Grid.Column as={Link} to={'/campaign/'+key} computer={4} textAlign='center'>
                  <Image src={item.pictureURL || NoCampaignImage} fluid />
                  <Header>{item.name}</Header>
                </Grid.Column>
              )
            })
          :
            <Item>You don't have any campaigns yet.</Item>
        }
        </Grid>
      )
    }else{
      return (
        <p>Please <LoginModal trigger={<span style={{textDecoration: 'underline', cursor: 'pointer'}}>Sign In</span>} /> to see your campaigns</p>
      )
    }
  }

  componentDidMount() {
    Auth.onAuthStateChanged((user) => {
      if (user){
        Database.ref('userdata').child(user.uid).child('campaigns').on('value', snapshot => {
          this.setState({ campaigns: snapshot.val() })
        })
      }
    })
  }
}