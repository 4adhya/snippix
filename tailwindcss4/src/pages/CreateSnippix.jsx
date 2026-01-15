import { useState, useRef } from "react";
import DraggableImage from "../components/DraggableImage.jsx";

export default function CreateSnippix() {
  const [elements, setElements] = useState([]);
  const fileRef = useRef(null);

  const addImage = (file) => {
    if (!file) return;

    const url = URL.createObjectURL(file);

    setElements((prev) => [
      ...prev,
      {
        id: Date.now(),
        src: url,
        x: 120,
        y: 120,
        zIndex: prev.length + 1,
      },
    ]);
  };

  const updateElement = (id, data) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...data } : el))
    );
  };

  const saveSnippix = () => {
    const payload = {
      elements,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("snippix_page", JSON.stringify(payload));
    alert("Saved (check localStorage)");
  };

  return (
    <div className="min-h-screen bg-[#eee] flex flex-col items-center py-6">
      {/* Controls */}
      <div className="mb-4 flex gap-3">
        <button
          onClick={() => fileRef.current.click()}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Add Image
        </button>
        <button
          onClick={saveSnippix}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Save
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => addImage(e.target.files[0])}
        />
      </div>

      {/* Paper */}
      <div className="relative w-[420px] h-[594px] bg-[#fffdf7] shadow-lg">
        {elements.map((el) => (
          <DraggableImage
            key={el.id}
            element={el}
            onUpdate={updateElement}
          />
        ))}
      </div>
    </div>
  );
}
