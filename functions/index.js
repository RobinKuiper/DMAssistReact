const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

/*exports.updateMonsterStatistic = functions.database.ref('monsters')
.onWrite(e => {
  return e.data.ref.parent.child('statistics/monsters').set(e.data.numChildren());
})

exports.updateCustomMonsterStatistic = functions.database.ref('public_monsters')
  .onWrite(e => {
    return e.data.ref.parent.child('statistics/custom_monsters').set(e.data.numChildren());
  })

exports.updateSpellStatistic = functions.database.ref('spells')
.onWrite(e => {
  return e.data.ref.parent.child('statistics/spells').set(e.data.numChildren());
})

exports.updateCustomSpellStatistic = functions.database.ref('public_spells')
  .onWrite(e => {
    return e.data.ref.parent.child('statistics/custom_spells').set(e.data.numChildren());
  })

exports.updateUserSpellStatistic = functions.database.ref('userdata/{uid}/spells/')
  .onWrite(e => {
    return e.data.ref.parent.child('statistics/spells').set(e.data.numChildren());
  })

exports.updateUserMonsterStatistic = functions.database.ref('userdata/{uid}/monsters/')
  .onWrite(e => {
    return e.data.ref.parent.child('statistics/monsters').set(e.data.numChildren());
  })

exports.updateUserCampaignStatistic = functions.database.ref('userdata/{uid}/campaigns/')
  .onWrite(e => {
    return e.data.ref.parent.child('statistics/campaigns').set(e.data.numChildren());
  })

exports.updateUserEncounterStatistic = functions.database.ref('userdata/{uid}/encounters/')
  .onWrite(e => {
    return e.data.ref.parent.child('statistics/encounters').set(e.data.numChildren());
  })*/
