import { Furigana } from "../utils/gem-furigana";
import { useEffect, useMemo, useState } from "react";
import type { JP1K } from "../data/jp1k";
import SentenceBox from "./SentenceBox";
import WordBox from "./WordBox";
import useSpeak from "../hooks/useVoices";

const Card = ({ currentCard }: { currentCard: JP1K }) => {
  const [showWordDef, setShowWordDef] = useState(false);
  const { cancel: cancelSpeak } = useSpeak();

  const cardFurigana = useMemo(() => {
    return Furigana(currentCard.word_furigana);
  }, [currentCard]);

  // Stop speech on unmount
  useEffect(() => {
    return () => {
      cancelSpeak();
    };
  }, [cancelSpeak]);

  return (
    <>
      {/* QUESTION WORD */}
      <WordBox
        showWordDef={showWordDef}
        cardFurigana={cardFurigana}
        currentCard={currentCard}
      />

      {/* DIVIDER */}
      <div
        className={`h-[0.0625rem] w-full rounded-xl bg-gray-800 ${
          showWordDef ? "opacity-100" : "select-none opacity-0"
        }`}
      />

      {/* EXAMPLE SENTENCE */}
      <SentenceBox showWordDef={showWordDef} currentCard={currentCard} />

      {!showWordDef && (
        <div className="flex grow flex-col justify-end">
          {/* TODO: Add spacebar event to show answer */}
          <button
            onClick={() => {
              setShowWordDef((prev) => !prev);
            }}
            className="rounded-md border border-indigo-800 bg-indigo-800/30 p-2 font-semibold transition-colors hover:bg-indigo-800/70"
          >
            Show Answer
          </button>
        </div>
      )}
    </>
  );
};

export default Card;
