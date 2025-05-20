import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

type InteractiveWordFormState = {
  title: string;
  translate: string;
  tags: string;
  dictionary: number | null;
  imageFile: File | null;
  imageUrl: string | null;
};

function AddInteractiveWord() {
  const allInteractiveDictionaries = useSelector(
    (state: RootState) =>
      state.interactiveDictionaries.allInteractiveDictionaries
  );

  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState<InteractiveWordFormState>({
    title: "",
    translate: "",
    tags: "",
    dictionary: null,
    imageFile: null,
    imageUrl: null,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormState((prevState) => ({
        ...prevState,
        imageFile: e.target.files![0],
      }));
    }
  };

  const handleDictionaryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === "" ? null : parseInt(e.target.value, 10);
    setFormState((prevState) => ({ ...prevState, dictionary: value }));
  };

  const handleSubmit = async () => {
    if (
      !formState.title ||
      !formState.translate ||
      !formState.dictionary ||
      !formState.imageFile
    )
      return;
    const formData = new FormData();
    formData.append("image", formState.imageFile);
    formData.append("tags", formState.tags);
    formData.append("title", formState.title);
    formData.append("translate", formState.translate);
    if (formState.dictionary !== null) {
      formData.append("dictionary", formState.dictionary.toString()); // Convert to string if not null
    }

    try {
      const response = await fetch("http://localhost:3008/addinteractiveword", {
        method: "POST",
        body: formData,
      });
      const json = await response.json();
      setMessage(json.message);
      console.log(json.message);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="form">
      <h3>Интерактивное слово</h3>
      <form>
        <div className="form-row">
          <label htmlFor="title">Слово:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formState.title}
            onChange={(e) =>
              setFormState((prevState) => ({
                ...prevState,
                title: e.target.value,
              }))
            }
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="translate">Перевод:</label>
          <input
            type="text"
            id="translate"
            name="translate"
            value={formState.translate}
            onChange={(e) =>
              setFormState((prevState) => ({
                ...prevState,
                translate: e.target.value,
              }))
            }
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="dictionary">Словарь:</label>
          <select
            id="dictionary"
            name="dictionary"
            value={formState.dictionary ?? ""}
            onChange={handleDictionaryChange}
          >
            <option value="">Выберите словарь</option>
            {allInteractiveDictionaries?.map((dictionary) => (
              <option key={"dictionary-" + dictionary.name} value={dictionary.id}>{dictionary.name}</option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="tags">Теги:</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formState.tags || ""}
            onChange={(e) =>
              setFormState((prevState) => ({
                ...prevState,
                tags: e.target.value,
              }))
            }
          />
        </div>
        <h4>Медиафайлы</h4>
        <div className="form-row">
          <label htmlFor="image">Изображение:</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button className="form-button" type="button" onClick={(e) => handleSubmit()}>
          Добавить слово
        </button>
        <p>{message}</p>
      </form>
    </div>
  );
}

export default AddInteractiveWord;
