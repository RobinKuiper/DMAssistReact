import React, { Component } from 'react'
import { Divider, Grid, Header, Icon, Image, Label, List, Modal, Segment, Table } from 'semantic-ui-react'

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
                      {
                        spell.classes.map(c => (
                          <List.Item>{c}</List.Item>
                        ))
                      }
                      </List>
                    </Grid.Column>
                  </Grid>

                  <Divider />

                  <p>{spell.descriptions.main}</p>
                  { spell.descriptions.level &&
                    <div>
                      <Header.Subheader>At Higher Levels</Header.Subheader>
                      <p>{spell.descriptions.level}</p>
                    </div>
                  }

                  <Divider />

                  <List size='small' horizontal>
                  {
                    spell.components.map(component => (
                      <List.Item>
                        <Image size='mini' src={'./images/'+component+'.png'} />
                        <div>{component}</div>
                      </List.Item>
                    ))
                  }
                  {
                    spell.material &&
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

  listItems = (items) => {
    var r;
    for (var i = 0; i < items.length; i++) {
      r += <List.Item><strong>{items[i].name}</strong><span>{items[i].desc}</span></List.Item>
    }
    return r;
  }
}
