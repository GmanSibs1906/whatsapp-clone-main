import '../styles/globals.css';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from '../firebase';
import Login from './login';
import Loading from '../components/Loading';
import { useEffect } from 'react';
import firebase from "firebase";

function MyApp({ Component, pageProps }) {
  // Check if there is a user logged on (install react-firebase-hooks)
  const [user, loading] = useAuthState(auth);

  // store users details (pro pic, name, data etc ) in users collection at signIn
  // useEffect used to triger piece of code at the components lifecycles (when ever the component in [] mounts in this case the "user")
  useEffect(() => {
    if (user) {
      db.collection("users").doc(user.uid).set({
        email: user.email,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        photoUrl: user.photoURL,
      }, { merge: true });
    }
  },[user]);

  //fix loading at page refresh
  if (loading) return <Loading />

  //if there is no user redirect to the Loigin page
  if (!user) return <Login />;

  //if there is a user return rest of the app
  return <Component {...pageProps} />
}

export default MyApp
