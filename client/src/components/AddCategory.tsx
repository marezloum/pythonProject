import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import axios from "axios";

function AddCategory() {
  const allCategories = useSelector(
    (state: RootState) => state.categories.allCategories
  );
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!name || allCategories?.map((category) => category.name).includes(name))
      return;
    try {
      const response = await axios.post("http://localhost:3008/addcategory", {
        name,
      });
      console.log(response);
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="form">
      <h3>Category</h3>
      <form>
        <label htmlFor="name">name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <button type="button" onClick={(e) => handleSubmit()}>
          Add Category
        </button>
        <p>{message}</p>
      </form>
    </div>
  );
}

export default AddCategory;
