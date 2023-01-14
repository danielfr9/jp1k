import { Furigana } from "gem-furigana";
import { useState } from "react";
import { BsFillPlayFill } from "react-icons/bs";
import type { JP1K } from "../utils/jp1k";

interface ISentenceBoxProps {
  showWordDef: boolean;
  currentCard: JP1K;
  handleSpeak: (text: string) => void;
}

const SentenceBox = ({
  showWordDef,
  currentCard,
  handleSpeak,
}: ISentenceBoxProps) => {
  const [showSentenceDef, setShowSentenceDef] = useState(false);
  return (
    <div
      className={`${
        showWordDef ? "opacity-100" : "select-none opacity-0"
      } transition-opacity`}
    >
      <div className="flex justify-between space-x-8">
        {/* SENTENCE TEXT */}
        <div>
          <div
            className="text-2xl font-semibold text-teal-600"
            dangerouslySetInnerHTML={{
              __html: new Furigana(currentCard.sentence_furigana).ReadingHtml,
            }}
          />
          {showSentenceDef ? (
            <small className="text-sm font-semibold">
              {currentCard.sentence_definition}
            </small>
          ) : (
            <small
              onClick={() => setShowSentenceDef((prev) => !prev)}
              className="cursor-pointer select-none text-sm font-semibold underline"
            >
              Show definition
            </small>
          )}
        </div>
        {/* SENTENCE AUDIO */}
        <div className="w-fit shrink-0">
          <button
            disabled={!showWordDef}
            onClick={() => handleSpeak(currentCard.sentence)}
          >
            <BsFillPlayFill className="h-10 w-10" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SentenceBox;
