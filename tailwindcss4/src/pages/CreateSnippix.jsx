import { useState, useRef } from "react";
import NotebookImage from "../components/NotebookImage";

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
        page: "left", // left | right
        x: 80,
        y: 120,
        width: 160,
        rotation: 0,
        zIndex: prev.length + 1,
      },
    ]);
  };

  const updateElement = (id, updates) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const deleteElement = (id) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex flex-col items-center py-8">
      {/* Toolbar */}
      <div className="mb-5 flex gap-3">
        <button
          onClick={() => fileRef.current.click()}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Add Image
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => addImage(e.target.files[0])}
        />
      </div>

      {/* Open Notebook */}
      <div className="flex gap-6">
        {/* LEFT PAGE */}
        <NotebookPage>
          {elements
            .filter((el) => el.page === "left")
            .map((el) => (
              <NotebookImage
                key={el.id}
                element={el}
                onUpdate={updateElement}
                onDelete={deleteElement}
              />
            ))}
        </NotebookPage>

        {/* RIGHT PAGE */}
        <NotebookPage>
          {elements
            .filter((el) => el.page === "right")
            .map((el) => (
              <NotebookImage
                key={el.id}
                element={el}
                onUpdate={updateElement}
                onDelete={deleteElement}
              />
            ))}
        </NotebookPage>
      </div>
    </div>
  );
}

function NotebookPage({ children }) {
  return (
    <div
      className="relative w-[420px] h-[594px] bg-[#fffdf7]
                 shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                 rounded-[2px] px-6 py-8"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px)",
        backgroundSize: "100% 24px",
      }}
    >
      {children}
    </div>
  );
}
