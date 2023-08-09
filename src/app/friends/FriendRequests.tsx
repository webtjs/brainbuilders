import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/config/firebase";

export default function FriendRequests() {
  const [userId, setUserId] = useState("");
  const [requests, setRequests] = useState<string[]>([]);

  const acceptFriend = async (username: string) => {
    const friendObj = await getDoc(doc(db, "usernames", username));
    const friendData = friendObj.data();
    if (!friendData) return;
    const friendId = friendData.userId;
    await setDoc(
      doc(db, userId, "friends"),
      { [friendId]: true },
      { merge: true }
    );
    await setDoc(
      doc(db, friendId, "friends"),
      { [userId]: true },
      { merge: true }
    );
    await setDoc(
      doc(db, userId, "requests"),
      { [friendId]: false },
      { merge: true }
    );
    window.location.reload();
  };

  const rejectFriend = async (username: string) => {
    const friendObj = await getDoc(doc(db, "usernames", username));
    const friendData = friendObj.data();
    if (!friendData) return;
    const friendId = friendData.userId;
    await setDoc(
      doc(db, userId, "requests"),
      { [friendId]: false },
      { merge: true }
    );
    window.location.reload();
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) return;
      setUserId(user.uid);
      const requestRef = doc(db, user.uid, "requests");
      const getRequests = async () => {
        const requestData = await getDoc(requestRef);
        const requestList = requestData.data();
        if (!requestList) return;
        const requestIds = Object.keys(requestList);
        requestIds.forEach(async (id) => {
          const profileRef = doc(db, id, "profile");
          const profile = await getDoc(profileRef);
          const profileData = profile.data();
          if (!profileData || requestList[id] == false) return;
          setRequests((prev) => [...prev, profileData.username]);
        });
      };
      getRequests();
    });
  }, []);

  return (
    <List
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      aria-label="contacts"
    >
      {requests.length > 0 ? (
        <div>
          {requests.map((name) => (
            <ListItem
              key={name}
              secondaryAction={
                <div>
                  <IconButton
                    aria-label="accept"
                    onClick={() => {
                      acceptFriend(name);
                    }}
                  >
                    <PersonAddIcon />
                  </IconButton>
                  <IconButton
                    aria-label="reject"
                    onClick={() => {
                      rejectFriend(name);
                    }}
                  >
                    <CancelIcon />
                  </IconButton>
                </div>
              }
            >
              <ListItemAvatar>
                <Avatar />
              </ListItemAvatar>
              <ListItemText primary={name} />
            </ListItem>
          ))}
        </div>
      ) : (
        <div>No requests yet</div>
      )}
    </List>
  );
}
