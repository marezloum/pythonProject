import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Ask.scss";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

type Question = {
  id: number;
  comment: string;
  parent_id: number | null;
  user_id: number;
  display_name: string;
};

const Ask: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showReplies, setShowReplies] = useState<{ [key: number]: boolean }>({});
  const [newQuestion, setNewQuestion] = useState("");
  const [reply, setReply] = useState<{ [key: number]: string }>({});
  const [activeReplyBox, setActiveReplyBox] = useState<number | null>(null);
  const { id: userId } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const res = await axios.get("http://localhost:3008/questions");
    setQuestions(res.data);
  };

  const handlePostQuestion = async () => {
    if (!newQuestion.trim()) return;
    await axios.post("http://localhost:3008/questions", {
      comment: newQuestion,
      parent_id: null,
      user_id: userId,
    });
    setNewQuestion("");
    fetchQuestions();
  };

  const handlePostReply = async (parentId: number) => {
    if (!reply[parentId]?.trim()) return;
    await axios.post("http://localhost:3008/questions", {
      comment: reply[parentId],
      parent_id: parentId,
      user_id: userId,
    });
    setReply((r) => ({ ...r, [parentId]: "" }));
    setActiveReplyBox(null);
    fetchQuestions();
  };

  const parentQuestions = questions.filter((q) => q.parent_id === null);
  const repliesByParent = (parentId: number) =>
    questions.filter((q) => q.parent_id === parentId);

  // Recursive render for nested replies
  const renderReplies = (parentId: number, level = 1) => {
    const replies = repliesByParent(parentId);
    if (replies.length === 0) return null;
    return (
      <div className="replies" style={{ marginLeft: level * 16 }}>
        {replies.map((r) => (
          <div key={r.id}>
            <div className="reply">
              <span className="author">{r.display_name || "Пользователь"}</span>: {r.comment}
              {userId && (
                <button
                  className="reply-btn"
                  onClick={() => setActiveReplyBox(r.id === activeReplyBox ? null : r.id)}
                  style={{ marginLeft: 8 }}
                >
                  ответить
                </button>
              )}
            </div>
            {activeReplyBox === r.id && userId && (
              <div className="reply-form">
                <textarea
                  placeholder="Напишите ответ..."
                  value={reply[r.id] || ""}
                  onChange={(e) =>
                    setReply((prev) => ({ ...prev, [r.id]: e.target.value }))
                  }
                />
                <button onClick={() => handlePostReply(r.id)}>Ответить</button>
              </div>
            )}
            {/* Render nested replies */}
            {renderReplies(r.id, level + 1)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="ask-page">
      <h1>Форум</h1>
      {userId && (
        <div className="ask-form">
          <textarea
            placeholder="Задайте вопрос..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          <button onClick={handlePostQuestion}>Опубликовать вопрос</button>
        </div>
      )}
      <div className="questions-list">
        {parentQuestions.map((q) => (
          <div className="question-block" key={q.id}>
            <div className="question">
              <span className="author">{q.display_name || "Пользователь"}</span>: {q.comment}
            </div>
            <button
              className="toggle-replies"
              onClick={() =>
                setShowReplies((prev) => ({
                  ...prev,
                  [q.id]: !prev[q.id],
                }))
              }
            >
              {showReplies[q.id] ? "Скрыть ответы" : "Показать ответы"}
            </button>
            {showReplies[q.id] && (
              <div className="replies">
                {repliesByParent(q.id).length === 0 && (
                  <div className="no-replies">Ответов пока нет.</div>
                )}
                {/* Always show reply form for top-level question */}
                {userId && (
                  <div className="reply-form ">
                    <textarea
                      placeholder="Напишите ответ..."
                      value={reply[q.id] || ""}
                      onChange={(e) =>
                        setReply((prev) => ({ ...prev, [q.id]: e.target.value }))
                      }
                    />
                    <button onClick={() => handlePostReply(q.id)}>Ответить</button>
                  </div>
                )}
                {/* Render all nested replies */}
                {renderReplies(q.id)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ask;
