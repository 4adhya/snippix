import { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";


import { getAuth } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

import {
  blobUrlToFile,
  compressImage,
  uploadImageToCloudinary,
} from "../utils/imageUpload";

const PAGE_WIDTH = 440;
const PAGE_HEIGHT = 600;
const SPINE_WIDTH = 2;

export default function CreateSnippix() {
  const navigate = useNavigate();
  const auth = getAuth();

  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fileRef = useRef(null);
  const stageRef = useRef(null);

  const selectedElement = elements.find((el) => el.id === selectedId);

  /* -------------------- ELEMENT HELPERS -------------------- */
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
      rotation: (selectedElement.rotation || 0) + deg,
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

  /* -------------------- ADD IMAGE -------------------- */
  const addImage = (file) => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const aspect = img.width / img.height;
      const width = 180;
      const height = width / aspect;

      setElements((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "image",
          src: url,
          page: "left",
          x: 60,
          y: 80,
          width,
          height,
          rotation: (Math.random() - 0.5) * 10,
          zIndex: Date.now(),
        },
      ]);
    };

    img.src = url;
  };
  /* -------------------- LOAD LAST SAVED NOTEBOOK -------------------- */
useEffect(() => {
  const loadLastNotebook = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const ref = collection(db, "users", user.uid, "notebooks");
      const q = query(ref, orderBy("updatedAt", "desc"), limit(1));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const data = snap.docs[0].data();
        if (data?.elements) {
          setElements(data.elements);
        }
      }
    } catch (err) {
      console.error("Failed to load notebook:", err);
    }
  };

  loadLastNotebook();
}, []);

  /* -------------------- SAVE NOTEBOOK -------------------- */
  const saveNotebook = async () => {
    if (saving) return;

    const user = auth.currentUser;
    if (!user) {
      alert("Please log in first");
      return;
    }

    if (elements.length === 0) {
      alert("Notebook is empty");
      return;
    }

    try {
      setSaving(true);

      const processedElements = await Promise.all(
        elements.map(async (el) => {
          if (el.type !== "image") return el;

          if (el.src.startsWith("https://res.cloudinary.com")) {
            return el;
          }

          const file = await blobUrlToFile(el.src);
          const compressed = await compressImage(file);
          const cloudUrl = await uploadImageToCloudinary(compressed);

          return { ...el, src: cloudUrl };
        })
      );

      const notebookId = Date.now().toString();

      const thumbnail =
        processedElements.find((e) => e.type === "image")?.src || "";

      await setDoc(
        doc(db, "users", user.uid, "notebooks", notebookId),
        {
          id: notebookId,
          elements: processedElements,
          pageCount: 2,
          thumbnail,
          isPublic: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      );

      setElements(processedElements);
      alert("Notebook saved successfully");
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save notebook");
    } finally {
      setSaving(false);
    }
  };

  /* -------------------- DESELECT -------------------- */
  const handleStageClick = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  };

  /* -------------------- RENDER -------------------- */
  return (
    <div className="min-h-screen bg-[#3d445e] flex items-center justify-center p-6">
      <button
        onClick={() => navigate("/home")}
        className="fixed top-6 left-6 z-50 p-3 rounded-full bg-black/20 border border-white/10 backdrop-blur-md"
      >
        <ArrowLeft size={24} className="text-white" />
      </button>

      <div className="relative">
        <div className="absolute -right-4 top-2 w-full h-full bg-black/20 rounded-r-lg -z-20" />
        <div className="absolute -right-2 top-1 w-full h-full bg-black/30 rounded-r-lg -z-10" />

        <div className="flex bg-[#fffdf7] shadow-2xl rounded-sm overflow-hidden border border-black/5">
          <Stage
            ref={stageRef}
            width={PAGE_WIDTH * 2 + SPINE_WIDTH}
            height={PAGE_HEIGHT}
            onMouseDown={handleStageClick}
            onTouchStart={handleStageClick}
          >
            <Layer>
              <Rect width={PAGE_WIDTH} height={PAGE_HEIGHT} fill="#fffdf7" />
              <Rect
                x={PAGE_WIDTH + SPINE_WIDTH}
                width={PAGE_WIDTH}
                height={PAGE_HEIGHT}
                fill="#fffdf7"
              />
              <Rect
                x={PAGE_WIDTH}
                width={SPINE_WIDTH}
                height={PAGE_HEIGHT}
                fill="rgba(0,0,0,0.1)"
              />

              {elements
                .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                .map((el) => (
                  <DraggableElement
                    key={el.id}
                    element={el}
                    isSelected={selectedId === el.id}
                    onSelect={() => setSelectedId(el.id)}
                    onChange={updateElement}
                    pageWidth={PAGE_WIDTH}
                    spineWidth={SPINE_WIDTH}
                  />
                ))}
            </Layer>
          </Stage>
        </div>
      </div>

      {/* DOCK */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-end gap-2 px-4 py-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10">
          <DockIcon onClick={() => fileRef.current.click()} label="Add image">
            🖼️
          </DockIcon>

          <DockDivider />

          <DockIcon onClick={duplicateSelected} disabled={!selectedId}>
            📄
          </DockIcon>
          <DockIcon onClick={() => rotateSelected(-15)} disabled={!selectedId}>
            ↺
          </DockIcon>
          <DockIcon onClick={() => rotateSelected(15)} disabled={!selectedId}>
            ↻
          </DockIcon>

          <DockDivider />

          <DockIcon onClick={bringForward} disabled={!selectedId}>
            ⬆️
          </DockIcon>
          <DockIcon onClick={sendBackward} disabled={!selectedId}>
            ⬇️
          </DockIcon>

          <DockDivider />

          <DockIcon onClick={saveNotebook} label="Save">
            💾
          </DockIcon>

          <DockIcon onClick={deleteSelected} disabled={!selectedId} danger>
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

/* -------------------- DRAGGABLE ELEMENT -------------------- */
function DraggableElement({ element, isSelected, onSelect, onChange, pageWidth, spineWidth }) {
  const [image] = useImage(element.src);
  const shapeRef = useRef(null);
  const trRef = useRef(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const absX =
    element.page === "left"
      ? element.x
      : pageWidth + spineWidth + element.x;

  return (
    <>
      <KonvaImage
        ref={shapeRef}
        image={image}
        x={absX}
        y={element.y}
        width={element.width}
        height={element.height}
        rotation={element.rotation || 0}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) =>
          onChange(element.id, {
            x:
              element.page === "left"
                ? e.target.x()
                : e.target.x() - (pageWidth + spineWidth),
            y: e.target.y(),
          })
        }
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
}

/* -------------------- DOCK UI -------------------- */
function DockIcon({ children, onClick, disabled, danger, label }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`w-11 h-11 rounded-xl text-xl ${
        disabled ? "opacity-30" : "hover:scale-110"
      } ${danger ? "hover:text-red-400" : "hover:text-white"} text-white/80`}
    >
      {children}
    </button>
  );
}

function DockDivider() {
  return <div className="w-px h-8 bg-white/20 mx-1" />;
}
