import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";

import "./Category.scss";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
export type Word = {
  id: number;
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

function Category() {
  const allCategories = useSelector(
    (state: RootState) => state.categories.allCategories
  );
  const [words, setWords] = useState<Word[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryId } = location.state;

  if (!categoryId) {
    navigate("/");
  }

  const categoryName = allCategories?.find(
    (category) => category.id === categoryId
  )?.name;

  const fetchItems = useCallback(async () => {
    try {
      const response = await axios.post<Word[]>(
        "http://localhost:3008/category",
        {
          categoryId,
        }
      );
      setWords(response.data);
    } catch (error) {
      console.error("Error fetching results", error);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <main>
      <div className="container">
        <div className="category-title">
          <h1>{categoryName}</h1>
        </div>
        <div className="category-items_wrapper">
          {words && words.length > 0 ? (
            words.map((word) => (
              <div className="word" key={word.id}>
                <Link to="/word" state={{ wordId: word.id }}>
                  <div className="title">{word.title}</div>
                  <div className="transalte">{word.translate}</div>
                </Link>
              </div>
            ))
          ) : (
            <div className="no-words">No words found for this category</div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Category;
