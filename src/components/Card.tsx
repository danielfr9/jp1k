import { Furigana } from "gem-furigana";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSpeechSynthesis from "../hooks/useSpeechSynthesis";
import type { JP1K } from "../utils/jp1k";
import SentenceBox from "./SentenceBox";
import WordBox from "./WordBox";

const Card = ({ currentCard }: { currentCard: JP1K }) => {
  const [showWordDef, setShowWordDef] = useState(false);
  const { speak, voices, cancel: cancelSpeak } = useSpeechSynthesis();

  const cardFurigana = useMemo(() => {
    return new Furigana(currentCard.word_furigana);
  }, [currentCard]);

  // Voice used for speechSynthesis
  const JPVoice = useMemo(() => {
    // Check for Haruka Voice; if not installed, return first Japanese voice found
    const jpVoice =
      voices.find(
        (voice) => voice.name === "Microsoft Haruka - Japanese (Japan)"
      ) || voices.find((voice) => voice.lang === "ja-JP");

    // Return the JP voice
    if (jpVoice) return jpVoice;

    return null;
  }, [voices]);

  const handleSpeak = useCallback(
    (text: string) => {
      // Stop execution if no japanese voice is installed
      if (!JPVoice) {
        console.log("Japanese voices not installed");
        return;
      }

      speak({
        text,
        voice: JPVoice,
        rate: 0.8,
        lang: "ja",
      });
    },
    [speak, JPVoice]
  );

  // Stop speech on unmount
  useEffect(() => {
    return () => {
      cancelSpeak();
    };
  }, [cancelSpeak]);

  return (
    <div className="flex min-h-[24rem] w-full flex-col space-y-6 bg-slate-900 p-6">
      {/* QUESTION WORD */}
      <WordBox
        showWordDef={showWordDef}
        cardFurigana={cardFurigana}
        currentCard={currentCard}
        handleSpeak={handleSpeak}
      />

      {/* DIVIDER */}
      <div
        className={`h-[0.0625rem] w-full rounded-xl bg-gray-800 ${
          showWordDef ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* EXAMPLE SENTENCE */}
      <SentenceBox
        showWordDef={showWordDef}
        currentCard={currentCard}
        handleSpeak={handleSpeak}
      />

      {!showWordDef && (
        <div className="flex grow flex-col justify-end">
          {/* TODO: Add spacebar event to show answer */}
          <button
            onClick={() => {
              setShowWordDef((prev) => !prev);
              handleSpeak(currentCard.sentence);
            }}
            className="rounded-md border border-indigo-800 bg-indigo-800/30 p-2 font-semibold transition-colors hover:bg-indigo-800/70"
          >
            Show Answer
          </button>
        </div>
      )}
    </div>
  );
};

export default Card;
