import React, { useState, useEffect } from "react";
import { BiBook } from "react-icons/bi";

const TextToSpeech = ({ text }) => {
  const [utterance, setUtterance] = useState(null);
  const [voice, setVoice] = useState(null);
  const [pitch] = useState(1);
  const [rate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [voices, setVoices] = useState([]);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const synth = window.speechSynthesis;

    const loadVoices = () => {
      const voicesList = synth.getVoices();
      setVoices(voicesList);

      if (voicesList.length > 0 && !voice) {
        setVoice(voicesList[7]);
      }
    };

    loadVoices();
    synth.onvoiceschanged = loadVoices;

    return () => {
      synth.cancel();
    };
  }, [voice]);

  useEffect(() => {
    if (text) {
      const synth = window.speechSynthesis;
      const u = new SpeechSynthesisUtterance(text);
      u.pitch = pitch;
      u.rate = rate;
      u.volume = volume;
      u.voice = voice;

      setUtterance(u);

      return () => {
        synth.cancel();
      };
    }
  }, [text, voice, pitch, rate, volume]);

  const handlePlay = () => {
    const synth = window.speechSynthesis;

    synth.speak(utterance);
  };

  // Shake the BiBook icon
  useEffect(() => {
    const interval = setInterval(() => {
      setShake(true); // Trigger the shake class
      setTimeout(() => setShake(false), 500); // Remove the shake class after animation duration
    }, 5000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <>
      <BiBook
        size={40}
        color="white"
        onClick={handlePlay}
        style={{ cursor: "pointer" }}
        className={shake ? "shake" : ""}
      />
    </>
  );
};

export default TextToSpeech;
