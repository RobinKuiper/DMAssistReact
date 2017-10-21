import React, { Component } from 'react'

import { Container } from 'semantic-ui-react'

import Dice from './../Lib/Dice'

export default class Campaigns extends Component {
  render() {
    var roll = Dice.roll(1, 6);

    return (
      <Container id="main">
        <h1>Campaigns Bitch!</h1>
        <span>Roll 1d6: {roll}</span>
      </Container>
    )
  }
}
