import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import "./AddInteractiveDictionary.scss";

type InteractiveDictionaryFormState = {
  name: string;
  imageFile: File | null;
};

function AddInteractiveDictionary() {
  const allInteractiveDictionaries = useSelector(
    (state: RootState) =>
      state.interactiveDictionaries.allInteractiveDictionaries
  );
  const [formState, setFormState] = useState<InteractiveDictionaryFormState>({
    name: "",
    imageFile: null,
  });
  const [message, setMessage] = useState("");
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

  const handleSubmit = async () => {
    if (
      !formState.name ||
      !formState.imageFile ||
      allInteractiveDictionaries
        ?.map((dictionary) => dictionary.name)
        .includes(formState.name)
    )
      return;
    const formData = new FormData();
    formData.append("image", formState.imageFile);
    formData.append("name", formState.name);

    try {
      const response = await fetch(
        "http://localhost:3008/addinteractivedictionary",
        {
          method: "POST",
          body: formData,
        }
      );
      const json = await response.json();
      setMessage(json.message);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <form className="addword-form-modern">
      <div className="addword-form-modern__flex">
        <div className="addword-form-modern__row">
          <label className="addword-form-modern__label" htmlFor="name">
            Название
          </label>
          <input
            className="addword-form-modern__input"
            type="text"
            id="name"
            name="name"
            value={formState.name}
            onChange={(e) =>
              setFormState((prevState) => ({
                ...prevState,
                name: e.target.value,
              }))
            }
            onBlur={() => handleBlur("name")}
            required
            style={
              touched["name"] && !formState.name
                ? { borderColor: "#f0763e", background: "#fff6f3" }
                : {}
            }
          />
        </div>
        <div className="addword-form-modern__row">
          <label className="addword-form-modern__label" htmlFor="image">
            Изображение
          </label>
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
        <div className="addword-form-modern__row addword-form-modern__row--button w-100">
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

export default AddInteractiveDictionary;
