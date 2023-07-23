"use client";

import Flashcard from "./flashcard";

import { useState } from "react";

export default function flashcard_list({data}) {

  return (
    <div>
      {data.map(flashcard => {
        return <Flashcard flashcard={flashcard} key={flashcard.id} />
      })}
    </div>
  )
}

