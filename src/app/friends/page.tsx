"use client";

import "../main-page/style1.css";
import Banner from "./Banner";
import FriendBar from "./FriendBar";
import Link from "next/link";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

export default function Friends() {
  const data = { John: "fren", Jack: "fren", Ben: "fren" };
  const result = Object.keys(data);
  console.log(result);

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
