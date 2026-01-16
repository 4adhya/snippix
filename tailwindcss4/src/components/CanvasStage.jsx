import { Stage, Layer, Transformer } from "react-konva";
import { useEffect, useRef } from "react";
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
    const stage = trRef.current?.getStage();
    const node = stage?.findOne(`#${selectedId}`);
    if (node) {
      trRef.current.nodes([node]);
    } else {
      trRef.current.nodes([]);
    }
    trRef.current?.getLayer()?.batchDraw();
  }, [selectedId]);

  return (
    <Stage
      width={window.innerWidth - 240}
      height={window.innerHeight}
      style={{ background: "#fff" }}
      onMouseDown={e => {
        if (e.target === e.target.getStage()) {
          setSelectedId(null);
        }
      }}
    >
      <Layer>
        {elements.map(el =>
          el.type === "image" ? (
            <DraggableImage
              key={el.id}
              element={el}
              onSelect={() => setSelectedId(el.id)}
              onChange={newAttrs =>
                setElements(prev =>
                  prev.map(item =>
                    item.id === el.id ? newAttrs : item
                  )
                )
              }
            />
          ) : (
            <DraggableText
              key={el.id}
              element={el}
              onSelect={() => setSelectedId(el.id)}
              onChange={newAttrs =>
                setElements(prev =>
                  prev.map(item =>
                    item.id === el.id ? newAttrs : item
                  )
                )
              }
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
