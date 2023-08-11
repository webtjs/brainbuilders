"use client";

import { AppBar, Toolbar } from "@mui/material";

/**
 * Displays a banner at the top of the page
 *
 * @param username The username of the user
 */
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
