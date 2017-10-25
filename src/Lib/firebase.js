import firebase from 'firebase'

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDr2iBwOXrZ4Ec1sykHI47Zmx3tUdi7LpU",
    authDomain: "dndassist-2870c.firebaseapp.com",
    databaseURL: "https://dndassist-2870c.firebaseio.com",
    projectId: "dndassist-2870c",
    storageBucket: "dndassist-2870c.appspot.com",
    messagingSenderId: "987962337354"
  };

firebase.initializeApp(config)

export const GoogleProvider = new firebase.auth.GoogleAuthProvider();
export const FacebookProvider = new firebase.auth.FacebookAuthProvider();
export const Auth = firebase.auth()
export default firebase
