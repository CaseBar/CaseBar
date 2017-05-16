import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyDffNVstURoF617QjjvJmTR9_VBwjjkcZo",
    authDomain: "casebar-db161.firebaseapp.com",
    databaseURL: "https://casebar-db161.firebaseio.com",
    projectId: "casebar-db161",
    storageBucket: "casebar-db161.appspot.com",
    messagingSenderId: "115210174900"
  };
var fire = firebase.initializeApp(config);
export default fire;
export const database = firebase.database();
export const ref = firebase.database().ref()
export const firebaseAuth = firebase.auth()