import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { InteractiveDictionary } from "../store/interactiveDictionariesSlice";
import "./InteractiveDictionary.scss"

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
  console.log(dictionary)
  const [words, setWords] = useState<InteractiveWord[]>([]);

  const fetchWords = useCallback(async () => {
    try {
      const response = await axios.post<InteractiveWord[]>(
        "http://localhost:3008/interactivewords",
        {
          topicId: dictionary.id,
        }
      );
      setWords(response.data);
    } catch (error) {
      console.error("Error fetching results", error);
    }
  }, [dictionary]);
  console.log(words);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  return (
    <div className="container">
      <div className="title">{dictionary.name}</div>
      <div className="content">
        <div className="images">
          {words &&
            words.length > 0 &&
            words.map((word) => (
              <div className="image-wrapper">
                <img src={word.image} alt={`image-${word.title}`} />
              </div>
            ))}
        </div>
        <div className="names">
          {words &&
            words.length > 0 &&
            words.map((word) => (
              <div className="image-wrapper">
                <span>
                  {word.title} - {word.translate}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default InteractiveDictionaryPage;
