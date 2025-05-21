import React from "react";
import "./AddWord.scss";
import AddNormalWord from "../components/AddNormalWord";
import AddInteractiveWord from "../components/AddInteractiveWord";
import AddCategory from "../components/AddCategory";
import AddInteractiveDictionary from "../components/AddInteractiveDictionary";
function AddWord() {
  const [selectedForm, setSelectedForm] = React.useState("normal");
  const handleSelectForm = (form: string) => {
    setSelectedForm(form);
  };

  return (
    <div className="container add-word">
      <div className="switch-row">
        <button
          onClick={() => handleSelectForm("normal")}
          className={`form-button ${selectedForm === "normal" ? "active" : ""}`}
        >
          обычное слово
        </button>
        <button
          onClick={() => handleSelectForm("interactive")}
          className={`form-button ${
            selectedForm === "interactive" ? "active" : ""
          }`}
        >
          интерактивное слово
        </button>
        <button
          onClick={() => handleSelectForm("category")}
          className={`form-button ${
            selectedForm === "category" ? "active" : ""
          }`}
        >
          категорию
        </button>
        <button
          onClick={() => handleSelectForm("interactiveDictionary")}
          className={`form-button ${
            selectedForm === "interactiveDictionary" ? "active" : ""
          }`}
        >
          интерактивный словарь
        </button>
      </div>
      {selectedForm === "normal" && <AddNormalWord />}

      {selectedForm === "interactive" && <AddInteractiveWord />}

      {selectedForm === "category" && <AddCategory />}

      {selectedForm === "interactiveDictionary" && <AddInteractiveDictionary />}
    </div>
  );
}

export default AddWord;
