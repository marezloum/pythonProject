import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SearchComponent.scss";
import { Link, useLocation } from "react-router-dom";

// Тип для элементов, возвращаемых из API
interface ResultItem {
  id: string;
  title: string;
  translate: string;
  likes: number;
}

// Функциональный компонент поиска
const SearchComponent: React.FC<{ show: boolean }> = ({ show }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<ResultItem[]>([]);
  const location = useLocation();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/js/search.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Обработчик события нажатия клавиши в поле поиска
  const handleKeyUp = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    const term = (event.target as HTMLInputElement).value;
    if (term) {
      try {
        const response = await axios.get<ResultItem[]>(
          `http://localhost:3008/search?term=${term}`
        );
        setResults(response.data);
        if (response.data.length > 0) {
          global.hasSearchResult = true;
        }
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    } else {
      setResults([]);
    }
  };

  return (
    <div className={`search-component ${show ? "show" : ""}`}>
      <input
        type="text"
        placeholder="Поиск"
        id="searchInput"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        onKeyUp={handleKeyUp}
      />
      {results.length > 0 && (
        <div className="wordList" id="wordList">
          <ul className="nameList">
            {results.map((result) => (
              <li key={result.id} className="name">
                <span className="likes">
                  <i className="fa-solid fa-heart"></i>
                  <span>{result.likes ?? 0}</span>
                </span>
                <Link
                  to={
                    location.pathname === "/word"
                      ? location.pathname
                      : "/word"
                  }
                  state={{ wordId: result.id }}
                  onClick={(e) => {
                    if (location.pathname === "/word") {
                      e.preventDefault();
                      window.history.replaceState(
                        null,
                        "",
                        `/word?wordId=${result.id}`
                      );
                      window.dispatchEvent(new Event("popstate"));
                    }
                  }}
                  className="title"
                  aria-label="Перейти к слову"
                >
                  <span>{result.title}</span>
                </Link>
                <span className="translate">{result.translate}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
