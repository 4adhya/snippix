import { useRef } from "react";

export default function NotebookImage({ element, isSelected, onSelect, onUpdate }) {
  const dragging = useRef(false);
  const resizing = useRef(false);
  const start = useRef({});

  // Triggered when clicking to drag
  const onMouseDown = (e) => {
    e.stopPropagation();
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
      width: Math.max(50, start.current.width + (e.clientX - start.current.x)),
    });
  };

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
        // The selection ring matches the Paper aesthetic
        outline: isSelected ? "2px solid #3b82f6" : "none",
        outlineOffset: "4px",
      }}
      className="group cursor-grab active:cursor-grabbing transition-shadow duration-200"
    >
      <img
        src={element.src}
        draggable={false}
        className={`w-full select-none ${isSelected ? 'shadow-2xl' : 'shadow-md'}`}
        alt=""
      />

      {/* Minimalist Resize Handle */}
      {isSelected && (
        <div
          onMouseDown={onResizeStart}
          className="absolute -right-2 -bottom-2 w-5 h-5 bg-white rounded-full border-2 border-blue-500 cursor-se-resize shadow-lg flex items-center justify-center"
        >
           <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
        </div>
      )}
    </div>
  );
}