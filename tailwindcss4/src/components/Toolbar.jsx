export default function Toolbar({ setElements }) {
  const addText = () => {
    setElements(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "text",
        text: "Edit me",
        x: 100,
        y: 100,
        fontSize: 24,
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
        width: 200,
        height: 200,
        rotation: 0
      }
    ]);
  };

  return (
    <div style={{
      width: 220,
      padding: 12,
      background: "#f4f4f4",
      borderRight: "1px solid #ccc"
    }}>
      <h3>Toolbar</h3>
      <button onClick={addText}>➕ Text</button>
      <br /><br />
      <button onClick={addImage}>🖼 Image</button>
    </div>
  );
}
