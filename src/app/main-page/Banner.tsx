"use client";

import { useState } from "react";
import { AppBar, Toolbar } from "@mui/material";

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
    </header>
  );
}
