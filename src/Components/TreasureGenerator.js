import React, { Component } from 'react'
import { Button, Grid, Header, List, Statistic } from 'semantic-ui-react'
import { Form } from 'formsy-semantic-ui-react'

import Panel from './../Components/UI/Panel'
import {Generator} from './../Lib/TreasureGenerator'

export default class TreasureGenerator extends Component {
  constructor(props) {
    super(props)

    this.state = {
      challenge_rating: 1,
      percentage: 0,
    }
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  render = () => <Panel title='Treasure Generator' content={this.content.bind(this)} />

  content() {
    let crOptions = []
    for(var i = 1; i <= 20; i++){
      crOptions.push({ key: i, value: i, text: i === 20 ? i + '+' : i })
    }

    let percentageOptions = []
    for(var j = 10; j <= 90; j += 10){
      percentageOptions.push({ key: j, value: j, text: j + '%' })
    }

    return (
      <div>
        <Grid relaxed='very'>
          <Grid.Column width={3}>
            <Form onValidSubmit={() => this.setState({ treasure: Generator([this.state.challenge_rating], this.state.percentage) })}>
              <Form.Select
                name='challenge_rating'
                options={crOptions}
                label='Challenge Rating'
                value={this.state.challenge_rating}
                onChange={this.handleChange}
              />
              <Form.Select
                name='percentage'
                options={percentageOptions}
                pladeholder='0%'
                label='Trade Percentage'
                value={this.state.percentage}
                onChange={this.handleChange}
              />
            </Form>
            <Button style={{marginTop: 10}} type='submit' positive content='Generate Treasure' icon='diamond' onClick={() => this.setState({ treasure: Generator([this.state.challenge_rating], this.state.percentage) })} />
          </Grid.Column>

          <Grid.Column width={2}></Grid.Column>

          <Grid.Column width={10}>
            { this.state.treasure && (
              <div>
                <Header>Currency</Header>
                <Statistic.Group>
                  { this.state.treasure.cp !== 0 && (
                    <Statistic>
                      <Statistic.Value>{this.state.treasure.cp}</Statistic.Value>
                      <Statistic.Label>CP</Statistic.Label>
                    </Statistic>
                  )}
                  { this.state.treasure.sp !== 0 && (
                    <Statistic>
                      <Statistic.Value>{this.state.treasure.sp}</Statistic.Value>
                      <Statistic.Label>SP</Statistic.Label>
                    </Statistic>
                  )}
                  { this.state.treasure.ep !== 0 && (
                    <Statistic>
                      <Statistic.Value>{this.state.treasure.ep}</Statistic.Value>
                      <Statistic.Label>EP</Statistic.Label>
                    </Statistic>
                  )}
                  { this.state.treasure.gp !== 0 && (
                    <Statistic>
                      <Statistic.Value>{this.state.treasure.gp}</Statistic.Value>
                      <Statistic.Label>GP</Statistic.Label>
                    </Statistic>
                  )}
                  { this.state.treasure.pp !== 0 && (
                    <Statistic>
                      <Statistic.Value>{this.state.treasure.pp}</Statistic.Value>
                      <Statistic.Label>PP</Statistic.Label>
                    </Statistic>
                  )}
                </Statistic.Group>

                <Grid columns={2}>
                  { this.state.treasure.gem && this.state.treasure.gem.length > 0 && (
                    <Grid.Column>
                      <List>
                        <List.Item><Header.Subheader>Gems</Header.Subheader></List.Item>
                        { this.state.treasure.gem.map(item => (<List.Item>{item}</List.Item>))}
                      </List>
                    </Grid.Column>
                  )}

                  { this.state.treasure.art && this.state.treasure.art.length > 0 && (
                    <Grid.Column>
                      <List>
                        <List.Item><Header.Subheader>Art</Header.Subheader></List.Item>
                        { this.state.treasure.art.map(item => (<List.Item>{item}</List.Item>))}
                      </List>
                    </Grid.Column>
                  )}
                </Grid>
              </div>
            )}
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}