import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SearchComponent.scss"; // Import the SASS styles
import { Link, useLocation } from "react-router-dom"; // Import useLocation

// Define the type for the items returned from the API
interface ResultItem {
  id: string;
  title: string;
  translate: string;
  likes: number;
}
//react functional component (type for searchComponent)
const SearchComponent: React.FC<{ show: boolean }> = ({ show }) => {
  const [searchTerm, setSearchTerm] = useState<string>(""); //use state for search input(keyup)
  const [results, setResults] = useState<ResultItem[]>([]); //results of Api call
  const location = useLocation(); // Get the current location
  useEffect(() => {
    const script = document.createElement("script");

    script.src = "/js/search.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  //هندل کی آپ یک فانکشنه که یه ورودی داره به اسم ایونت و تایپ ایونت بعدشه
  const handleKeyUp = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    //React.KeyboardEvent یک جنریک تایپ هستش،
    //<HTMLInputElement> با نوشتن این، داریم میگیم دقیق کدوم المنت، اینجا مثلا اینپوت داریم، میتونیم دیو داشته باشیم و ...
    const term = (event.target as HTMLInputElement).value;
    //هروقت یک ایونت برای یک المنت رخ میده، مقدار ایونت توسط همان المنت پر می شود
    //event.target=input as==> type. value---> مقدار میده

    if (term) {
      //if string is not empty
      try {
        const response = await axios.get<ResultItem[]>(
          `http://localhost:3008/search?term=${term}`
        ); //ریزالتی که فانکشنِ  اکسیوز .گت  میده، یک آرایه از ریزالت آیتمه.
        setResults(response.data); //جوابِ ای پی آی
        if (response.data.length > 0) {
          global.hasSearchResult = true;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      setResults([]); // Clear results if input is empty
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
                      e.preventDefault(); // Prevent navigation
                      window.history.replaceState(
                        null,
                        "",
                        `/word?wordId=${result.id}`
                      ); // Update URL
                      window.dispatchEvent(new Event("popstate")); // Trigger state update
                    }
                  }}
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

export default SearchComponent;
