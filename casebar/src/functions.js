import { firebaseAuth, ref, database } from './fire'

export function SignupWithEmail(email, pw){
  console.log(email);
  firebaseAuth.createUserWithEmailAndPassword(email, pw).catch(function(error) {
	   var errorMsg = error.message;
	   console.log(errorMsg);
  },false).then(saveUser);
}

export function logout(){
  firebaseAuth.signOut().then(function() {
    console.log("User sign out!");
  }, function(error) {
    console.log("User sign out error!");
  })
}

export function LoginWithEmail(email, pw){
  console.log(email);
  firebaseAuth.signInWithEmailAndPassword(email, pw).catch(function(error) {
        var errorMessage = error.message;
        console.log(errorMessage);
      });
}

export function resetPassword (email) {
  return firebaseAuth().sendPasswordResetEmail(email)
}

export function saveUser (user) {
  return ref.child(`users/${user.uid}/info`)
  .set({
    email: user.email,
    uid: user.uid
  })
  .then(() => user)
}

/*
export function onCommentSubmit(title, text){

 // console.log(title);
 // console.log(text);
  //var time = database.ServerValue.TIMESTAMP
  return ref.child(`posts/${firebaseAuth.currentUser.uid}`)
  .set({
    title: title,
    text: text,
    user: firebaseAuth.currentUser.uid,
    //timestamp:time
  })
  .then(() => title)
}

export function checkAuth(){
  if(firebaseAuth.currentUser.email==null){
    alert("請先登入")
  }
}
*/
