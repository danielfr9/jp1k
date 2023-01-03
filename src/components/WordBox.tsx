import type { Furigana } from "gem-furigana";
import { useState } from "react";
import { BsFillPlayFill } from "react-icons/bs";
import type { JP1K } from "../utils/jp1k";

interface IWordBoxProps {
  showWordDef: boolean;
  cardFurigana: Furigana;
  currentCard: JP1K;
  handleSpeak: (text: string) => void;
}

const WordBox = ({
  showWordDef,
  cardFurigana,
  currentCard,
  handleSpeak,
}: IWordBoxProps) => {
  const [showFurigana, setShowFurigana] = useState(false);

  return (
    <div className="flex min-h-[4.75rem] justify-between space-x-8">
      <div>
        {/* WORD TEXT */}
        {showFurigana || showWordDef ? (
          <div
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
            showWordDef ? "opacity-100" : "opacity-0"
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
          <button onClick={() => handleSpeak(currentCard.word)}>
            <BsFillPlayFill className="h-10 w-10" />
          </button>
        ) : (
          <button
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
