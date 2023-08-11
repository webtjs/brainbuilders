"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { redirect } from "next/navigation";
import Link from "next/link";
import "./style.css";

//Things from material MUI
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";
import DeleteIcon from "@mui/icons-material/Delete";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import LockPersonIcon from "@mui/icons-material/LockPerson";

/**
 * Login page of the application
 */
export default function Login() {
  const [loginCred, setLoginCred] = useState("");
  const [password, setPassword] = useState("");
  const [haveUser, setHaveUser] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const regex =
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  /**
   * Enable user to be authenticated based on the input in the login field
   * 
   * @param[in] e Event interface
   * @returns Redirects to the main page of the app if logged in successfully, else
   *          show an error message
   */
  const signIn = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    var email = loginCred;
    if (!regex.test(email)) {
      const usernameRef = doc(db, "usernames", loginCred);
      const usernameDoc = await getDoc(usernameRef);
      if (!usernameDoc.exists()) {
        setErrorMessage("Username not found");
        return;
      }
      email = usernameDoc.data().email;
    }
    await signInWithEmailAndPassword(auth, email, password).catch((err) => {
      console.log(err.code);
      if (err.code == "auth/user-not-found") {
        setErrorMessage("Email not found, please check again.");
      } else if (err.code == "auth/wrong-password") {
        setErrorMessage("Wrong password, please try again.");
      }
    });
  };

  /**
   * Set the login state of the user
   */
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setHaveUser(true);
    } else {
      console.log("no user");
    }
  });

  if (haveUser) {
    redirect("/main-page");
  }

  return (
    <div className="login">
      <h1>BrainBuilders</h1>
      <h2>Login page</h2>
      <form onSubmit={signIn}>
        <br />
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircleIcon />
              </InputAdornment>
            ),
          }}
          helperText="Input your email or username"
          label="Email / Username..."
          variant="outlined"
          type="text"
          onChange={(e) => setLoginCred(e.target.value)}
        />
        {errorMessage && <div className="error">{errorMessage}</div>}
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
          label="Password..."
          variant="outlined"
          type="password"
          InputLabelProps={{
            shrink: true,
          }}
          helperText="Please input password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />
        <br />
        <Button variant="contained" type="submit" endIcon={<LoginIcon />}>
          Sign In
        </Button>
        &ensp;
        <Button variant="contained" type="reset" endIcon={<DeleteIcon />}>
          Reset
        </Button>
      </form>
      <br />
      <hr></hr>
      <Link href="/create-account">New Account?</Link>
      <br />
    </div>
  );
}
