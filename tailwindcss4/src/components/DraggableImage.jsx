import { useRef } from "react";

export default function DraggableImage({ element, onUpdate }) {
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const onMouseDown = (e) => {
    dragging.current = true;
    offset.current = {
      x: e.clientX - element.x,
      y: e.clientY - element.y,
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!dragging.current) return;

    onUpdate(element.id, {
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const onMouseUp = () => {
    dragging.current = false;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  return (
    <img
      src={element.src}
      onMouseDown={onMouseDown}
      draggable={false}
      className="absolute max-w-[180px] cursor-grab shadow-md"
      style={{
        left: element.x,
        top: element.y,
        zIndex: element.zIndex,
      }}
      alt=""
    />
  );
}
