import { db, auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";

import {
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useState } from "react";
import { async } from "@firebase/util";

function App() {
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [id, setId] = useState("");

  const [update, setUpdate] = useState("");
  const [updatedAuthor, setUpdatedAuthor] = useState("");
  const [updatedTitle, setUpdatedTitle] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailIn, setEmailIn] = useState("");
  const [passwordIn, setPasswordIn] = useState("");

  //get the collection's ref
  const colRef = collection(db, "books");

  //(R) queries
  const q = query(colRef, "books", orderBy("createdAt", "asc"));

  //(R)get the collection data for real time db update (no refresh to see updates)
  const unsubCol = onSnapshot(q, (snapshot) => {
    //a snapshot of that collection in that moment and time where we'd have access to all its documents
    let books = [];
    snapshot.docs.forEach((doc) => {
      books.push({
        ...doc.data(), //title and author store in data
        id: doc.id,
      });
    });
    // console.log(books);

  });

  //(C) Create books
  const addBook = async (e) => {
    e.preventDefault();

    await addDoc(colRef, {
      title: title,
      author: author,
      createdAt: serverTimestamp(),
    });
    setTitle("");
    setAuthor("");
  };

  //(D) Delete books
  const deleteBook = async (e) => {
    e.preventDefault();
    const deleteRef = doc(db, "books", id);
    await deleteDoc(deleteRef);

    setId("");
  };

  //(U) Update a document
  const updateBook = async (e) => {
    e.preventDefault();
    const updateRef = doc(db, "books", update);
    await updateDoc(updateRef, {
      title: updatedTitle,
      author: updatedAuthor,
    });
    setUpdate("");
    setUpdatedAuthor("");
    setUpdatedTitle("");
  };

  // Fetching a single document (& realtime) instead of snapshot(all documents)
  const docRef = doc(db, "books", "Z9FENgDewc08ixPLQmDG");
  // // getDoc(docRef) -> this is one way
  // //   .then(doc => {
  // //     console.log(doc.data(), doc.id)
  // //   })
  const unsubDoc = onSnapshot(docRef, (doc) => {
    //this is another way
    console.log(doc.data(), doc.id);;
  });

  //signing users up
  const signupForm = async (e) => {
    e.preventDefault();

    await createUserWithEmailAndPassword(auth, email, password).then((cred) => {
      //user credential
      // console.log("user created:", cred.user);
      setEmail("");
      setPassword("");
    });
  };

  //log out
  const logout = async () => {
    await signOut(auth).then(() => {
      // console.log("signed out");
    });
  };

  //log in
  const loginForm = async (e) => {
    e.preventDefault();

    await signInWithEmailAndPassword(auth, emailIn, passwordIn)
      .then(cred => {
        // console.log('user logged in: ', cred.user);
        setEmailIn('');
        setPasswordIn('');
      })
      .catch(err => {
        console.log(err);
      })
  }

  //Auth changes (changes in state of auth)
  const unsubAuth = onAuthStateChanged(auth, (user) => {
    if(user) {
      console.log('user is signed in: ', user.uid);
    }else {
      console.log('user is signed out');
    }
  })

  const unsub = () => {
    console.log('unsubscribing');
    unsubCol();
    unsubDoc();
    unsubAuth();
  }


  return (
    <div className="App">
      <h1>Getting Started with Firebase 9</h1>
      <h2>Firebase Firestore</h2>

      <form onSubmit={addBook} className="add">
        <label for="title">Title:</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          name="title"
          required
        />
        <label for="author">Author:</label>
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          type="text"
          name="author"
          required
        />

        <button>add a new book</button>
      </form>

      <form onSubmit={deleteBook} className="delete">
        <label for="id">Document id:</label>
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          type="text"
          name="id"
          required
        />

        <button>delete a book</button>
      </form>

      <form onSubmit={updateBook} class="update">
        <label for="id">Document id:</label>
        <input
          value={update}
          onChange={(e) => setUpdate(e.target.value)}
          type="text"
          name="id"
          required
        />
        <label for="title">Title:</label>
        <input
          value={updatedTitle}
          onChange={(e) => setUpdatedTitle(e.target.value)}
          type="text"
          name="title"
          required
        />
        <label for="author">Author:</label>
        <input
          value={updatedAuthor}
          onChange={(e) => setUpdatedAuthor(e.target.value)}
          type="text"
          name="author"
          required
        />

        <button>update a book</button>
      </form>

      <h2>Firebase Auth</h2>

      <form onSubmit={signupForm} class="signup">
        <label for="email">email:</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
          name="email"
        />
        <label for="password">password:</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          type="password"
          name="password"
        />
        <button>signup</button>
      </form>

      <form onSubmit={loginForm} class="login">
        <label for="email">email:</label>
        <input
          value={emailIn}
          onChange={(e) => setEmailIn(e.target.value)}
          type="email"
          name="email"
        />
        <label for="password">password:</label>
        <input
          value={passwordIn}
          onChange={(e) => setPasswordIn(e.target.value)}
          type="password"
          name="password"
        />
        <button>login</button>
      </form>

      <button onClick={logout} class="logout">
        logout
      </button>

      <h2>Unsubscribing</h2>
      <button onClick={unsub} class="unsub">unsubscribe from db/auth changes</button>
    </div>
  );
}

export default App;
