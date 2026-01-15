import { useRef, useState } from "react";

export default function NotebookImage({ element, onUpdate, onDelete }) {
  const dragging = useRef(false);
  const resizing = useRef(false);
  const start = useRef({});
  const [selected, setSelected] = useState(false);

  const onMouseDown = (e) => {
    e.stopPropagation();
    setSelected(true);
    dragging.current = true;

    start.current = {
      x: e.clientX,
      y: e.clientY,
      left: element.x,
      top: element.y,
    };

    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", stopActions);
  };

  const onDrag = (e) => {
    if (!dragging.current) return;

    onUpdate(element.id, {
      x: start.current.left + (e.clientX - start.current.x),
      y: start.current.top + (e.clientY - start.current.y),
    });
  };

  const onResizeStart = (e) => {
    e.stopPropagation();
    resizing.current = true;

    start.current = {
      x: e.clientX,
      width: element.width,
    };

    window.addEventListener("mousemove", onResize);
    window.addEventListener("mouseup", stopActions);
  };

  const onResize = (e) => {
    if (!resizing.current) return;

    onUpdate(element.id, {
      width: Math.max(
        80,
        start.current.width + (e.clientX - start.current.x)
      ),
    });
  };

  const stopActions = () => {
    dragging.current = false;
    resizing.current = false;
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mousemove", onResize);
    window.removeEventListener("mouseup", stopActions);
  };

  const rotate = (deg) => {
    onUpdate(element.id, {
      rotation: element.rotation + deg,
    });
  };

  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        position: "absolute",
        left: element.x,
        top: element.y,
        width: element.width,
        transform: `rotate(${element.rotation}deg)`,
        zIndex: element.zIndex,
      }}
      className="cursor-grab"
    >
      <img
        src={element.src}
        draggable={false}
        className="w-full shadow-md"
        alt=""
      />

      {/* Controls */}
      {selected && (
        <>
          {/* Resize */}
          <div
            onMouseDown={onResizeStart}
            className="absolute -bottom-2 -right-2 w-3 h-3 bg-black cursor-se-resize"
          />

          {/* Rotate Left */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              rotate(-5);
            }}
            className="absolute -top-6 left-0 text-xs bg-black text-white px-1"
          >
            ↺
          </button>

          {/* Rotate Right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              rotate(5);
            }}
            className="absolute -top-6 left-6 text-xs bg-black text-white px-1"
          >
            ↻
          </button>

          {/* Delete */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(element.id);
            }}
            className="absolute -top-6 right-0 text-xs bg-red-600 text-white px-1"
          >
            ✕
          </button>
        </>
      )}
    </div>
  );
}
