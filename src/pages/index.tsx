import { type NextPage } from "next";
import Head from "next/head";
import jp1k from "../utils/jp1k";
import { useEffect, useMemo, useState } from "react";
import Card from "../components/Card";
import NavigationButton from "../components/NavigationButton";
import LoadingCircle from "../components/LoadingCircle";

const Home: NextPage = () => {
  const [orderNumber, setOrderNumber] = useState(0);

  const currentCard = useMemo(() => {
    return jp1k[orderNumber];
  }, [orderNumber]);

  // Handle change to previous card
  const handlePrevCard = () => {
    setOrderNumber((prev) => (prev - 1 >= 0 ? prev - 1 : jp1k.length - 1));
  };

  // Handle change to next card
  const handleNextCard = () => {
    setOrderNumber((prev) => (prev + 1 < jp1k.length ? prev + 1 : 0));
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
  }, []);

  return (
    <>
      <Head>
        <title>JP1K</title>
        <meta name="description" content="JP1K Practice Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative flex min-h-screen flex-col items-center justify-center bg-slate-800 p-4 text-white">
        <div className="flex w-full max-w-lg flex-col">
          <div className="overflow-hidden rounded-lg">
            <div className="bg-[#0C1221] p-2">
              <p className="text-center font-bold">JP1K #{orderNumber + 1}</p>
            </div>
            {/* Key makes sure React treats any new data as a new component, even if the components rerenders in the same position. 
            More info: https://beta.reactjs.org/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key
          */}
            {currentCard ? (
              <Card key={currentCard.order} currentCard={currentCard} />
            ) : (
              <div className="flex min-h-[25rem] w-full flex-col items-center justify-center space-y-6 rounded-lg bg-slate-900 p-6">
                <LoadingCircle />
              </div>
            )}
          </div>
          <div className="mt-4 flex space-x-2">
            <NavigationButton onClick={handlePrevCard}>Prev</NavigationButton>
            <NavigationButton onClick={handleNextCard}>Next</NavigationButton>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
