import React, { Component } from 'react'
import { Divider, Grid, Header, Icon, Image, Label, List, Modal, Segment } from 'semantic-ui-react'

export default class SpellModal extends Component {
  render() {
    const spell = this.props.spell

    return (
      <Modal closeIcon trigger={<Header sub style={{cursor: 'pointer'}}>{spell.name}</Header>}>
        <Modal.Content>
          { spell &&
            <Segment raised>
              <Label color='red' ribbon>{spell.level} {spell.school}</Label>
              <Header>{spell.name}</Header>
              <Segment.Group>
                <Segment>
                  <Grid columns={2}>
                    <Grid.Column>
                      <List>
                        <List.Item>
                          <Icon name='clock' />Casting Time: {spell.castingTime}
                        </List.Item>
                        <List.Item>
                          <Icon name='wifi' />Range: {spell.range}
                        </List.Item>
                        <List.Item>
                          <Icon name='history' />Duration: {spell.duration}
                        </List.Item>
                      </List>
                    </Grid.Column>

                    <Grid.Column>
                      <List>
                      { spell.classes &&
                          spell.classes.map(c => (
                            <List.Item>{c}</List.Item>
                          ))
                      }
                      </List>
                    </Grid.Column>
                  </Grid>

                  <Divider />

                  <this.Descriptions descriptions={spell.descriptions} />

                  <Divider />

                  <List size='small' horizontal>
                  { spell.components &&
                      spell.components.map(component => (
                        <List.Item>
                          <Image size='mini' src={'./images/'+component+'.png'} />
                          <div>{component}</div>
                        </List.Item>
                      ))
                  }
                  { spell.material &&
                      <List.Item><strong>Material</strong><span>{spell.material}</span></List.Item>
                  }
                  </List>

                  <Divider />
                </Segment>
              </Segment.Group>
            </Segment>
          }
        </Modal.Content>
      </Modal>
    )
  }

  Descriptions = (props) => {
    var main, level;
    if(props.descriptions){
      if(props.descriptions.main){
        main = <p>{props.descriptions.main}</p>
      }
      if(props.descriptions.level){
        level = (<div><Header.Subheader>At Higher Levels</Header.Subheader><p>{props.descriptions.level}</p></div>)
      }
    }
    return (
      <div>
        {main}
        {level}
      </div>
    );
  }
}
