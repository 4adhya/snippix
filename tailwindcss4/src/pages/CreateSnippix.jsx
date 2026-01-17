import { useState, useRef } from "react";
import NotebookImage from "../components/NotebookImage";

export default function CreateSnippix() {
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const fileRef = useRef(null);

  /* -------------------- ADD IMAGE -------------------- */
  const addImage = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);

    setElements((prev) => [
      ...prev,
      {
        id: Date.now(),
        src: url,
        page: "left",
        x: 60,
        y: 80,
        width: 180,
        rotation: (Math.random() - 0.5) * 10,
        zIndex: Date.now(),
      },
    ]);
  };

  /* -------------------- HELPERS -------------------- */
  const selectedElement = elements.find((el) => el.id === selectedId);

  const updateElement = (id, updates) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setElements((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  };

  const duplicateSelected = () => {
    if (!selectedElement) return;
    setElements((prev) => [
      ...prev,
      {
        ...selectedElement,
        id: Date.now(),
        x: selectedElement.x + 20,
        y: selectedElement.y + 20,
        zIndex: Date.now(),
      },
    ]);
  };

  const rotateSelected = (deg) => {
    if (!selectedElement) return;
    updateElement(selectedId, {
      rotation: selectedElement.rotation + deg,
    });
  };

  const bringForward = () => {
    if (!selectedId) return;
    updateElement(selectedId, { zIndex: Date.now() });
  };

  const sendBackward = () => {
    if (!selectedId) return;
    updateElement(selectedId, { zIndex: 1 });
  };

  const togglePage = () => {
    if (!selectedElement) return;
    updateElement(selectedId, {
      page: selectedElement.page === "left" ? "right" : "left",
    });
  };

  /* -------------------- RENDER -------------------- */
  return (
    <div className="min-h-screen bg-[#3d445e] flex items-center justify-center p-6">

      {/* NOTEBOOK */}
      <div className="relative">
        <div className="absolute -right-4 top-2 w-full h-full bg-white/20 rounded-r-lg -z-20" />
        <div className="absolute -right-2 top-1 w-full h-full bg-white/40 rounded-r-lg -z-10" />

        <div className="flex bg-[#fffdf7] shadow-2xl rounded-sm overflow-hidden border border-black/5">

          {/* LEFT PAGE */}
          <NotebookPage onSelectNone={() => setSelectedId(null)} isLeft>
            {elements
              .filter((el) => el.page === "left")
              .map((el) => (
                <NotebookImage
                  key={el.id}
                  element={el}
                  isSelected={selectedId === el.id}
                  onSelect={() => setSelectedId(el.id)}
                  onUpdate={updateElement}
                />
              ))}
          </NotebookPage>

          {/* SPINE */}
          <div className="w-[2px] bg-gradient-to-r from-black/20 to-transparent" />

          {/* RIGHT PAGE */}
          <NotebookPage onSelectNone={() => setSelectedId(null)}>
            {elements
              .filter((el) => el.page === "right")
              .map((el) => (
                <NotebookImage
                  key={el.id}
                  element={el}
                  isSelected={selectedId === el.id}
                  onSelect={() => setSelectedId(el.id)}
                  onUpdate={updateElement}
                />
              ))}
          </NotebookPage>
        </div>
      </div>

      {/* -------------------- MAC-STYLE MINI DOCK -------------------- */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-end gap-3 px-4 py-3 rounded-2xl
                        bg-black/40 backdrop-blur-xl
                        shadow-[0_20px_40px_rgba(0,0,0,0.45)]
                        border border-white/10">

          <DockIcon onClick={() => fileRef.current.click()} label="Add image">
            🖼️
          </DockIcon>

          <DockIcon onClick={duplicateSelected} disabled={!selectedId} label="Duplicate">
            📄
          </DockIcon>

          <DockIcon onClick={() => rotateSelected(-5)} disabled={!selectedId} label="Rotate left">
            ↺
          </DockIcon>

          <DockIcon onClick={() => rotateSelected(5)} disabled={!selectedId} label="Rotate right">
            ↻
          </DockIcon>

          <DockIcon onClick={bringForward} disabled={!selectedId} label="Bring forward">
            ⬆️
          </DockIcon>

          <DockIcon onClick={sendBackward} disabled={!selectedId} label="Send back">
            ⬇️
          </DockIcon>

          <DockIcon onClick={togglePage} disabled={!selectedId} label="Move page">
            📘
          </DockIcon>

          <DockIcon onClick={deleteSelected} disabled={!selectedId} danger label="Delete">
            🗑️
          </DockIcon>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        hidden
        accept="image/*"
        onChange={(e) => addImage(e.target.files[0])}
      />
    </div>
  );
}

/* -------------------- PAGE -------------------- */
function NotebookPage({ children, onSelectNone, isLeft }) {
  return (
    <div
      onClick={onSelectNone}
      className={`relative w-[440px] h-[600px] px-10 py-12 ${
        isLeft ? "border-r border-black/5" : ""
      }`}
      style={{
        backgroundImage: "linear-gradient(#f0efed 1px, transparent 1px)",
        backgroundSize: "100% 28px",
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
           onSelectNone();
        }
      }}
    >
      {children}
    </div>
  );
}

/* -------------------- DOCK ICON -------------------- */
function DockIcon({ children, onClick, disabled, danger, label }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`
        w-10 h-10 flex items-center justify-center
        rounded-xl text-xl
        transition-all duration-200
        ${disabled ? "opacity-30" : "hover:scale-125"}
        ${danger ? "hover:bg-red-500/20" : "hover:bg-white/10"}
      `}
    >
      {children}
    </button>
  );
}
