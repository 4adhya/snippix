import { useState, useRef, useEffect } from "react";
import NotebookImage from "../components/NotebookImage";

export default function CreateSnippix() {
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const fileRef = useRef(null);

  // ➕ ADD IMAGE
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

  // ✏️ UPDATE ELEMENT
  const updateElement = (id, updates) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  // 🗑 DELETE SELECTED
  const deleteSelected = () => {
    if (!selectedId) return;
    setElements((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  };

  // ⌨️ KEYBOARD DELETE
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        deleteSelected();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedId]);

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex flex-col items-center py-8">
      
      {/* TOOLBAR */}
      <div className="mb-5 flex gap-3">
        <button
          onClick={() => fileRef.current.click()}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Add Image
        </button>

        <button
          onClick={deleteSelected}
          disabled={!selectedId}
          className={`px-4 py-2 rounded text-white ${
            selectedId ? "bg-red-600" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Delete
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => addImage(e.target.files[0])}
        />
      </div>

      {/* NOTEBOOK */}
      <div className="flex gap-6">
        
        {/* LEFT PAGE */}
        <NotebookPage onClick={() => setSelectedId(null)}>
          {elements
            .filter((el) => el.page === "left")
            .map((el) => (
              <NotebookImage
                key={el.id}
                element={el}
                isSelected={el.id === selectedId}
                onSelect={() => setSelectedId(el.id)}
                onUpdate={updateElement}
              />
            ))}
        </NotebookPage>

        {/* RIGHT PAGE */}
        <NotebookPage onClick={() => setSelectedId(null)}>
          {elements
            .filter((el) => el.page === "right")
            .map((el) => (
              <NotebookImage
                key={el.id}
                element={el}
                isSelected={el.id === selectedId}
                onSelect={() => setSelectedId(el.id)}
                onUpdate={updateElement}
              />
            ))}
        </NotebookPage>

      </div>
    </div>
  );
}

/* 📖 NOTEBOOK PAGE */
function NotebookPage({ children, onClick }) {
  return (
    <div
      onClick={onClick}
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
