import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { InteractiveDictionary } from "../store/interactiveDictionariesSlice";
import "./InteractiveDictionary.scss";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

type InteractiveWord = {
  id: number;
  title: string;
  translate: string;
  category: string;
  image: string;
  tags: string;
};

function InteractiveDictionaryPage() {
  const location = useLocation();
  const { dictionary }: { dictionary: InteractiveDictionary } = location.state;
  const [words, setWords] = useState<InteractiveWord[]>([]);
  const [activeWordId, setActiveWordId] = useState<number | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [likeId, setLikedId] = useState(0);

  const { id: userId, likedItems } = useSelector(
    (state: RootState) => state.user.user
  );

  const fetchDictionary = useCallback(async () => {
    try {
      const response = await axios.post<InteractiveWord[]>(
        "http://localhost:3008/interactivewords",
        {
          topicId: dictionary.id,
        }
      );
      const sortedWords = response.data.sort(
        (a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0)
      );
      setWords(sortedWords);
      if (userId) {
        const likeRecord = likedItems.visualWords.find(
          (w) => w.wordId === dictionary.id
        );
        setLikedId(likeRecord ? likeRecord.likeId : 0);
      }
    } catch (error) {
      console.error("Error fetching results", error);
    }
  }, [dictionary]);

  useEffect(() => {
    fetchDictionary();
  }, [fetchDictionary]);

  const handleImageClick = (id: number) => {
    setActiveWordId(id);
  };

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
    window.speechSynthesis.speak(utterance);
  };
  const toggleLike = async () => {
    if (userId) {
      try {
        if (likeId) {
          // remove like
          const response = await axios.delete(
            `http://localhost:3008/dislike/${likeId}`
          );

          setLikedId(0);
        } else {
          // like it
          const response = await axios.post("http://localhost:3008/like", {
            userId,
            interactive_dictionary_id: dictionary.id,
          });
          setLikedId(response.data.likeId);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }
  };
  return (
    <div className="container interactive-dictionary">
      <div className="title">
        <h2>{dictionary.name}</h2>
        {userId && (
          <div
            className={`like ${Boolean(likeId) ? "liked" : ""}`}
            onClick={() => toggleLike()}
          >
            <i className="fa-solid fa-heart"></i>
          </div>
        )}
      </div>
      <div className="content">
        <div className="images">
          {words &&
            words.length > 0 &&
            words.map((word) => (
              <div
                className="image-wrapper"
                key={word.id}
                onClick={() => handleImageClick(word.id)}
              >
                <img src={word.image} alt={`image-${word.title}`} />
              </div>
            ))}
        </div>
        <div className="names">
          {words &&
            words.length > 0 &&
            words.map((word) => (
              <div className="word" key={word.id}>
                <span className={activeWordId === word.id ? "active" : ""}>
                  <div className="title">
                    {word.title}
                    <button onClick={() => speak(word.title, "ru-RU")}>
                      <FontAwesomeIcon icon={faVolumeHigh} />
                    </button>
                  </div>
                  <div className="transalte">{word.translate}</div>
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default InteractiveDictionaryPage;
