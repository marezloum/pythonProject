import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./VisualWord.scss";
import SearchComponent from "../components/SearchComponent";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
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

type RelatedWord = {
  id: number;
  title: string;
  translate: string;
  image: string;
};
function VisualWord() {
  const [wordData, setWordData] = useState<WordType | null>(null);
  const [relatedWords, setRelatedWords] = useState<RelatedWord[]>([]);
  const [likeId, setLikedId] = useState(0);
  const [wordId, setWordId] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const requestedWordId = location.state.wordId;

  if (!wordId && !requestedWordId) {
    navigate("/");
  }
  if (requestedWordId && !wordId) {
    setWordId(requestedWordId);
  }
  const { id: userId, likedItems } = useSelector(
    (state: RootState) => state.user.user
  );

  const getWordData = useCallback(async () => {
    try {
      const response = await axios.get<{
        wordData: WordType;
        relatedWords: RelatedWord[];
      }>("http://localhost:3008/visualword?id=" + wordId);
      response.data.wordData.examples =
        response.data.wordData.examples?.replace(/\n/g, "<br />");
      setWordData(response.data.wordData);
      setRelatedWords(response.data.relatedWords);
      if (userId) {
        const likeRecord = likedItems.visualWords.find(
          (w) => w.wordId === wordId
        );
        setLikedId(likeRecord ? likeRecord.likeId : 0);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }, [wordId, userId, likedItems.visualWords]);

  useEffect(() => {
    if (wordId) {
      getWordData();
    }
  }, [wordId, getWordData, navigate]);

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
            visualWordId: wordId,
          });
          setLikedId(response.data.likeId);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }
  };

  return (
    <div className="container regular-word">
      <SearchComponent show={true} />
      <div className="word-wrapper">
        <div className="word-info">
          {userId && (
            <div
              className={`like ${Boolean(likeId) ? "liked" : ""}`}
              onClick={() => toggleLike()}
            >
              <i className="fa-solid fa-heart"></i>
            </div>
          )}
          <div className="title">{wordData?.title}</div>
          <div className="category">{wordData?.category_name}</div>
          <div className="translate">{wordData?.translate}</div>
          <div className="tags">{wordData?.tags?.split(",").join(" ")}</div>
        </div>
        <div className="word-image">
          <img
            src={wordData?.image || "/img/word-image-placeholder.png"}
            alt="word-image"
          />
        </div>
        <div className="word-description">
          <p>{wordData?.description}</p>
        </div>
        <div className="word-examples">
          <p dangerouslySetInnerHTML={{ __html: wordData?.examples || "" }}></p>
        </div>
      </div>
      <div className="relatedWords-wrapper">
        {relatedWords &&
          relatedWords.length > 0 &&
          relatedWords
            .filter((_, index) => index < 4)
            .map((word) => (
              <div
                className="card"
                key={`related-word-${word.id}`}
                onClick={() => {
                  setWordId(word.id);
                  navigate(".", { state: { wordId: word.id } });
                }}
              >
                <div className="title">
                  <span>{word.title}</span>
                  <img
                    src={word.image || "/img/word-image-placeholder.png"}
                    alt={word.title}
                  />
                  <span>{word.title}</span>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

export default VisualWord;
