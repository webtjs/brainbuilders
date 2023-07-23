"use client";
import * as React from "react";

//import from Material UI
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

export default function flashcard({
  flashcard,
  deckId,
}: {
  flashcard: any;
  deckId: string;
}) {
  const reviewLink = "/" + deckId + "/practice";
  const card = (
    <React.Fragment>
      <CardContent>
        <Typography variant="body1">
          <br />
          {flashcard.front}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" href={reviewLink}>
          Practice
        </Button>
      </CardActions>
    </React.Fragment>
  );

  return (
    <div>
      <Box className="card">
        <Card variant="outlined">{card}</Card>
      </Box>
      <br></br>
    </div>
  );
}
