import { useCallback, useMemo } from "react";
import useSpeechSynthesis from "./useSpeechSynthesis";

const useSpeak = () => {
  const { speak, voices, cancel, speaking } = useSpeechSynthesis();

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

  const speakText = useCallback(
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

  return { speakText, cancel, speaking };
};

export default useSpeak;
