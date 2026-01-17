import { useState, useRef, useEffect } from "react";
import NotebookImage from "../components/NotebookImage";

export default function CreateSnippix() {
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const fileRef = useRef(null);

  // Keyboard shortcut to delete
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        setElements((prev) => prev.filter((el) => el.id !== selectedId));
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedId]);

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
        rotation: (Math.random() - 0.5) * 6, // Random organic tilt
        zIndex: prev.length + 1,
      },
    ]);
  };

  const updateElement = (id, updates) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  return (
    <div className="min-h-screen bg-[#3d445e] flex flex-col items-center justify-center p-4">
      
      {/* THE NOTEBOOK CONTAINER */}
      <div className="relative flex">
        
        {/* Background Stacked Page Effect (Right Side) */}
        <div className="absolute -right-4 top-2 w-full h-full bg-white/20 rounded-r-lg -z-20 shadow-xl" />
        <div className="absolute -right-2 top-1 w-full h-full bg-white/40 rounded-r-lg -z-10" />

        <div className="flex bg-[#fffdf7] shadow-2xl rounded-sm overflow-hidden relative border border-black/5">
            {/* Left Page */}
            <NotebookPage onSelectNone={() => setSelectedId(null)} isLeft={true}>
                {elements.filter(el => el.page === "left").map(el => (
                    <NotebookImage 
                        key={el.id} 
                        element={el} 
                        isSelected={selectedId === el.id}
                        onSelect={() => setSelectedId(el.id)}
                        onUpdate={updateElement}
                    />
                ))}
            </NotebookPage>

            {/* Spine Vertical Shadow */}
            <div className="w-[2px] h-full bg-gradient-to-r from-black/20 to-transparent z-10" />

            {/* Right Page */}
            <NotebookPage onSelectNone={() => setSelectedId(null)} isLeft={false}>
                 {/* Content for right page */}
            </NotebookPage>
        </div>
      </div>

      {/* PAPER DOCK (Floating bottom toolbar) */}
      <div className="fixed bottom-10 flex items-center bg-[#1c1c1e]/90 backdrop-blur-md px-8 py-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] gap-6 border border-white/10">
          <button 
            onClick={() => fileRef.current.click()} 
            className="hover:scale-125 transition-transform duration-200"
          >
             <span className="text-3xl filter drop-shadow-md">🖼️</span>
          </button>
          
          <div className="h-8 w-[1px] bg-white/10" />
          
          <button 
             onClick={() => {
                setElements(prev => prev.filter(el => el.id !== selectedId));
                setSelectedId(null);
             }}
             disabled={!selectedId}
             className={`text-2xl transition-all ${selectedId ? "opacity-100 scale-100" : "opacity-20 scale-90"}`}
          >
             🗑️
          </button>

          <input ref={fileRef} type="file" hidden accept="image/*" onChange={(e) => addImage(e.target.files[0])} />
      </div>
    </div>
  );
}

function NotebookPage({ children, onSelectNone, isLeft }) {
  return (
    <div 
      onClick={onSelectNone}
      className={`relative w-[440px] h-[620px] px-10 py-12 overflow-hidden ${isLeft ? 'border-r border-black/5' : ''}`}
      style={{
        backgroundImage: "linear-gradient(#f0efed 1px, transparent 1px)",
        backgroundSize: "100% 32px" // Classic notebook line spacing
      }}
    >
      {children}
    </div>
  );
}