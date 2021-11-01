import React, { useContext, useState, useEffect } from "react"
import { auth,firestore} from "../firebase"
import { updateDoc, setDoc, doc, getDoc } from "firebase/firestore";
import {  FacebookAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword}  from "firebase/auth";

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState("");
  const [userInfo, setUserInfo] = useState({});

  const signInWithFacebook = async () => {
    console.log(FacebookAuthProvider)
    const provider = new FacebookAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider)
        const user = result.user

        //Realtime Database functions
        // const dbRef = ref(db)
        // const snapshot = await get(child(dbRef, `users/${user.uid}`))
        // if (!snapshot.exists()) {
        //     try {
        //         await set(ref(db, 'users/' + user.uid), {
        //             username: user.displayName,
        //             email: user.email,
        //             profile_picture: user.photoURL,
        //             provider: "google"
        //         });

        //     } catch (err) {
        //         console.log(err)
        //     }
        // }

        try {
            await setDoc(doc(firestore, "users", user.uid), {
                username: user.displayName,
                email: user.email,
                profile_picture: user.photoURL,
                provider: "facebook"
            });
        } catch (e) {
            console.error("Error adding document: ", e);
        }
        setCurrentUser(user)
    } catch (err) {
        setAuthError(err.message)
    }

}
const logInWithEmail = async (email, password) => {
  try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user;
      console.log(user)
  }
  catch (error) {
      const errorMessage = error.message;
      setAuthError(errorMessage)
      setCurrentUser(null)
  }
}

const logOut = () => {
  signOut(auth).then(() => {
      setCurrentUser(null)
  }).catch((error) => {
      setAuthError(error)
  });
}

const updateUserInfo = async (name, address, age) => {
  try {

      //Realtime Database functions
      // await update(ref(db, 'users/' + currentUser.uid), {
      //     full_name: name,
      //     address: address,
      //     age: age
      // });

      await updateDoc(doc(firestore, "users", currentUser.uid), {
          full_name: name,
          address: address,
          age: age
      });
  } catch (err) {
      setAuthError(err)
  }
}

const getUserInfo = async () => {

  //Realtime Database functions
  // const dbRef = ref(db)
  // get(child(dbRef, `users/${currentUser.uid}`)).then((snapshot) => {
  //     if (snapshot.exists()) {
  //         setUserInfo(snapshot.val());
  //     } else {
  //         console.log("No data available");
  //     }
  // }).catch((error) => {
  //     console.error(error);
  // });

  const docRef = doc(firestore, "users", currentUser.uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
      setUserInfo(docSnap.data())
  } else {
      // doc.data() will be undefined in this case
      setAuthError("No user")
  }
}



  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password)
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  function logout() {
    return auth.signOut()
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email)
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    logInWithEmail,
    logOut,
    updatePassword,
    signInWithFacebook,
    updateUserInfo,
    getUserInfo,
    authError,
    userInfo

  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
