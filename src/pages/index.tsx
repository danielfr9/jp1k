import { type NextPage } from "next";
import Head from "next/head";
import data from "../utils/jp1k.json";
import { useEffect, useMemo, useState } from "react";
import { Furigana } from "gem-furigana";
import useSpeechSynthesis from "../hooks/useSpeechSynthesis";
import { BsFillPlayFill } from "react-icons/bs";

interface Card {
  order: number;
  word: string;
  word_furigana: string;
  word_definition: string;
  sentence: string;
  sentence_furigana: string;
  sentence_definition: string;
  has_kanji: boolean;
  v1: boolean;
  word_audio: string;
  sentence_audio: string;
}

const Home: NextPage = () => {
  const [orderNumber, setOrderNumber] = useState(0);
  const [currentCard, setCurrentCard] = useState<Card>(data[0] as Card);

  // Handle chnage to previous card
  const handlePrevCard = () => {
    setOrderNumber((prev) => (prev - 1 >= 0 ? prev - 1 : data.length - 1));
  };

  // Handle change to next card
  const handleNextCard = () => {
    setOrderNumber((prev) => (prev + 1 < data.length ? prev + 1 : 0));
  };

  // Change current card based on order number
  useEffect(() => {
    let ignore = false;

    if (!ignore) setCurrentCard(data[orderNumber] as Card);

    return () => {
      ignore = true;
    };
  }, [orderNumber]);

  // Handle Left & Right Arrow events
  useEffect(() => {
    const handleArrowKeys = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft") handlePrevCard();
      else if (e.code == "ArrowRight") handleNextCard();
    };

    document.addEventListener("keydown", handleArrowKeys);

    return () => {
      // NOTE TO ME: Arrow functions make the event different
      document.removeEventListener("keydown", handleArrowKeys);
    };
  }, []);

  return (
    <>
      <Head>
        <title>JP1K</title>
        <meta name="description" content="JP1K Practice Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative flex min-h-screen flex-col items-center justify-center bg-slate-800 p-4 text-white">
        <p className="mb-2 font-semibold">Current Number: {orderNumber}</p>
        <div className="flex w-full max-w-lg flex-col">
          {/* Key makes sure React treats any new data as a new component, even if the components rerenders in the same position. 
            More info: https://beta.reactjs.org/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key
          */}
          <WordCard key={currentCard.order} currentCard={currentCard} />
          <div className="mt-4 flex w-full space-x-2">
            <button
              onClick={handlePrevCard}
              className="w-full rounded-md bg-slate-900 p-1 px-2 font-semibold transition-colors hover:bg-slate-700"
            >
              Prev
            </button>
            <button
              onClick={handleNextCard}
              className="w-full rounded-md bg-slate-900 p-1 px-2 font-semibold transition-colors hover:bg-slate-700"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

const WordCard = ({ currentCard }: { currentCard: Card }) => {
  const [showWordDef, setShowWordDef] = useState(false);
  const [showSentenceDef, setShowSentenceDef] = useState(false);
  const [showFurigana, setShowFurigana] = useState(false);
  const { speak, voices } = useSpeechSynthesis();

  const cardFurigana = useMemo(() => {
    return new Furigana(currentCard.word_furigana);
  }, [currentCard]);

  const handleSpeak = (text: string) => {
    // Check for Haruka Voice; if not installed, return first Japanese voice found
    const jpVoice =
      voices.find(
        (voice) => voice.name === "Microsoft Haruka - Japanese (Japan)"
      ) || voices.find((voice) => voice.lang === "ja-JP");

    // Stop execution if no japanese voice is installed
    if (!jpVoice) {
      console.log("Japanese voices not installed");
      return;
    }

    speak({
      text,
      voice: jpVoice,
      rate: 0.8,
      lang: "ja",
    });
  };

  return (
    <div className="flex min-h-[23rem] w-full flex-col space-y-6 rounded-lg bg-slate-900 p-6">
      {/* QUESTION WORD */}
      <div className="flex min-h-[4.75rem] justify-between space-x-8">
        <div>
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

      {/* DIVIDER */}
      <div
        className={`h-[0.0625rem] w-full rounded-xl bg-gray-800 ${
          showWordDef ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* EXAMPLE SENTENCE */}
      <div
        className={`${
          showWordDef ? "opacity-100" : "opacity-0"
        } transition-opacity`}
      >
        <div className="flex justify-between space-x-8">
          <div>
            <div
              className="text-2xl font-semibold text-teal-600"
              dangerouslySetInnerHTML={{
                __html: new Furigana(currentCard.sentence_furigana).ReadingHtml,
              }}
            />

            {/* <p className="text-2xl font-semibold text-teal-600">
                {currentCard.sentence}
              </p> */}

            {showSentenceDef ? (
              <small className="text-sm font-semibold">
                {currentCard.sentence_definition}
              </small>
            ) : (
              <small
                onClick={() => setShowSentenceDef((prev) => !prev)}
                className="cursor-pointer text-sm font-semibold underline"
              >
                Show definition
              </small>
            )}
          </div>
          {/* SENTENCE AUDIO */}
          <div className="w-fit shrink-0">
            <button onClick={() => handleSpeak(currentCard.sentence)}>
              <BsFillPlayFill className="h-10 w-10" />
            </button>
          </div>
        </div>
      </div>
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

export default Home;
