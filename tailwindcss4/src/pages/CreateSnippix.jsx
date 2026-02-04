import { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PAGE_WIDTH = 440;
const PAGE_HEIGHT = 600;
const SPINE_WIDTH = 2;

export default function CreateSnippix() {
  const navigate = useNavigate();
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const fileRef = useRef(null);
  const stageRef = useRef(null);

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

    // Get natural dimensions to maintain aspect ratio
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const width = 180;
      const height = width / aspectRatio;

      setElements((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "image",
          src: url,
          page: "left",
          x: 60,
          y: 80,
          width: width,
          height: height,
          rotation: (Math.random() - 0.5) * 10,
          zIndex: Date.now(),
        },
      ]);
    };
    img.src = url;
  };

  /* -------------------- HANDLE STAGE CLICK (DESELECT) -------------------- */
  const handleStageClick = (e) => {
    // If clicked on empty space (not on an image), deselect
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  };

  /* -------------------- RENDER -------------------- */
  return (
    <div className="min-h-screen bg-[#3d445e] flex items-center justify-center p-6">
      
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/home")}
        className="fixed top-6 left-6 z-50 p-3 rounded-full bg-black/20 hover:bg-black/30 transition-colors border border-white/10 backdrop-blur-md"
      >
        <ArrowLeft size={24} className="text-white" />
      </button>

      {/* NOTEBOOK CONTAINER */}
      <div className="relative">
        {/* Shadow layers */}
        <div className="absolute -right-4 top-2 w-full h-full bg-black/20 rounded-r-lg -z-20" />
        <div className="absolute -right-2 top-1 w-full h-full bg-black/30 rounded-r-lg -z-10" />

        {/* Main notebook */}
        <div className="flex bg-[#fffdf7] shadow-2xl rounded-sm overflow-hidden border border-black/5">
          
          {/* KONVA STAGE - Both pages in one canvas for smooth dragging */}
          <Stage
            ref={stageRef}
            width={PAGE_WIDTH * 2 + SPINE_WIDTH}
            height={PAGE_HEIGHT}
            onMouseDown={handleStageClick}
            onTouchStart={handleStageClick}
          >
            <Layer>
              {/* LEFT PAGE BACKGROUND */}
              <Rect
                x={0}
                y={0}
                width={PAGE_WIDTH}
                height={PAGE_HEIGHT}
                fill="#fffdf7"
              />
              
              {/* RIGHT PAGE BACKGROUND */}
              <Rect
                x={PAGE_WIDTH + SPINE_WIDTH}
                y={0}
                width={PAGE_WIDTH}
                height={PAGE_HEIGHT}
                fill="#fffdf7"
              />

              {/* SPINE */}
              <Rect
                x={PAGE_WIDTH}
                y={0}
                width={SPINE_WIDTH}
                height={PAGE_HEIGHT}
                fill="rgba(0,0,0,0.1)"
              />

              {/* ELEMENTS */}
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

      {/* -------------------- MAC-STYLE MINI DOCK -------------------- */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-end gap-2 px-4 py-3 rounded-2xl
                        bg-black/40 backdrop-blur-xl
                        shadow-[0_20px_40px_rgba(0,0,0,0.45)]
                        border border-white/10">

          <DockIcon onClick={() => fileRef.current.click()} label="Add image">
            🖼️
          </DockIcon>

          <DockDivider />

          <DockIcon onClick={duplicateSelected} disabled={!selectedId} label="Duplicate">
            📄
          </DockIcon>

          <DockIcon onClick={() => rotateSelected(-15)} disabled={!selectedId} label="Rotate left">
            ↺
          </DockIcon>

          <DockIcon onClick={() => rotateSelected(15)} disabled={!selectedId} label="Rotate right">
            ↻
          </DockIcon>

          <DockDivider />

          <DockIcon onClick={bringForward} disabled={!selectedId} label="Bring forward">
            ⬆️
          </DockIcon>

          <DockIcon onClick={sendBackward} disabled={!selectedId} label="Send back">
            ⬇️
          </DockIcon>

          <DockDivider />

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

/* -------------------- DRAGGABLE ELEMENT -------------------- */
function DraggableElement({ element, isSelected, onSelect, onChange, pageWidth, spineWidth }) {
  const [image] = useImage(element.src);
  const shapeRef = useRef(null);
  const trRef = useRef(null);

  // Update transformer when selected
  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleDragMove = (e) => {
    const node = e.target;
    const absX = node.x(); // Absolute position in stage
    
    // Check if dragged to other page
    const currentPage = element.page;
    let newPage = currentPage;
    let newX = element.x; // Relative to page
    
    if (currentPage === "left") {
      if (absX > pageWidth + spineWidth) {
        newPage = "right";
        newX = absX - (pageWidth + spineWidth);
      } else {
        newX = absX;
      }
    } else {
      // Right page
      if (absX < pageWidth) {
        newPage = "left";
        newX = absX;
      } else {
        newX = absX - (pageWidth + spineWidth);
      }
    }

    if (newPage !== currentPage) {
      onChange(element.id, { 
        page: newPage,
        x: newX,
        y: node.y()
      });
    }
  };

  const handleDragEnd = (e) => {
    const node = e.target;
    const absX = node.x();
    const absY = node.y();
    
    // Calculate relative position based on current page
    let relativeX;
    if (element.page === "left") {
      relativeX = absX;
    } else {
      relativeX = absX - (pageWidth + spineWidth);
    }
    
    onChange(element.id, {
      x: relativeX,
      y: absY,
    });
  };

  // Calculate absolute position based on page
  const absX = element.page === "left" 
    ? element.x 
    : pageWidth + spineWidth + element.x;
  const absY = element.y;

  if (element.type === "image" && !image) {
    return null; // Loading
  }

  return (
    <>
      <KonvaImage
        ref={shapeRef}
        image={image}
        x={absX}
        y={absY}
        width={element.width}
        height={element.height}
        rotation={element.rotation || 0}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        shadowEnabled={isSelected}
        shadowColor="rgba(0,0,0,0.3)"
        shadowBlur={15}
        shadowOffset={{ x: 8, y: 8 }}
        shadowOpacity={0.4}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 30 || newBox.height < 30) {
              return oldBox;
            }
            return newBox;
          }}
          anchorFill="#3b82f6"
          anchorStroke="#fff"
          anchorStrokeWidth={2}
          borderStroke="#3b82f6"
          borderStrokeWidth={2}
          borderDash={[5, 5]}
        />
      )}
    </>
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
        w-11 h-11 flex items-center justify-center
        rounded-xl text-xl
        transition-all duration-200 ease-out
        ${disabled 
          ? "opacity-25 cursor-not-allowed grayscale" 
          : "hover:scale-125 hover:-translate-y-1 active:scale-95"
        }
        ${danger 
          ? "hover:bg-red-500/30 hover:text-red-200" 
          : "hover:bg-white/15 hover:text-white"
        }
        text-white/80
      `}
    >
      {children}
    </button>
  );
}

/* -------------------- DOCK DIVIDER -------------------- */
function DockDivider() {
  return (
    <div className="w-[1px] h-8 bg-white/20 mx-1" />
  );
}