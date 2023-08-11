"use client";

//Import from MaterialUI
import { AppBar, Toolbar } from "@mui/material";


export default function Banner({ deckId }: { deckId: string }) {
  return (
    <header>
      <AppBar position="relative">
        <Toolbar>
          <strong>Edit {deckId}</strong>
        </Toolbar>
      </AppBar>
    </header>
  );
}
