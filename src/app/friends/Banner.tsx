"use client";

import { AppBar, Toolbar } from "@mui/material";

export default function Banner() {
  return (
    <header>
      <AppBar position="relative">
        <Toolbar>
          <strong>Friend list</strong>
        </Toolbar>
      </AppBar>
    </header>
  );
}
