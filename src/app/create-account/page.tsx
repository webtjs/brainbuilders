"use client";

import { auth } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { useState } from "react";
import { redirect } from "next/navigation";
import "./style3.css";

//MUI import for aesthetic features
import  Button from "@mui/material/Button";
import  TextField  from "@mui/material/TextField";
import InputAdornment from '@mui/material/InputAdornment';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


export default function CreateAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [haveUser, setHaveUser] = useState(false);

  const signUp = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await createUserWithEmailAndPassword(auth, email, password).catch((err) => {
      console.log(err);
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
                <AccountCircleIcon />
              </InputAdornment>
            ),
          }}
          onChange={(e) => setEmail(e.target.value)}
          helperText="Input your email as username"
          label="Email..."
          variant="outlined"
          type="email"
          
        />
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
        <Button variant="contained" type="submit">Sign up</Button>
      </form>

    <hr></hr>

      <a href="/">Login page</a>
    </div>
  );
}
