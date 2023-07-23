/** 
import * as React from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { auth, db } from "@/config/firebase";
import { getDocs, collection, query, where, getCountFromServer } from "firebase/firestore";
import { useState } from 'react';

export default function SplitButton() {

  const [number, setNumber] = useState(0);

  const handle_new = async () => {
    setNumber(1);
  };

  const handle_easy = async () => {
    setNumber(2);
  };

  const handle_hard = async () => {
    setNumber(3);
  };

  return (
    <ButtonGroup
      disableElevation
      variant="outlined"
    >
      <Button onClick={() => window.location.reload()}>Default</Button>
      <Button onClick={handle_new}>Cards not reviewed</Button>
      <Button onClick={handle_easy}>level: easy</Button>
      <Button onClick={handle_hard}>level: hard</Button>
    </ButtonGroup>
  );
}
*/
