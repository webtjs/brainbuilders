import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import Typography from "@mui/material/Typography";

/**
 * Search bar for users to enter their friend's username and add them
 *
 * @param userId User's uuid which is set by firebase
 * @returns
 */
export default function FriendSearch({ userId }: { userId: string }) {
  const [friendName, setFriendName] = useState("");
  const [error, setError] = useState("");

  const addFriend = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const friendRef = doc(db, "usernames", friendName);
    const friendData = await getDoc(friendRef);
    if (!friendData.exists()) {
      setError("Username not found");
      return;
    }
    const friendId = friendData.data().userId;
    if (friendId == userId) {
      setError("You cannot add yourself");
      return;
    }
    await setDoc(
      doc(db, friendId, "requests"),
      { [userId]: true },
      { merge: true }
    );
    window.location.reload();
  };

  return (
    <div>
      <Paper
        component="form"
        sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 350 }}
        onSubmit={addFriend}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search for a friend"
          inputProps={{ "aria-label": "search for a friend" }}
          onChange={(event) => setFriendName(event.target.value)}
        />
        <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
          <PersonAddIcon />
        </IconButton>
      </Paper>
      {error && <Typography color="crimson">{error}</Typography>}
    </div>
  );
}
