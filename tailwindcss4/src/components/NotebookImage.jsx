import { useRef } from "react";

export default function NotebookImage({
  element,
  isSelected,
  onSelect,
  onUpdate,
}) {
  const dragging = useRef(false);
  const resizing = useRef(false);
  const start = useRef({});

  /* ---------------- SELECT + DRAG ---------------- */
  const onMouseDown = (e) => {
    e.stopPropagation(); // 🔑 CRITICAL
    onSelect();

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

  /* ---------------- RESIZE ---------------- */
  const onResizeStart = (e) => {
    e.stopPropagation(); // 🔑 CRITICAL
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
      width: Math.max(60, start.current.width + (e.clientX - start.current.x)),
    });
  };

  /* ---------------- CLEANUP ---------------- */
  const stopActions = () => {
    dragging.current = false;
    resizing.current = false;

    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mousemove", onResize);
    window.removeEventListener("mouseup", stopActions);
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
        outline: isSelected ? "2px dashed #6366f1" : "none",
        outlineOffset: "6px",
      }}
      className="cursor-grab active:cursor-grabbing select-none"
    >
      <img
        src={element.src}
        draggable={false}
        alt=""
        className="w-full block rounded-sm shadow-lg pointer-events-none"
      />

      {/* Resize Handle */}
      {isSelected && (
        <div
          onMouseDown={onResizeStart}
          className="absolute -right-2 -bottom-2 w-4 h-4 bg-white
                     border-2 border-indigo-500 rounded-full
                     cursor-se-resize shadow-md"
        />
      )}
    </div>
  );
}
