import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import "./Word.scss";
type WordType = {
  tags: string;
  title: string;
  video: string;
  likes: number;
  image: string;
  examples: string;
  translate: string;
  description: string;
  category_name: string;
};
function Word() {
  const [searchParams] = useSearchParams();
  const [wordData, setWordData] = useState<WordType | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const wordId = searchParams.get("id") || location.state.wordId;

  if (!wordId) {
    navigate("/");
  }

  const getWordData = useCallback(async () => {
    try {
      const response = await axios.get<WordType[]>(
        "http://localhost:3008/word?id=" + wordId
      );
      setWordData(response.data[0]);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }, [wordId]);

  useEffect(() => {
    if (wordId) {
      getWordData();
    }
  }, [wordId, getWordData, navigate]);

  console.log(wordData);

  return (
    <div className="container">
      <div className="word-wrapper">
        <div className="word-info">
          <div className="title">{wordData?.title}</div>
          <div className="category">{wordData?.category_name}</div>
          <div className="translate">{wordData?.translate}</div>
          <div className="tags">{wordData?.tags?.split(",").join(" ")}</div>
        </div>
        <div className="word-image">
          <img src="/img/word-image-placeholder.png" alt="word-image" />
        </div>
      </div>
    </div>
  );
}

export default Word;
