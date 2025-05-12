import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./ClickableVisualDictionary.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh } from "@fortawesome/free-solid-svg-icons";

type Shape = {
  title: string;
  top: number;
  left: number;
  width: number;
  height: number;
  hidden?: boolean;
};

type StateType = {
  imageSrc: string;
  title: string;
  shapes: Shape[];
};

function ClickableVisualDictionary() {
  const location = useLocation();
  const { imageSrc, title, shapes } = location.state as StateType;
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices; // Update voices when available
  }, []);

  const speak = (text: string, lang: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = voices.find((voice) => voice.lang === lang);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.pitch = 0.5; // Adjust pitch
    utterance.rate = 0.5; // Adjust pitch
    window.speechSynthesis.speak(utterance);
  };
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="clickable-visual-dictionary">
      <h1>{title}</h1>
      <div className="content">
        <div className="image-container">
          <img src={imageSrc} alt={title} />
          {shapes
            .filter((shape) => !shape.hidden)
            .map((shape, index) => (
              <div
                key={index}
                className={`shape ${
                  hoveredIndex === index ? "highlighted" : ""
                }`}
                style={{
                  top: `${shape.top}%`,
                  left: `${shape.left}%`,
                  width: `${shape.width}%`,
                  height: `${shape.height}%`,
                }}
                title={shape.title}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => speak(shape.title, "ru-RU")}
              ></div>
            ))}
        </div>
        <div className="shape-list">
          {shapes
            .filter((shape) => !shape.hidden)
            .map((shape, index) => (
              <div
                key={index}
                className={`shape-item ${
                  hoveredIndex === index ? "highlighted" : ""
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => speak(shape.title, "ru-RU")}
              >
                {shape.title}
                <FontAwesomeIcon icon={faVolumeHigh} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ClickableVisualDictionary;
