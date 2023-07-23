"use client";

import { useState, useEffect } from "react";
import { AppBar, Toolbar } from "@mui/material";

//Import from firebase
import { auth } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Banner({ username }: { username: string }) {
  return (
    <header>
      <AppBar position="relative">
        <Toolbar>
          <strong>Welcome, {username}. This is where you start.</strong>
        </Toolbar>
      </AppBar>
      <h1>Brain Builders</h1>
    </header>
  );
}
