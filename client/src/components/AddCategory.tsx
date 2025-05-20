import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import axios from "axios";
type CategoryFormState = {
  name: string;
  imageFile: File | null;
};
function AddCategory() {
  const allCategories = useSelector(
    (state: RootState) => state.categories.allCategories
  );
  const [formState, setFormState] = useState<CategoryFormState>({
    name: "",
    imageFile: null,
  });
  const [message, setMessage] = useState("");

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
      allCategories
        ?.map((category) => category.name)
        .includes(formState.name)
    )
      return;
    const formData = new FormData();
    formData.append("image", formState.imageFile);
    formData.append("name", formState.name);

    try {
      const response = await fetch(
        "http://localhost:3008/addcategory", {
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
      <h3>Категория</h3>
      <form>
        <div className="form-row">
          <label htmlFor="name">Название:</label>
          <input
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
            required
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
        <br />
        <button className="form-button" type="button" onClick={(e) => handleSubmit()}>
          Добавить категорию
        </button>
        <p>{message}</p>
      </form>
    </div>
  );
}

export default AddCategory;
