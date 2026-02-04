import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { ArrowLeft } from "lucide-react";

import { db } from "../firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

const PAGE_WIDTH = 440;
const PAGE_HEIGHT = 600;
const SPINE_WIDTH = 2;

export default function ViewNotebook() {
  const { uid } = useParams();
  const navigate = useNavigate();

  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(true);

  /* -------------------- LOAD USER NOTEBOOK -------------------- */
  useEffect(() => {
    const loadNotebook = async () => {
      try {
        const ref = collection(db, "users", uid, "notebooks");
        const q = query(ref, orderBy("updatedAt", "desc"), limit(1));
        const snap = await getDocs(q);

        if (!snap.empty) {
          setElements(snap.docs[0].data().elements || []);
        }
      } catch (err) {
        console.error("Failed to load notebook", err);
      } finally {
        setLoading(false);
      }
    };

    loadNotebook();
  }, [uid]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#3d445e] text-white">
        Loading notebook…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#3d445e] flex items-center justify-center p-6">
      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 p-3 rounded-full bg-black/20 border border-white/10 backdrop-blur-md"
      >
        <ArrowLeft size={24} className="text-white" />
      </button>

      <div className="relative">
        <div className="absolute -right-4 top-2 w-full h-full bg-black/20 rounded-r-lg -z-20" />
        <div className="absolute -right-2 top-1 w-full h-full bg-black/30 rounded-r-lg -z-10" />

        <div className="flex bg-[#fffdf7] shadow-2xl rounded-sm overflow-hidden border border-black/5">
          <Stage
            width={PAGE_WIDTH * 2 + SPINE_WIDTH}
            height={PAGE_HEIGHT}
          >
            <Layer>
              {/* BACKGROUNDS */}
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

              {/* ELEMENTS */}
              {elements
                .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                .map((el) => (
                  <ReadOnlyImage
                    key={el.id}
                    element={el}
                    pageWidth={PAGE_WIDTH}
                    spineWidth={SPINE_WIDTH}
                  />
                ))}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
}

/* -------------------- READ-ONLY IMAGE -------------------- */
function ReadOnlyImage({ element, pageWidth, spineWidth }) {
  const [image] = useImage(element.src);

  if (!image) return null;

  const absX =
    element.page === "left"
      ? element.x
      : pageWidth + spineWidth + element.x;

  return (
    <KonvaImage
      image={image}
      x={absX}
      y={element.y}
      width={element.width}
      height={element.height}
      rotation={element.rotation || 0}
      listening={false}
    />
  );
}
