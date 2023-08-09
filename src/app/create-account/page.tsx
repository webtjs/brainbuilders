"use client";

import { auth, db } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import "./style3.css";

//MUI import for aesthetic features
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import EmailIcon from "@mui/icons-material/Email";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function CreateAccount() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [haveUser, setHaveUser] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const signUp = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const usernameRef = doc(db, "usernames", username);
    const usernameExist = (await getDoc(usernameRef)).exists();
    if (usernameExist) {
      setUsernameError("Username already exists");
      setEmailError("");
      return;
    }
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCred) => {
        await setDoc(usernameRef, {
          email: email,
          userId: userCred.user.uid,
        }).catch((err) => console.error(err));
        const userRef = doc(db, userCred.user.uid, "profile");
        await setDoc(userRef, { username: username }).catch((err) =>
          console.error(err)
        );
      })
      .catch((err) => {
        console.log(err.code);
        if (err.code == "auth/email-already-in-use") {
          setEmailError("Email is already in use");
          setUsernameError("");
        }
      });
  };

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setHaveUser(true);
    }
  });

  if (haveUser) {
    redirect("/");
  }

  return (
    <div className="sign-up-container">
      <h1>BrainBuilders</h1>
      <h2>Create an account</h2>
      <form onSubmit={signUp}>
        <br />
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
          onChange={(e) => setEmail(e.target.value)}
          helperText="Input your email"
          label="Email..."
          variant="outlined"
          type="email"
        />
        {emailError && <div className="error">{emailError}</div>}
        <br />
        <br />
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircleIcon />
              </InputAdornment>
            ),
          }}
          onChange={(e) => setUsername(e.target.value)}
          helperText="Input your username"
          label="Username..."
          variant="outlined"
          type="username"
        />
        {usernameError && <div className="error">{usernameError}</div>}
        <br />
        <br />
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockPersonIcon />
              </InputAdornment>
            ),
          }}
          onChange={(e) => setPassword(e.target.value)}
          label="Password..."
          variant="outlined"
          type="password"
          InputLabelProps={{
            shrink: true,
          }}
          helperText="Please input password"
        />
        <br />
        <br></br>
        <Button variant="contained" type="submit">
          Sign up
        </Button>
      </form>

      <hr></hr>

      <Link href="/">Login page</Link>
    </div>
  );
}
