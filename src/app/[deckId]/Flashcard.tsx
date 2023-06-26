"use client";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

/**
 * Displays the contents of a flashcard in a mui card component
 *
 * @param[in] flashcard A dictionary containing information about a flashcard
 */
export default function Flashcard({ flashcard }: any) {
  return (
    <Card sx={{ maxWidth: 245 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Front: {flashcard.front}
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          Back: {flashcard.back}
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          Type: {flashcard.type}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Edit flashcard</Button>
        <Button size="small">Delete flashcard</Button>
      </CardActions>
    </Card>
  );
}
