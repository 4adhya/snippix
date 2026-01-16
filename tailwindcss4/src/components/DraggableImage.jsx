import { Image } from "react-konva";
import useImage from "use-image";

export default function DraggableImage({
  element,
  isSelected,
  onSelect,
  onChange
}) {
  const [image] = useImage(element.src);

  return (
    <Image
      id={element.id}
      image={image}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      rotation={element.rotation}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={e => {
        onChange({
          ...element,
          x: e.target.x(),
          y: e.target.y()
        });
      }}
      onTransformEnd={e => {
        const node = e.target;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        node.scaleX(1);
        node.scaleY(1);

        onChange({
          ...element,
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          width: Math.max(20, node.width() * scaleX),
          height: Math.max(20, node.height() * scaleY)
        });
      }}
    />
  );
}
