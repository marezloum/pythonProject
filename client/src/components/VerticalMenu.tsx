import React, { useState, useEffect } from "react";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

const VerticalMenu: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">(
    localStorage.getItem("theme") === "dark" ? "dark" : "light"
  );

  useEffect(() => {
    document.body.classList.toggle("dark-theme", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="vertical-menu">
      <a
        href="https://t.me/marezloum_bot"
        target="_blank"
        rel="noopener noreferrer"
        className="menu-icon telegram"
        aria-label="Телеграм"
      >
        <FontAwesomeIcon icon={faMessage} size="2x" />
      </a>
      {/* Добавьте больше иконок/ссылок здесь, если нужно */}
      <button
        className="theme-toggle-btn"
        onClick={handleThemeToggle}
        aria-label="Переключить тему"
      >
        <span className="theme-toggle-icon">
          <FontAwesomeIcon
            icon={theme === "light" ? faMoon : faSun}
            size="lg"
          />
        </span>
      </button>
    </div>
  );
};

export default VerticalMenu;
