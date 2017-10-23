import React from 'react'
import firebase from './Lib/firebase'

export default class ChangeKeyToName extends React.Component {
  render() {
    return <button onClick={this.changeMonsterKeys}>Change Monster Keys</button>
  }

  changeMonsterKeys(){
    alert('DO IT!')
    var monstersRef = firebase.database().ref('monsters')
    monstersRef.on('value', (snap) => {
      var monster = snap.val();

      if(monster.name.toLowerCase() !== snap.key.toLowerCase()){
        console.log(monster);

      }
    })
  }
}
