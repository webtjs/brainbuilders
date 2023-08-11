"use client";

import "../main-page/style1.css";
import Banner from "./Banner";
import FriendBar from "./FriendBar";
import Link from "next/link";
import Container from "@mui/material/Container";

/**
 * Layout for the friends page
 */
export default function Friends() {
  return (
    <main>
      <div className="App">
        <Banner />
        <Container maxWidth="sm">
          <FriendBar />
        </Container>
        <hr />
        <Link href="/main-page">Back to home</Link>
      </div>
    </main>
  );
}
