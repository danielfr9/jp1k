import { type NextPage } from "next";
import Head from "next/head";
import jp1k from "../utils/jp1k";
import {
  type ChangeEvent,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import Card from "../components/Card";
import NavigationButton from "../components/NavigationButton";
import LoadingCircle from "../components/LoadingCircle";

const Home: NextPage = () => {
  const [orderNumber, setOrderNumber] = useState(0);
  const selectRef = useRef<HTMLSelectElement>(null);

  const currentCard = useMemo(() => {
    return jp1k[orderNumber];
  }, [orderNumber]);

  // Handle change to previous card
  const handlePrevCard = useCallback(() => {
    setOrderNumber((prev) => (prev - 1 >= 0 ? prev - 1 : jp1k.length - 1));
  }, []);

  // Handle change to next card
  const handleNextCard = useCallback(() => {
    setOrderNumber((prev) => (prev + 1 < jp1k.length ? prev + 1 : 0));
  }, []);

  // Handle select element change
  const handleSelectCard = (e: ChangeEvent<HTMLSelectElement>) => {
    setOrderNumber(parseInt(e.currentTarget.value) || 0);

    // Remove focus to prevent conflict with keyboard events
    selectRef.current?.blur();
  };

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
  }, [handleNextCard, handlePrevCard]);

  return (
    <>
      <Head>
        <title>JP1K</title>
        <meta name="description" content="JP1K Practice Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col bg-gradient-to-r from-[#0D324D] to-[#1F9864] text-white sm:items-center sm:justify-center sm:p-4">
        {/* Card container */}
        <div className="flex w-full max-w-2xl grow flex-col overflow-hidden bg-gray-900 pb-6 md:rounded-lg">
          {/* Select with current card number */}
          <div className="w-full bg-[#0C1221] p-2">
            <select
              className="w-full rounded-lg bg-gray-800/50 p-2"
              name="selectedCard"
              id="selectedCard"
              value={orderNumber}
              onChange={handleSelectCard}
              ref={selectRef}
            >
              {jp1k.map((word, index) => (
                <option className="bg-gray-900" key={word.order} value={index}>
                  #{word.order} - {word.word}
                </option>
              ))}
            </select>
          </div>

          {/* The key makes sure React treats any new data as a new component, even if the components rerenders in the same position. 
            More info: https://beta.reactjs.org/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key
          */}
          <div className="flex w-full grow flex-col space-y-6 p-6">
            {currentCard ? (
              <Card key={currentCard.order} currentCard={currentCard} />
            ) : (
              <div className="flex w-full grow items-center justify-center">
                <LoadingCircle width={200} height={200} />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 px-4">
            <NavigationButton onClick={handlePrevCard}>Prev</NavigationButton>
            <NavigationButton onClick={handleNextCard}>Next</NavigationButton>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
