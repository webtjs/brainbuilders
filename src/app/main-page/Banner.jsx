"use client";

import { useState } from "react";
import { AppBar, Toolbar } from "@mui/material";
import CreationPage from "./CreationPage";
import  Button from "@mui/material/Button";

export default function Banner() {
  const nameState = useState("<Anonymous user>");
  const name = nameState[0];
  const setName = nameState[1];

  return (
    <header>
      <AppBar position="relative">
        <Toolbar>
          <strong>Welcome, {name}. This is where you start.</strong>
        </Toolbar>
      </AppBar>
      <h1>Brain Builders</h1>
      <Button variant="outlined" href="/create-cards">Make cards</Button>
      &ensp;
      &ensp;
      <Button variant="outlined" href="/start-practice">Start practicing</Button>
    </header>
  );
}