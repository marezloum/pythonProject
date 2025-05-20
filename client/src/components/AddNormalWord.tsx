import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import "./AddNormalWord.scss";
type NomralWordFormState = {
  title: string;
  translate: string;
  description: string;
  tags: string;
  dictionary: string | null;
  category: number | null;
  examples: string;
  imageFile: File | null;
  videoFile: File | null;
  imageUrl: string | null;
  videoUrl: string | null;
};
function AddNormalWord() {
  const allCategories = useSelector(
    (state: RootState) => state.categories.allCategories
  );
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState<NomralWordFormState>({
    title: "",
    translate: "",
    description: "",
    tags: "",
    dictionary: null,
    category: null,
    examples: "",
    imageFile: null,
    videoFile: null,
    imageUrl: null,
    videoUrl: null,
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

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormState((prevState) => ({
        ...prevState,
        videoFile: e.target.files![0],
      }));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === "" ? null : parseInt(e.target.value, 10);
    setFormState((prevState) => ({ ...prevState, category: value }));
  };

  const handleSubmit = async () => {
    if (
      !formState.title ||
      !formState.translate ||
      !formState.category ||
      !formState.imageFile
    )
      return;
    const formData = new FormData();
    formData.append("image", formState.imageFile);
    formData.append("video", formState.videoFile || "");
    formData.append("tags", formState.tags);
    formData.append("title", formState.title);
    formData.append("translate", formState.translate);
    if (formState.category !== null) {
      formData.append("category", formState.category.toString()); // Convert to string if not null
    }
    formData.append("description", formState.description);
    formData.append("dictionary", formState.dictionary || ""); // Append only if it's not null
    formData.append("examples", formState.examples);

    try {
      const response = await fetch("http://localhost:3008/addnormalword", {
        method: "POST",
        body: formData,
      });
      const json = await response.json();

      setMessage(json.message);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="form">
      <h3>Обычное слово</h3>
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
            onBlur={() => handleBlur("title")}
            required
            style={
              touched["title"] && !formState.title
                ? { borderColor: "#f0763e", background: "#fff6f3" }
                : {}
            }
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
            onBlur={() => handleBlur("translate")}
            required
            style={
              touched["translate"] && !formState.translate
                ? { borderColor: "#f0763e", background: "#fff6f3" }
                : {}
            }
          />
        </div>
        <div className="form-row">
          <label htmlFor="description">Описание:</label>
          <textarea
            id="description"
            name="description"
            value={formState.description}
            onChange={(e) =>
              setFormState((prevState) => ({
                ...prevState,
                description: e.target.value,
              }))
            }
          ></textarea>
        </div>
        <div className="form-row">
          <label htmlFor="dictionary">Словарь:</label>
          <input
            type="text"
            id="dictionary"
            name="dictionary"
            value={formState.dictionary || ""}
            onChange={(e) =>
              setFormState((prevState) => ({
                ...prevState,
                dictionary: e.target.value,
              }))
            }
          />
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
        <div className="form-row">
          <label htmlFor="category">Категория:</label>
          <select
            id="category"
            name="category"
            value={formState.category ?? ""}
            onChange={handleCategoryChange}
            onBlur={() => handleBlur("category")}
            style={
              touched["category"] && !formState.category
                ? { borderColor: "#f0763e", background: "#fff6f3" }
                : {}
            }
          >
            <option value="">Выберите категорию</option>
            {allCategories?.map((category) => (
              <option key={"category-" + category.name} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="examples">Примеры:</label>
          <textarea
            id="examples"
            name="examples"
            value={formState.examples}
            onChange={(e) =>
              setFormState((prevState) => ({
                ...prevState,
                examples: e.target.value,
              }))
            }
          ></textarea>
        </div>
        <h4>Медиафайлы</h4>
        <div className="form-row">
          <label htmlFor="image">Изображение:</label>
          <input
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
        <div className="form-row">
          <label htmlFor="video">Видео:</label>
          <input
            type="file"
            id="video"
            accept="video/*"
            onChange={handleVideoChange}
          />
        </div>
        <button className="form-button" type="button" onClick={(e) => handleSubmit()}>
          Добавить слово
        </button>{" "}
        <p>{message}</p>
      </form>
    </div>
  );
}

export default AddNormalWord;
