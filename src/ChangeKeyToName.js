import React from 'react'
import firebase from './Lib/firebase'

export default class ChangeKeyToName extends React.Component {
  render() {
    return <button onClick={this.changeMonsterKeys}>Change Monster Keys</button>
  }

  changeMonsterKeys(){
    var monstersRef = firebase.database().ref('monsters')
    monstersRef.on('value', (snap) => {
      var monster = snap.val();
      var update = {};
      update[snap.key] = null;
      update[monster.name] = monster;
      monstersRef.update(update);
    })
  }
}
