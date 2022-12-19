import { useCallback, useEffect, useState } from "react";

interface IProps {
  onEnd?: () => void;
}

interface SpeakText {
  voice?: SpeechSynthesisVoice;
  text?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
}

const defaultOnEnd = () => {
  return;
};

const useSpeechSynthesis = (props: IProps = {}) => {
  const onEnd = props?.onEnd || defaultOnEnd;
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  const getVoices = useCallback(() => {
    // Firefox seems to have voices upfront and never calls the
    // voiceschanged event
    let voiceOptions = window.speechSynthesis.getVoices();
    if (voiceOptions.length > 0) {
      setVoices(voiceOptions);
      return;
    }

    window.speechSynthesis.onvoiceschanged = () => {
      voiceOptions = window.speechSynthesis.getVoices();
      setVoices(voiceOptions);
    };
  }, []);

  const handleEnd = () => {
    setSpeaking(false);
    onEnd();
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setSupported(true);
      getVoices();
    }
  }, [getVoices]);

  const speak = (args: SpeakText) => {
    const {
      voice = null,
      text = "",
      rate = 1,
      pitch = 1,
      volume = 1,
      lang = "en",
    } = args;

    if (!supported) return;

    setSpeaking(true);
    // Firefox won't repeat an utterance that has been
    // spoken, so we need to create a new instance each time
    const utterance = new window.SpeechSynthesisUtterance();
    utterance.text = text;
    utterance.voice = voice;
    utterance.onend = handleEnd;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    utterance.lang = lang;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const cancel = () => {
    if (!supported) return;
    setSpeaking(false);
    window.speechSynthesis.cancel();
  };

  return {
    supported,
    speak,
    speaking,
    cancel,
    voices,
  };
};

export default useSpeechSynthesis;
