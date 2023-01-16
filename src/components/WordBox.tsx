import { useState } from "react";
import useSpeak from "../hooks/useVoices";
import type { Furigana } from "../utils/gem-furigana";
import type { JP1K } from "../data/jp1k";
import PauseIcon from "../icons/PauseIcon";
import PlayIcon from "../icons/PlayIcon";

interface IWordBoxProps {
  showWordDef: boolean;
  cardFurigana: Furigana;
  currentCard: JP1K;
}

const WordBox = ({ showWordDef, cardFurigana, currentCard }: IWordBoxProps) => {
  const { speakText, cancel, speaking } = useSpeak();
  const [showFurigana, setShowFurigana] = useState(false);

  return (
    <div className="flex min-h-[4.75rem] justify-between space-x-8">
      {/* WORD TEXT */}
      <div>
        {showFurigana || showWordDef ? (
          <p
            className="text-2xl font-semibold text-teal-600"
            dangerouslySetInnerHTML={{
              __html: cardFurigana.ReadingHtml,
            }}
          />
        ) : (
          <p className="text-2xl font-semibold text-teal-600">
            {currentCard.word}
          </p>
        )}
        {/* WORD DEFINITION */}
        <p
          className={`text-lg font-semibold ${
            showWordDef ? "opacity-100" : "select-none opacity-0"
          } transition-opacity`}
        >
          {currentCard.word_definition}
        </p>
      </div>

      {/* WORD AUDIO */}
      <div className="w-fit shrink-0">
        {showFurigana ||
        showWordDef ||
        cardFurigana.ReadingHtml === currentCard.word ? (
          speaking ? (
            <button aria-label="Pause word audio" onClick={() => cancel()}>
              <PauseIcon />
            </button>
          ) : (
            <button
              aria-label="Play word audio"
              onClick={() => speakText(currentCard.word)}
            >
              <PlayIcon />
            </button>
          )
        ) : (
          <button
            aria-label="Show word reading"
            onClick={() => setShowFurigana(true)}
            className="rounded-md border border-indigo-800 bg-indigo-800/30 p-2 font-semibold transition-colors hover:bg-indigo-800/70"
          >
            Show Reading
          </button>
        )}
      </div>
    </div>
  );
};

export default WordBox;
