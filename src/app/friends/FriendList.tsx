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
  Box,
  CircularProgress,
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
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/config/firebase";

/**
 * Displays the user's friends and allows them to copy their friend's deck
 */
export default function FriendList() {
  const [userId, setUserId] = useState("");
  const [friendList, setFriendList] = useState<string[]>([]);
  const [deckName, setDeckName] = useState("");
  const [copyOpen, setCopyOpen] = useState(false);
  const [copyError, setCopyError] = useState("");
  const [removeOpen, setRemoveOpen] = useState(false);
  const [deckList, setDeckList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const getDeckList = async (username: string) => {
    try {
      const friendObj = await getDoc(doc(db, "usernames", username));
      const friendData = friendObj.data();
      if (!friendData) return;
      const friendId = friendData.userId;
      const deckListRef = collection(db, friendId); // A reference to the collection in firebase
      const q = query(deckListRef, where("dummy", "==", "value"));
      const data = await getDocs(q); // Get all the documents from the collection based on the user id
      const filteredData = data.docs.map((doc) => ({
        // Get the data we are interested in (mainly the deck name which is doc.id)
        ...doc.data(),
        id: doc.id,
      }));
      setDeckList(filteredData);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
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
    await updateDoc(doc(db, friendId, "friends"), { [userId]: false });
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
                    aria-label="view"
                    onClick={() => {
                      setCopyOpen(true);
                      setCopyError("");
                      getDeckList(name);
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
                    <DialogTitle>Friend deck list</DialogTitle>
                    <DialogContent>
                      <List>
                        {isLoading && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <CircularProgress />
                          </Box>
                        )}

                        {deckList.map((deck: any) => (
                          <ListItem key={deck.id}>
                            <ListItemText primary={deck.id} />
                          </ListItem>
                        ))}
                      </List>
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
