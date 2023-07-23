"use client";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

/**
 * Display the deck name and other additional options inside a mui card component
 *
 * @param[in] deckId The name of the deck
 */
export default function DeckCard({ deckId }: { deckId: string | null }) {
  const editLink = "/" + deckId;
  const reviewLink = "/" + deckId + "/practice-page";
  console.log(editLink);

  return (
    <Card sx={{ maxWidth: 245 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" noWrap>
          {deckId}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" href={editLink}>
          Edit deck
        </Button>
        <Button size="small" href={reviewLink}>
          Practice deck
        </Button>
      </CardActions>
    </Card>
  );
}
