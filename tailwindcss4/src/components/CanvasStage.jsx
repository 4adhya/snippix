import { Stage, Layer, Transformer } from "react-konva";
import { useRef, useEffect } from "react";
import DraggableImage from "./DraggableImage";
import DraggableText from "./DraggableText";

export default function CanvasStage({
  elements,
  setElements,
  selectedId,
  setSelectedId
}) {
  const trRef = useRef();

  useEffect(() => {
    if (!trRef.current) return;
    const stage = trRef.current.getStage();
    const selectedNode = stage.findOne(`#${selectedId}`);
    if (selectedNode) {
      trRef.current.nodes([selectedNode]);
    } else {
      trRef.current.nodes([]);
    }
    trRef.current.getLayer().batchDraw();
  }, [selectedId]);

  return (
    <Stage
      width={window.innerWidth - 220}
      height={window.innerHeight}
      onMouseDown={() => setSelectedId(null)}
      style={{ background: "#fff" }}
    >
      <Layer>
        {elements.map(el =>
          el.type === "image" ? (
            <DraggableImage
              key={el.id}
              element={el}
              isSelected={el.id === selectedId}
              onSelect={() => setSelectedId(el.id)}
              onChange={newAttrs => {
                setElements(prev =>
                  prev.map(item =>
                    item.id === el.id ? newAttrs : item
                  )
                );
              }}
            />
          ) : (
            <DraggableText
              key={el.id}
              element={el}
              isSelected={el.id === selectedId}
              onSelect={() => setSelectedId(el.id)}
              onChange={newAttrs => {
                setElements(prev =>
                  prev.map(item =>
                    item.id === el.id ? newAttrs : item
                  )
                );
              }}
            />
          )
        )}
        <Transformer
          ref={trRef}
          rotateEnabled
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right"
          ]}
        />
      </Layer>
    </Stage>
  );
}
