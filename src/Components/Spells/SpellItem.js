import React from 'react'
import { Item } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import { formatSpellLevel } from './../../Lib/Common'

export const SpellItem = ({ spell }) => (
    <Item key={spell.key}>
      <Item.Content  as={Link} to={spell.custom ? '/spell/'+spell.key+'/custom' : '/spell/'+spell.key}>
        <Item.Header>{spell.name}</Item.Header>
        <Item.Meta>{formatSpellLevel(spell.level)} level {spell.school}</Item.Meta>
      </Item.Content>
    </Item>
)