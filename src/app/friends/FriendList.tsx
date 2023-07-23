import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import IconButton from "@mui/material/IconButton";
import FriendSearch from "./FriendSearch";
import { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/config/firebase";

export default function FriendList() {
  const [userId, setUserId] = useState("");
  const [friendList, setFriendList] = useState<string[]>([]);
  const [deckName, setDeckName] = useState("");
  const [copyOpen, setCopyOpen] = useState(false);
  const [copyError, setCopyError] = useState("");
  const [removeOpen, setRemoveOpen] = useState(false);

  const submitDeck = async (username: string) => {
    if (
      deckName == "" ||
      deckName == "profile" ||
      deckName == "friends" ||
      deckName == "requests"
    )
      return;
    const friendObj = await getDoc(doc(db, "usernames", username));
    const friendData = friendObj.data();
    if (!friendData) return;
    const friendId = friendData.userId;
    const deckData = await getDocs(
      collection(db, friendId, deckName, "flashcards")
    );
    if (deckData.empty) {
      setCopyError("No flashcards to copy from the deck");
      return;
    }
    const filteredData = deckData.docs.map((doc) => ({ ...doc.data() }));
    await setDoc(
      doc(db, userId, deckName),
      { dummy: "value" },
      { merge: true }
    );
    filteredData.forEach(async (flashcardData) => {
      await addDoc(
        collection(db, userId, deckName, "flashcards"),
        flashcardData
      );
    });
    setCopyOpen(false);
  };

  const handleRemoveOpen = () => {
    setRemoveOpen(true);
  };

  const handleRemoveClose = () => {
    setRemoveOpen(false);
  };

  const handleClose = async (username: string) => {
    const friendObj = await getDoc(doc(db, "usernames", username));
    const friendData = friendObj.data();
    if (!friendData) return;
    const friendId = friendData.userId;
    await updateDoc(doc(db, userId, "friends"), { [friendId]: false });
    setRemoveOpen(false);
    window.location.reload();
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) return;
      setUserId(user.uid);
      const getFriendIds = async () => {
        const friendsRef = doc(db, user.uid, "friends");
        const friendsObj = await getDoc(friendsRef);
        const data = friendsObj.data();
        if (!data) return;
        const friendsId = Object.keys(data);
        friendsId.forEach(async (friendId) => {
          const friendProfRef = doc(db, friendId, "profile");
          const friendProf = await getDoc(friendProfRef);
          const friendData = friendProf.data();
          if (!friendData || data[friendId] == false) return;
          setFriendList((prev) => [...prev, friendData.username]);
        });
      };
      getFriendIds();
    });
  }, []);

  return (
    <List
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      aria-label="contacts"
    >
      <FriendSearch userId={userId} />
      {friendList.length > 0 ? (
        <div>
          {friendList.map((name) => (
            <ListItem
              key={name}
              secondaryAction={
                <div>
                  <IconButton
                    aria-label="copy"
                    onClick={() => {
                      setCopyOpen(true);
                      setCopyError("");
                    }}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                  <Dialog
                    open={copyOpen}
                    onClose={() => {
                      setCopyOpen(false);
                    }}
                    fullWidth
                    maxWidth="sm"
                  >
                    <DialogTitle>Copy friend's deck</DialogTitle>
                    <DialogContent>
                      <TextField
                        autoFocus
                        margin="dense"
                        label="Deck name"
                        variant="standard"
                        fullWidth
                        onChange={(event) => {
                          setDeckName(event.target.value);
                        }}
                      />
                      {copyError && (
                        <DialogContentText color="crimson">
                          {copyError}
                        </DialogContentText>
                      )}
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={() => {
                          submitDeck(name);
                        }}
                      >
                        Submit
                      </Button>
                    </DialogActions>
                  </Dialog>
                  <IconButton aria-label="remove" onClick={handleRemoveOpen}>
                    <PersonRemoveIcon />
                  </IconButton>
                  <Dialog
                    open={removeOpen}
                    onClose={handleRemoveClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"Remove friend?"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Are you sure that you want to remove this friend?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setRemoveOpen(false)}>No</Button>
                      <Button
                        onClick={() => {
                          handleClose(name);
                        }}
                        autoFocus
                      >
                        Yes
                      </Button>
                    </DialogActions>
                  </Dialog>
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
        <div>
          <br />
          No friends yet
        </div>
      )}
    </List>
  );
}
