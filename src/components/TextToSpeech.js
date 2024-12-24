import React, { useState, useEffect } from "react";

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name); // Default to the first voice
      }
    };

    loadVoices();
    if (typeof window !== "undefined") {
      window.speechSynthesis.onvoiceschanged = loadVoices; // Ensure voices are loaded
    }
  }, []);

  const handleSpeak = () => {
    if (!text.trim()) {
      alert("Please enter some text!");
      return;
    }

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.voice = voices.find((voice) => voice.name === selectedVoice);

    speech.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    speech.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(speech);
  };

  const handlePause = () => {
    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    if (isSpeaking && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-4">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
        Text to Speech Converter
      </h1>
      <textarea
        placeholder="Enter text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full sm:w-2/3 h-40 p-4 rounded-lg text-black border-2 border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600 overflow-y-auto resize-none"
      />
      <select
        value={selectedVoice}
        onChange={(e) => setSelectedVoice(e.target.value)}
        className="mt-4 p-3 rounded-lg bg-white text-black w-full sm:w-2/3"
      >
        {voices.map((voice) => (
          <option key={voice.name} value={voice.name}>
            {voice.name} ({voice.lang})
          </option>
        ))}
      </select>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <button
          onClick={handleSpeak}
          disabled={isSpeaking}
          className={`px-6 py-3 text-lg rounded-lg shadow-lg transition-all duration-300 ${
            isSpeaking
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-purple-700 hover:bg-purple-900"
          }`}
        >
          Convert to Speech
        </button>
        <button
          onClick={handlePause}
          disabled={!isSpeaking || isPaused}
          className={`px-6 py-3 text-lg rounded-lg shadow-lg transition-all duration-300 ${
            !isSpeaking || isPaused
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-yellow-600 hover:bg-yellow-800"
          }`}
        >
          Pause
        </button>
        <button
          onClick={handleResume}
          disabled={!isSpeaking || !isPaused}
          className={`px-6 py-3 text-lg rounded-lg shadow-lg transition-all duration-300 ${
            !isSpeaking || !isPaused
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-800"
          }`}
        >
          Resume
        </button>
        <button
          onClick={handleStop}
          disabled={!isSpeaking}
          className={`px-6 py-3 text-lg rounded-lg shadow-lg transition-all duration-300 ${
            isSpeaking
              ? "bg-red-600 hover:bg-red-800"
              : "bg-gray-500 cursor-not-allowed"
          }`}
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default TextToSpeech;
