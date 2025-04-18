import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import axios from "axios";

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
    <div className="form">
      <h3>Interactive Dictionary</h3>
      <form>
        <label htmlFor="name">name:</label>
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
        <br />
        <h4>Media Files</h4>
        <label htmlFor="image">Image:</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
        />
        <br />
        <button type="button" onClick={(e) => handleSubmit()}>
          Add Word
        </button>{" "}
        <p>{message}</p>
      </form>
    </div>
  );
}

export default AddInteractiveDictionary;
