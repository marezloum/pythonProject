import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import "./AddInteractiveWord.scss";

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
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

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
      formData.append("dictionary", formState.dictionary.toString());
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
    <form className="addword-form-modern">
      <div className="addword-form-modern__flex">
        <div className="addword-form-modern__row">
          <label className="addword-form-modern__label" htmlFor="title">Слово</label>
          <input
            className="addword-form-modern__input"
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
            onBlur={() => handleBlur("title")}
            required
            style={
              touched["title"] && !formState.title
                ? { borderColor: "#f0763e", background: "#fff6f3" }
                : {}
            }
          />
        </div>
        <div className="addword-form-modern__row">
          <label className="addword-form-modern__label" htmlFor="translate">Перевод</label>
          <input
            className="addword-form-modern__input"
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
            onBlur={() => handleBlur("translate")}
            required
            style={
              touched["translate"] && !formState.translate
                ? { borderColor: "#f0763e", background: "#fff6f3" }
                : {}
            }
          />
        </div>
        <div className="addword-form-modern__row">
          <label className="addword-form-modern__label" htmlFor="dictionary">Словарь</label>
          <select
            className="addword-form-modern__select"
            id="dictionary"
            name="dictionary"
            value={formState.dictionary ?? ""}
            onChange={handleDictionaryChange}
            onBlur={() => handleBlur("dictionary")}
            style={
              touched["dictionary"] && !formState.dictionary
                ? { borderColor: "#f0763e", background: "#fff6f3" }
                : {}
            }
          >
            <option value="">Выберите словарь</option>
            {allInteractiveDictionaries?.map((dictionary) => (
              <option key={"dictionary-" + dictionary.name} value={dictionary.id}>{dictionary.name}</option>
            ))}
          </select>
        </div>
        <div className="addword-form-modern__row">
          <label className="addword-form-modern__label" htmlFor="tags">Теги</label>
          <input
            className="addword-form-modern__input"
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
        <div className="addword-form-modern__row">
          <label className="addword-form-modern__label" htmlFor="image">Изображение</label>
          <input
            className="addword-form-modern__input"
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            onBlur={() => handleBlur("imageFile")}
            style={
              touched["imageFile"] && !formState.imageFile
                ? { borderColor: "#f0763e", background: "#fff6f3" }
                : {}
            }
          />
        </div>
        <div className="addword-form-modern__row addword-form-modern__row--button">
          <button
            className="addword-form-modern__button"
            type="button"
            onClick={handleSubmit}
          >
            Добавить
          </button>
        </div>
      </div>
      <p>{message}</p>
    </form>
  );
}

export default AddInteractiveWord;
