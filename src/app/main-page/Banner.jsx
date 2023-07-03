"use client";

import { useState } from "react";
import { AppBar, Toolbar } from "@mui/material";

//Import from firebase
import {getAuth, onAuthStateChanged} from "firebase/auth";

export default function Banner() {
  const [name, setName]  = useState("anonymous user") ;

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    setName(user.email);
  }else {
    //nothing happens
  }
})

  return (
    <header>
      <AppBar position="relative">
        <Toolbar>
          <strong>Welcome, {name}. This is where you start.</strong>
        </Toolbar>
      </AppBar>
      <h1>Brain Builders</h1>
    </header>
  );
}
