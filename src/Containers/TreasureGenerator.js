import React, { Component } from 'react'
import { Button, Grid, Header, List, Statistic } from 'semantic-ui-react'
import { Form } from 'formsy-semantic-ui-react'

import Generator from './../Components/TreasureGenerator'

import Panel from './../Components/UI/Panel'
import Dice from './../Lib/Dice'

const TreasureGenerator = () => (
  <main>
    <Generator />
  </main>
)

export default TreasureGenerator