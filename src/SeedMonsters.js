import React from 'react'
import firebase from './Lib/firebase'

export default class SeedMonsters extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      monster: '',
      seeding: false
    }
  }

  render() {
    return (
      <div>
        { this.state.seeding ?
            <div>
              <div>Seeding the DB...</div>
              <div>Monster: {this.state.monster}</div>
            </div>
          :
          <button onClick={this.seedMonsters.bind(this)}>Seed Monsters</button>
        }
      </div>
    )
  }

  seedMonsters(){
    this.setState({ seeding: true })
    for (var i = 0; i < monsters.length; i++) {
      this.setState({ monster: monsters[i].name })
      firebase.database().ref('monsters').push( monsters[i] )
    }
    this.setState({ seeding: false, monster: '' })
  }
}

var monsters = [{
  "name": "Aboleth",
  "size": "Large",
  "type": "aberration",
  "subtype": "",
  "alignment": "lawful evil",
  "armor_class": 17,
  "hit_points": 135,
  "hit_dice": "18d10",
  "speed": "10 ft., swim 40 ft.",
  "strength": 21,
  "dexterity": 9,
  "constitution": 15,
  "intelligence": 18,
  "wisdom": 15,
  "charisma": 18,
  "constitution_save": 6,
  "intelligence_save": 8,
  "wisdom_save": 6,
  "history": 12,
  "perception": 10,
  "damage_vulnerabilities": "",
  "damage_resistances": "",
  "damage_immunities": "",
  "condition_immunities": "",
  "senses": "darkvision 120 ft., passive Perception 20",
  "languages": "Deep Speech, telepathy 120 ft.",
  "challenge_rating": 30,
  "special_abilities": [
    {
      "name": "Amphibious",
      "desc": "The aboleth can breathe air and water.",
      "attack_bonus": 0
    },
    {
      "name": "Mucous Cloud",
      "desc": "While underwater, the aboleth is surrounded by transformative mucus. A creature that touches the aboleth or that hits it with a melee attack while within 5 ft. of it must make a DC 14 Constitution saving throw. On a failure, the creature is diseased for 1d4 hours. The diseased creature can breathe only underwater.",
      "attack_bonus": 0
    },
    {
      "name": "Probing Telepathy",
      "desc": "If a creature communicates telepathically with the aboleth, the aboleth learns the creature's greatest desires if the aboleth can see the creature.",
      "attack_bonus": 0
    }
  ],
  "actions": [
    {
      "name": "Multiattack",
      "desc": "The aboleth makes three tentacle attacks.",
      "attack_bonus": 0
    },
    {
      "name": "Tentacle",
      "desc": "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 12 (2d6 + 5) bludgeoning damage. If the target is a creature, it must succeed on a DC 14 Constitution saving throw or become diseased. The disease has no effect for 1 minute and can be removed by any magic that cures disease. After 1 minute, the diseased creature's skin becomes translucent and slimy, the creature can't regain hit points unless it is underwater, and the disease can be removed only by heal or another disease-curing spell of 6th level or higher. the creature is outside a body of water, it takes 6 (1d12) acid damage every 10 minutes unless moisture is applied to the skin before 10 minutes have passed.",
      "attack_bonus": 9,
      "damage_dice": "2d6",
      "damage_bonus": 5
    },
    {
      "name": "Tail",
      "desc": "Melee Weapon Attack: +9 to hit, reach 10 ft. one target. Hit: 15 (3d6 + 5) bludgeoning damage.",
      "attack_bonus": 9,
      "damage_dice": "3d6",
      "damage_bonus": 5
    },
    {
      "name": "Enslave (3/day)",
      "desc": "The aboleth targets one creature it can see within 30 ft. of it. The target must succeed on a DC 14 Wisdom saving throw or be magically charmed by the aboleth until the aboleth dies or until it is on a different plane of existence from the target. The charmed target is under the aboleth's control and can't take reactions, and the aboleth and the target can communicate telepathically with each other over any distance.\nWhenever the charmed target takes damage, the target can repeat the saving throw. On a success, the effect ends. No more than once every 24 hours, the target can also repeat the saving throw it is at least 1 mile away from the aboleth.",
      "attack_bonus": 0
    }
  ],
  "legendary_actions": [
    {
      "name": "Detect",
      "desc": "The aboleth makes a Wisdom (Perception) check.",
      "attack_bonus": 0
    },
    {
      "name": "Tail Swipe",
      "desc": "The aboleth makes one tail attack.",
      "attack_bonus": 0
    },
    {
      "name": "Psychic Drain (Costs 2 Actions)",
      "desc": "One creature charmed by the aboleth takes 10 (3d6) psychic damage, and the aboleth regains hit points equal to the damage the creature takes.",
      "attack_bonus": 0
    }
  ]
}]

for (var i = 0; i < monsters.length; i++) {
  var cr = monsters[i].challenge_rating;
  if(cr === '1/8' || cr === '1/4' || cr === '1/2'){
    monsters[i].challenge_rating = (cr === '1/8') ? 0.125 : (cr === '1/4') ? 0.25 : 0.5;
  }else{
    monsters[i].challenge_rating = Number.parseInt(cr, 10)
  }
  monsters[i].public = true;

}

console.log(monsters.length + ' monsters found')
