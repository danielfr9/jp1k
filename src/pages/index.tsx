import { type NextPage } from "next";
import Head from "next/head";
import data from "../utils/jp1k.json";
// import JP1K from "../utils/jp1k";
import { useEffect, useState } from "react";
import { Furigana } from "gem-furigana";

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
  // const [showWordDef, setShowWordDef] = useState(false);
  // const [showSentenceDef, setShowSentenceDef] = useState(false);

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
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-800 p-4 text-white">
        <p className="mb-2 font-semibold">Current Number: {orderNumber}</p>
        <div className="flex w-full max-w-lg flex-col">
          <div className="flex min-h-[20rem] w-full flex-col space-y-4 rounded-lg bg-slate-900 p-6">
            <div>
              {/* <p className="text-2xl font-semibold text-teal-500">
                {currentCard.word}
              </p> */}
              <div
                className="text-2xl font-semibold text-teal-600"
                dangerouslySetInnerHTML={{
                  __html: new Furigana(currentCard.word_furigana).ReadingHtml,
                }}
              />
              <p className="text-lg font-semibold">
                {currentCard.word_definition}
              </p>
            </div>

            <div className="h-[0.125rem] w-full rounded-xl bg-gray-600" />

            <div>
              {/* <p className="text-2xl font-semibold text-teal-500">
                {currentCard.sentence}
              </p> */}
              <div
                className="text-2xl font-semibold text-teal-600"
                dangerouslySetInnerHTML={{
                  __html: new Furigana(currentCard.sentence_furigana)
                    .ReadingHtml,
                }}
              />
              <p className="text-lg font-semibold">
                {currentCard.sentence_definition}
              </p>
            </div>
          </div>

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

export default Home;
