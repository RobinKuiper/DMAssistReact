import firebase from 'firebase'

// Initialize Firebase
var config = {}

// TODO: CHANGE TO .ENV FILES
if(window && window.location && window.location.hostname === 'dmassist5e.firebaseapp.com'){
  config = {
    apiKey: "AIzaSyA_4Vn12xMBhQCCGFfBB12mNPwOulLq9wU",
    authDomain: "dmassist5e.firebaseapp.com",
    databaseURL: "https://dmassist5e.firebaseio.com",
    projectId: "dmassist5e",
    storageBucket: "dmassist5e.appspot.com",
    messagingSenderId: "647735221488"
  }
} else {
  config = {
    apiKey: "AIzaSyDr2iBwOXrZ4Ec1sykHI47Zmx3tUdi7LpU",
    authDomain: "dndassist-2870c.firebaseapp.com",
    databaseURL: "https://dndassist-2870c.firebaseio.com",
    projectId: "dndassist-2870c",
    storageBucket: "dndassist-2870c.appspot.com",
    messagingSenderId: "987962337354"
  }
}

firebase.initializeApp(config)

export const GoogleProvider = new firebase.auth.GoogleAuthProvider();
export const FacebookProvider = new firebase.auth.FacebookAuthProvider();
export const Auth = firebase.auth()
export const Database = firebase.database()
export default firebase
