import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { InteractiveDictionary } from "../store/interactiveDictionariesSlice";
import "./InteractiveDictionary.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setUser, updateLikedItems } from "../store/userSlice";

type InteractiveWord = {
  id: number;
  likes_count: number;
  title: string;
  translate: string;
  category: string;
  image?: string;
  tags?: string;
};

function InteractiveDictionaryPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { dictionary }: { dictionary: InteractiveDictionary } = location.state;
  const [words, setWords] = useState<InteractiveWord[]>([]);
  const [activeWordId, setActiveWordId] = useState<number | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [dictionaryLikeId, setDictionaryLikedId] = useState(0);

  const { id: userId, likedItems } = useSelector(
    (state: RootState) => state.user
  );
  console.log(likedItems);

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
        setDictionaryLikedId(likeRecord ? likeRecord.likeId : 0);
      }
    } catch (error) {
      console.error("Error fetching results", error);
    }
  }, [dictionary]);

  useEffect(() => {
    fetchDictionary();
  }, [fetchDictionary]);

  const handleImageClick = (id: number, text: string) => {
    setActiveWordId(id);
    speak(text, "ru-RU"); // Play audio when clicking the image
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
  const toggleDictionaryLike = async () => {
    if (userId) {
      try {
        if (dictionaryLikeId) {
          // remove like
          const response = await axios.delete(
            `http://localhost:3008/dislike/${dictionaryLikeId}`
          );

          setDictionaryLikedId(0);
        } else {
          // like it
          const response = await axios.post("http://localhost:3008/like", {
            userId,
            interactiveDictionaryId: dictionary.id,
          });
          setDictionaryLikedId(response.data.likeId);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }
  };
  const toggleWordLike = async (wordId: number) => {
    if (userId) {
      try {
        const isLiked = likedItems.interactiveWords.some(
          (like) => like.wordId === wordId
        );

        if (isLiked) {
          // Remove like
          const likeId = likedItems.interactiveWords.find(
            (like) => like.wordId === wordId
          )?.likeId;
          if (likeId) {
            await axios.delete(`http://localhost:3008/dislike/${likeId}`);
            dispatch(
              updateLikedItems({
                ...likedItems,
                interactiveWords: likedItems.interactiveWords.filter(
                  (like) => like.wordId !== wordId
                ),
              })
            );
            setWords((prevWords) =>
              prevWords.map((word) =>
                word.id === wordId
                  ? { ...word, likes_count: word.likes_count - 1 }
                  : word
              )
            );
          }
        } else {
          // Add like
          const response = await axios.post("http://localhost:3008/like", {
            userId,
            interactive_word_id: wordId,
          });
          const likedWord = words.find((w) => w.id === wordId);
          if (likedWord) {
            const newList = { ...likedItems };
            newList.interactiveWords.push({
              likeId: response.data.likeId,
              wordId,
              wordTitle: likedWord.title,
              translate: likedWord.translate,
              image: likedWord.image!,
            });
            dispatch(updateLikedItems(newList));
            setWords((prevWords) =>
              prevWords.map((word) =>
                word.id === wordId
                  ? { ...word, likes_count: word.likes_count + 1 }
                  : word
              )
            );
          }
        }
      } catch (error) {
        console.error("Error toggling like:", error);
      }
    }
  };
  return (
    <div className="container interactive-dictionary">
      <div className="title">
        <h2>{dictionary.name}</h2>
        {/* {userId && (
          <div
            className={`like ${Boolean(dictionaryLikeId) ? "liked" : ""}`}
            onClick={() => toggleDictionaryLike()}
          >
            <i className="fa-solid fa-heart"></i>
          </div>
        )} */}
      </div>
      <div className="content">
        <div className="images">
          {words &&
            words.length > 0 &&
            words.map((word) => (
              <div
                className="image-wrapper"
                key={word.id}
                onClick={() => handleImageClick(word.id, word.title)}
              >
                <img src={word.image} alt={`image-${word.title}`} />
              </div>
            ))}
        </div>
        <div className="names">
          {words &&
            words.length > 0 &&
            words.map((word) => {
              const isLiked = likedItems.interactiveWords.some(
                (like) => like.wordId === word.id
              );
              return (
                <div className="word" key={word.id}>
                  <span className={activeWordId === word.id ? "active" : ""}>
                    <div className="title">
                      {word.title}
                      <button onClick={() => speak(word.title, "ru-RU")}>
                        <FontAwesomeIcon icon={faVolumeHigh} />
                      </button>
                    </div>
                    <div className="transalte">{word.translate}</div>
                    {userId && (
                      <div
                        className={`like ${isLiked ? "liked" : ""}`}
                        onClick={() => toggleWordLike(word.id)}
                      >
                        <i className="fa-solid fa-heart"></i>
                        <span className="likes-count">{word.likes_count}</span>
                      </div>
                    )}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default InteractiveDictionaryPage;
