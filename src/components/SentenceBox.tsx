import { Furigana } from "../utils/gem-furigana";
import { useEffect, useRef, useState } from "react";
import type { JP1K } from "../data/jp1k";
import PlayIcon from "../icons/PlayIcon";
import useSpeak from "../hooks/useVoices";
import PauseIcon from "../icons/PauseIcon";

interface ISentenceBoxProps {
  showWordDef: boolean;
  currentCard: JP1K;
}

const SentenceBox = ({ showWordDef, currentCard }: ISentenceBoxProps) => {
  const { speakText, cancel, speaking } = useSpeak();
  const [showSentenceDef, setShowSentenceDef] = useState(false);
  const isShown = useRef(false);

  // Speak the sentence on show
  useEffect(() => {
    if (showWordDef && !isShown.current) {
      speakText(currentCard.sentence);
      isShown.current = true;
    }
  }, [showWordDef, speakText, currentCard.sentence]);

  return (
    <div
      className={`flex justify-between space-x-8 ${
        showWordDef ? "opacity-100" : "select-none opacity-0"
      } transition-opacity`}
    >
      {/* SENTENCE TEXT */}
      <div className="flex flex-col space-y-1">
        <p
          className="text-2xl font-semibold text-teal-600"
          dangerouslySetInnerHTML={{
            __html: Furigana(currentCard.sentence_furigana).ReadingHtml,
          }}
        />
        {showSentenceDef ? (
          <p className="font-semibold">{currentCard.sentence_definition}</p>
        ) : (
          <p
            aria-label="Show sentence definition"
            onClick={() => setShowSentenceDef((prev) => !prev)}
            className="cursor-pointer select-none font-semibold underline"
          >
            Show definition
          </p>
        )}
      </div>
      {/* SENTENCE AUDIO */}
      <div className="w-fit shrink-0">
        {speaking ? (
          <button
            aria-label="Pause sentence audio"
            disabled={!showWordDef}
            onClick={() => cancel()}
          >
            <PauseIcon />
          </button>
        ) : (
          <button
            aria-label="Play sentence audio"
            disabled={!showWordDef}
            onClick={() => speakText(currentCard.sentence)}
          >
            <PlayIcon />
          </button>
        )}
      </div>
    </div>
  );
};

export default SentenceBox;
