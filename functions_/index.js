const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

/*exports.updateMonsterStatistic = functions.database.ref('monsters')
  .onWrite(e => {
    //const newMonster = e.data.val();
    return e.data.ref.parent().child('statistics/monsters_count').set(e.data.numChildren());
  })

exports.updateSpellStatistics = functions.database.ref('spells')
  .onWrite(e => {
    //const newMonster = e.data.val();
    return e.data.ref.parent().child('statistics/spells_count').set(e.data.numChildren());
  })*/
