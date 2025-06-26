import React, { useState, useEffect, useContext, useCallback } from "react";
import { GameMasterContext } from "../context/GameMasterContext";
import "./css/QuestionTypeSlides.css";

function QuestionTypeSlides({ question, socket }) {
  const { isGameMaster } = useContext(GameMasterContext);
  const images = question?.mediaUrls ?? [];
  const [index, setIndex] = useState(0);

  /* sync from server → client */
  socket.on("setIndex", (idx) => setIndex(idx));

  /* helper that only the GM can trigger */
  const changeIndex = (idx) => {
    socket.emit('setIndex', idx);
  };

  const canPrev = index > 0;
  const canNext = index < images.length - 1;

  const prev = () => canPrev && changeIndex(index - 1);
  const next = () => canNext && changeIndex(index + 1);

  if (images.length === 0) return null;

  return (
    <div className="qts-wrapper">
      <img
        src={images[index]}
        alt={`question slide ${index + 1}`}
        className="qts-image"
      />

      {images.length > 1 && isGameMaster && (
        <>
          <button
            disabled={!canPrev}
            onClick={prev}
            aria-label="Previous slide"
            className="qts-nav qts-nav-left"
          >
            ‹
          </button>

          <button
            disabled={!canNext}
            onClick={next}
            aria-label="Next slide"
            className="qts-nav qts-nav-right"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}

export default QuestionTypeSlides;
