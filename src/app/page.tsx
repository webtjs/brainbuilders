"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase";
import { redirect } from "next/navigation";
import "./style.css";

//Things from material MUI
import  Button from "@mui/material/Button";
import LoginIcon from '@mui/icons-material/Login';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import  TextField  from "@mui/material/TextField";
import InputAdornment from '@mui/material/InputAdornment';
import LockPersonIcon from '@mui/icons-material/LockPerson';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [haveUser, setHaveUser] = useState(false);

  const signIn = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password).catch((err) => {
      console.log(err);
    });
  };

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
          helperText="Input your email as username"
          label="Email..."
          variant="outlined"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
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
        <Button variant="contained" type="submit" endIcon={<LoginIcon />}>Sign In</Button>
        &ensp;
        <Button variant="contained" type="reset" endIcon={<DeleteIcon />}>Reset</Button>
      </form>
      <br />
      <hr></hr>
      <a href="/create-account"> New Account? </a> <br />
      <a href="https://www.google.co.nz"> Remember password? </a>
    </div>
  );
}
