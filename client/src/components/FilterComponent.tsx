import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FilterComponent.scss"; // Import the SASS styles
import { Link } from "react-router-dom";

interface Category {
  id: string;
  name: string;
}

interface Result {
  id: string;
  title: string;
  translate: string;
  likes: number;
}

const FilterComponent: React.FC<{ show: boolean }> = ({ show }) => {
  const [filterInput, setFilterInput] = useState<string>("");
  const [selectedAlphabets, setSelectedAlphabets] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<Category["name"]>("");
  const [withVideo, setWithVideo] = useState<boolean>(false);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catResponse = await axios.get<Category[]>(
          "http://localhost:3008/categories"
        );
        setCategories(catResponse.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const handleAlphabetChange = (alphabet: string, e: any) => {
    setSelectedAlphabets((prev) =>
      prev.includes(alphabet)
        ? prev.filter((a) => a !== alphabet)
        : [...prev, alphabet]
    );

    e.target.parentElement.classList.toggle("selected");
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const options = event.target.options;
    const values: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        values.push(options[i].value);
      }
    }
    setSelectedCategory(values[0]);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.post<Result[]>(
        "http://localhost:3008/filter",
        {
          input: filterInput,
          category: selectedCategory,
          alphabets: selectedAlphabets,
          withVideo,
        }
      );
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching results", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`filter ${show ? "show" : ""}`}>
      <div className="row first">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Введите слово..."
            id="filterInput"
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
          />
          <button id="filterButton" onClick={handleSearch} disabled={loading}>
            {loading ? "Поиск..." : "Поиск"}
          </button>
        </div>
        <div className="filters">
          <div>
            <label htmlFor="input001" className="title">
              Видео
            </label>
            <label htmlFor="wordVideo" className="switchCtrl">
              <input
                id="wordVideo"
                checked={withVideo}
                onChange={() => setWithVideo(!withVideo)}
                type="checkbox"
              />
              <span className="toggle"></span>
            </label>
          </div>
        </div>
      </div>
      <div className="row second">
        <div className="alphabets">
          <div className="alphabets1">
            {["А", "Б", "В", "Г", "Д", "Е", "Ё", "Ж", "З", "И", "Й", "К"].map(
              (char) => (
                <label className="alphabet-label" key={char}>
                  <input
                    type="checkbox"
                    name="alphabet"
                    value={char}
                    onClick={(e) => handleAlphabetChange(char, e)}
                    className="alphabet-checkbox"
                  />
                  {char}
                </label>
              )
            )}
          </div>
          <div className="alphabets2">
            {["Л", "М", "Н", "О", "П", "Р", "С", "Т", "У", "Ф", "Х", "Ц"].map(
              (char) => (
                <label className="alphabet-label" key={char}>
                  <input
                    type="checkbox"
                    name="alphabet"
                    value={char}
                    onClick={(e) => handleAlphabetChange(char, e)}
                    className="alphabet-checkbox"
                  />
                  {char}
                </label>
              )
            )}
          </div>
          <div className="alphabets3">
            {["Ч", "Ш", "Щ", "Ы", "Ь", "Э", "Ю", "Я"].map((char) => (
              <label className="alphabet-label" key={char}>
                <input
                  type="checkbox"
                  name="alphabet"
                  value={char}
                  onClick={(e) => handleAlphabetChange(char, e)}
                  className="alphabet-checkbox"
                />
                {char}
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="row third">
        <div className="options">
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="styled-select"
          >
            <option value="">Выберите тематику </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {results.length > 0 && (
        <div className="wordList">
          <ul className="nameList">
            {results.map((result) => (
              <li key={result.id} className="name">
                <span className="likes">
                  <i className="fa-solid fa-heart"></i>
                  <span>{result.likes ?? 0}</span>
                </span>
                <Link
                  to={"word"}
                  state={{ wordId: result.id }}
                  className="title"
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

export default FilterComponent;
