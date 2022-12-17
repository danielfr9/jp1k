import { type NextPage } from "next";
import Head from "next/head";
import data from "../utils/jp1k.json";
// import JP1K from "../utils/jp1k";
import { useEffect, useState } from "react";
import { Furigana } from "gem-furigana";
import { Switch } from "@headlessui/react";

type Card = {
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
};

const Home: NextPage = () => {
  const [orderNumber, setOrderNumber] = useState(0);
  const [currentCard, setCurrentCard] = useState<Card>(data[0] as Card);

  // TODO: Save option in localstorage
  const [showFurigana, setShowFurigana] = useState(false);

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

  // One time use function to parse Paparse array-of-arrays to JSON
  // const ToJson = () => {
  //   const jsonJP1K: Card[] = JP1K.map((card) => ({
  //     order: Number(card[0] as string),
  //     word: card[1] as string,
  //     word_furigana: card[2] as string,
  //     word_definition: card[3] as string,
  //     sentence: card[4] as string,
  //     sentence_furigana: card[5] as string,
  //     sentence_definition: card[6] as string,
  //     has_kanji: (card[7] as string) === "TRUE",
  //     v1: (card[8] as string) === "TRUE",
  //     word_audio: card[9] as string,
  //     sentence_audio: card[10] as string,
  //   }));

  //   console.log(jsonJP1K);
  // };

  return (
    <>
      <Head>
        <title>JP1K</title>
        <meta name="description" content="JP1K Practice Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative flex min-h-screen flex-col items-center justify-center bg-slate-800 p-4 text-white">
        <div className="fixed top-3 right-3">
          <FuriganaToggle
            isChecked={showFurigana}
            setChecked={() => setShowFurigana((prev) => !prev)}
          />
        </div>
        <p className="mb-2 font-semibold">Current Number: {orderNumber}</p>
        <div className="flex w-full max-w-lg flex-col">
          {/* Key makes sure React treats any new data as a new component, even if the components rerenders in the same position. 
            More info: https://beta.reactjs.org/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key
          */}
          <WordCard
            showFurigana={showFurigana}
            key={currentCard.order}
            currentCard={currentCard}
          />
          <div className="mt-4 flex w-full space-x-2">
            <button
              onClick={handlePrevCard}
              className="w-full rounded-md bg-slate-900 p-1 px-2 font-semibold hover:bg-slate-700"
            >
              Prev
            </button>
            <button
              onClick={handleNextCard}
              className="w-full rounded-md bg-slate-900 p-1 px-2 font-semibold hover:bg-slate-700"
            >
              Next
            </button>
          </div>
        </div>
        {/* <button className="bg-blue-500 hover:bg-blue-500" onClick={ToJson}>
          Parse to JSON
        </button> */}
      </main>
    </>
  );
};

const WordCard = ({
  currentCard,
  showFurigana,
}: {
  currentCard: Card;
  showFurigana: boolean;
}) => {
  const [showWordDef, setShowWordDef] = useState(false);
  const [showSentenceDef, setShowSentenceDef] = useState(false);

  return (
    <div className="flex min-h-[20rem] w-full flex-col space-y-4 rounded-lg bg-slate-900 p-6">
      <div className="flex min-h-[4.75rem] justify-between">
        <div>
          {showFurigana ? (
            <div
              className="text-2xl font-semibold text-teal-600"
              dangerouslySetInnerHTML={{
                __html: new Furigana(currentCard.word_furigana).ReadingHtml,
              }}
            />
          ) : (
            <p className="text-2xl font-semibold text-teal-600">
              {currentCard.word}
            </p>
          )}
          <p
            className={`text-lg font-semibold ${
              showWordDef ? "opacity-100" : "opacity-0"
            } transition-opacity`}
          >
            {currentCard.word_definition}
          </p>
        </div>
        <div>
          <div className="h-10 w-10 rounded-full bg-indigo-500" />
        </div>
      </div>

      <div
        className={`h-[0.125rem] w-full rounded-xl bg-gray-600 ${
          showWordDef ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`${
          showWordDef ? "opacity-100" : "opacity-0"
        } transition-opacity`}
      >
        <div className="flex justify-between">
          <div>
            {showFurigana ? (
              <div
                className="text-2xl font-semibold text-teal-600"
                dangerouslySetInnerHTML={{
                  __html: new Furigana(currentCard.sentence_furigana)
                    .ReadingHtml,
                }}
              />
            ) : (
              <p className="text-2xl font-semibold text-teal-600">
                {currentCard.sentence}
              </p>
            )}
            {showSentenceDef ? (
              <p className="text-lg font-semibold">
                {currentCard.sentence_definition}
              </p>
            ) : (
              <small
                onClick={() => setShowSentenceDef((prev) => !prev)}
                className="cursor-pointer font-semibold underline"
              >
                Show definition
              </small>
            )}
          </div>
          <div>
            <div className="h-10 w-10 rounded-full bg-indigo-500" />
          </div>
        </div>
      </div>
      {!showWordDef && (
        <div className="flex grow flex-col justify-end">
          {/* TODO: Add spacebar event to show answer */}
          <button
            onClick={() => setShowWordDef((prev) => !prev)}
            className="rounded-md border border-indigo-800 bg-indigo-800/30 p-2 font-semibold hover:bg-indigo-800/70"
          >
            Show Answer
          </button>
        </div>
      )}
    </div>
  );
};

const FuriganaToggle = ({
  isChecked,
  setChecked,
}: {
  isChecked: boolean;
  setChecked: () => void;
}) => {
  return (
    <Switch.Group>
      <div className="flex items-center">
        <Switch.Label className="mr-2 text-sm font-semibold" passive>
          Furigana
        </Switch.Label>
        <Switch
          checked={isChecked}
          onChange={setChecked}
          className={`${
            isChecked ? "bg-teal-600" : "bg-teal-900"
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
        >
          <span
            className={`${
              isChecked ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>
    </Switch.Group>
  );
};

export default Home;
