export default function Toolbar({
  setElements,
  deleteSelected,
  selectedId
}) {
  const addText = () => {
    setElements(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "text",
        text: "Edit me",
        x: 100,
        y: 100,
        fontSize: 26,
        rotation: 0
      }
    ]);
  };

  const addImage = () => {
    const url = prompt("Enter image URL");
    if (!url) return;

    setElements(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "image",
        src: url,
        x: 150,
        y: 150,
        width: 220,
        height: 220,
        rotation: 0
      }
    ]);
  };

  return (
    <div
      style={{
        width: 240,
        padding: 16,
        background: "#f5f5f5",
        borderRight: "1px solid #ccc"
      }}
    >
      <h3>Snippix Tools</h3>

      <button onClick={addText}>➕ Add Text</button>
      <br /><br />

      <button onClick={addImage}>🖼 Add Image</button>
      <br /><br />

      <button
        onClick={deleteSelected}
        disabled={!selectedId}
        style={{
          background: selectedId ? "#ff4d4f" : "#bbb",
          color: "#fff",
          border: "none",
          padding: "8px 12px",
          cursor: selectedId ? "pointer" : "not-allowed"
        }}
      >
        🗑 Delete
      </button>
    </div>
  );
}
