import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams(); // Get query parameters
  const [wordData, setWordData] = useState<WordType | null>(null);
  const [relatedWords, setRelatedWords] = useState<RelatedWord[]>([]);
  const [likeId, setLikedId] = useState(0);
  const [wordId, setWordId] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const requestedWordId = searchParams.get("wordId") || location.state?.wordId; // Use query param or state

  if (!wordId && !requestedWordId) {
    navigate("/");
  }
  if (requestedWordId && !wordId) {
    setWordId(Number(requestedWordId));
  } else if (requestedWordId && wordId !== Number(requestedWordId)) {
    setWordId(Number(requestedWordId));
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
    <div className="visual-word-page">
      <SearchComponent show={true} />
      <div className="container">
        <div className="word-image">
          <img
            src={wordData?.image || "/img/word-image-placeholder.png"}
            alt="word-image"
          />
        </div>
        <div className="word-info">
          <div className="title">{wordData?.title}</div>
          <div className="translate">{wordData?.translate}</div>
          <div className="tags">{wordData?.tags?.split(",").join(" ")}</div>
          <div className="description">{wordData?.description}</div>
          <div
            className="examples"
            dangerouslySetInnerHTML={{ __html: wordData?.examples || "" }}
          ></div>
          {userId && (
            <button
              className={`like-button ${Boolean(likeId) ? "liked" : ""}`}
              onClick={() => toggleLike()}
            >
              {Boolean(likeId) ? "Liked" : "Like"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default VisualWord;
