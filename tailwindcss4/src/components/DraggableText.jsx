import { Text } from "react-konva";

export default function DraggableText({
  element,
  isSelected,
  onSelect,
  onChange
}) {
  return (
    <Text
      id={element.id}
      text={element.text}
      x={element.x}
      y={element.y}
      fontSize={element.fontSize}
      rotation={element.rotation}
      draggable
      onClick={onSelect}
      onDragEnd={e => {
        onChange({
          ...element,
          x: e.target.x(),
          y: e.target.y()
        });
      }}
      onTransformEnd={e => {
        const node = e.target;
        onChange({
          ...element,
          x: node.x(),
          y: node.y(),
          rotation: node.rotation()
        });
      }}
    />
  );
}
