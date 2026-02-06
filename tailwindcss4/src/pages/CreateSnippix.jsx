import { useState, useRef, useEffect } from "react";
import {
  Stage,
  Layer,
  Rect,
  Image as KonvaImage,
  Transformer,
} from "react-konva";
import useImage from "use-image";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";

import {
  blobUrlToFile,
  compressImage,
  uploadImageToCloudinary,
} from "../utils/imageUpload";

/* ---------------- CONFIG ---------------- */
const PAGE_WIDTH = 440;
const PAGE_HEIGHT = 600;
const SPINE_WIDTH = 2;

export default function CreateSnippix() {
  const navigate = useNavigate();
  const auth = getAuth();

  /* ---------------- STATE ---------------- */
  const [pages, setPages] = useState([{ id: 0, elements: [] }]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fileRef = useRef(null);
  const stageRef = useRef(null);

  const currentElements = pages[currentPage]?.elements || [];
  const selectedElement = currentElements.find((e) => e.id === selectedId);

  /* ---------------- ELEMENT HELPERS ---------------- */
  const updateElement = (id, updates) => {
    setPages((prev) =>
      prev.map((page, idx) =>
        idx !== currentPage
          ? page
          : {
              ...page,
              elements: page.elements.map((el) =>
                el.id === id ? { ...el, ...updates } : el
              ),
            }
      )
    );
  };

  const deleteSelected = () => {
    if (!selectedId) return;

    setPages((prev) =>
      prev.map((page, idx) =>
        idx !== currentPage
          ? page
          : {
              ...page,
              elements: page.elements.filter((el) => el.id !== selectedId),
            }
      )
    );

    setSelectedId(null);
  };

  const duplicateSelected = () => {
    if (!selectedElement) return;

    setPages((prev) =>
      prev.map((page, idx) =>
        idx !== currentPage
          ? page
          : {
              ...page,
              elements: [
                ...page.elements,
                {
                  ...selectedElement,
                  id: Date.now(),
                  x: selectedElement.x + 20,
                  y: selectedElement.y + 20,
                  zIndex: Date.now(),
                },
              ],
            }
      )
    );
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

  /* ---------------- ADD IMAGE ---------------- */
  const addImage = (file) => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const aspect = img.width / img.height;
      const width = 180;
      const height = width / aspect;

      setPages((prev) =>
        prev.map((page, idx) =>
          idx !== currentPage
            ? page
            : {
                ...page,
                elements: [
                  ...page.elements,
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
                ],
              }
        )
      );
    };

    img.src = url;
  };

  /* ---------------- LOAD LAST NOTEBOOK ---------------- */
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
          if (data?.pages) {
            setPages(data.pages);
            setCurrentPage(0);
          }
        }
      } catch (err) {
        console.error("Failed to load notebook:", err);
      }
    };

    loadLastNotebook();
  }, []);

  /* ---------------- SAVE NOTEBOOK ---------------- */
  const saveNotebook = async () => {
    if (saving) return;

    const user = auth.currentUser;
    if (!user) {
      alert("Please log in first");
      return;
    }

    try {
      setSaving(true);

      const processedPages = await Promise.all(
        pages.map(async (page) => ({
          ...page,
          elements: await Promise.all(
            page.elements.map(async (el) => {
              if (el.type !== "image") return el;
              if (el.src.startsWith("https://res.cloudinary.com")) return el;

              const file = await blobUrlToFile(el.src);
              const compressed = await compressImage(file);
              const cloudUrl = await uploadImageToCloudinary(compressed);

              return { ...el, src: cloudUrl };
            })
          ),
        }))
      );

      const notebookId = Date.now().toString();
      const thumbnail =
        processedPages.flatMap((p) => p.elements).find((e) => e.type === "image")
          ?.src || "";

      await setDoc(
        doc(db, "users", user.uid, "notebooks", notebookId),
        {
          id: notebookId,
          pages: processedPages,
          pageCount: processedPages.length,
          thumbnail,
          isPublic: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      );

      setPages(processedPages);
      alert("Notebook saved successfully");
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save notebook");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- DESELECT ---------------- */
  const handleStageClick = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  };

  /* ---------------- RENDER ---------------- */
  return (
    <div className="min-h-screen bg-[#3d445e] flex items-center justify-center p-6">
      <button
        onClick={() => navigate("/home")}
        className="fixed top-6 left-6 z-50 p-3 rounded-full bg-black/20 border border-white/10 backdrop-blur-md"
      >
        <ArrowLeft size={24} className="text-white" />
      </button>

      {/* PAGE CONTROLS */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
        <button
          onClick={() => {
            setSelectedId(null);
            setPages((p) => [...p, { id: Date.now(), elements: [] }]);
            setCurrentPage(pages.length);
          }}
          className="px-3 py-2 rounded-lg bg-black/40 text-white"
        >
          ＋
        </button>

        <button
          onClick={() => {
            setSelectedId(null);
            setCurrentPage((p) => Math.max(p - 1, 0));
          }}
          disabled={currentPage === 0}
          className="px-3 py-2 rounded-lg bg-black/40 text-white disabled:opacity-30"
        >
          ◀
        </button>

        <span className="text-white/80 text-sm px-2">
          Page {currentPage + 1} of {pages.length}
        </span>

        <button
          onClick={() => {
            setSelectedId(null);
            setCurrentPage((p) =>
              Math.min(p + 1, pages.length - 1)
            );
          }}
          disabled={currentPage === pages.length - 1}
          className="px-3 py-2 rounded-lg bg-black/40 text-white disabled:opacity-30"
        >
          ▶
        </button>
      </div>

      <div className="relative">
        <div className="absolute -right-4 top-2 w-full h-full bg-black/20 rounded-r-lg -z-20" />
        <div className="absolute -right-2 top-1 w-full h-full bg-black/30 rounded-r-lg -z-10" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ rotateY: -20, opacity: 0, x: 40 }}
            animate={{ rotateY: 0, opacity: 1, x: 0 }}
            exit={{ rotateY: 20, opacity: 0, x: -40 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            style={{ transformOrigin: "left center" }}
            className="flex bg-[#fffdf7] shadow-2xl rounded-sm overflow-hidden border border-black/5"
          >
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

                {currentElements
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
          </motion.div>
        </AnimatePresence>
      </div>

      {/* DOCK */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-end gap-2 px-4 py-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10">
          <DockIcon onClick={() => fileRef.current.click()}>🖼️</DockIcon>

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

          <DockIcon onClick={saveNotebook}>💾</DockIcon>

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

/* ---------------- DRAGGABLE ELEMENT ---------------- */
function DraggableElement({
  element,
  isSelected,
  onSelect,
  onChange,
  pageWidth,
  spineWidth,
}) {
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

/* ---------------- DOCK UI ---------------- */
function DockIcon({ children, onClick, disabled, danger }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
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
