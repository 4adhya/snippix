import React, { useState, useRef } from "react";
import {
  Upload,
  Trash2,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Download
} from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";

export default function CollageMaker() {
  const [images, setImages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [draggedId, setDraggedId] = useState(null);

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  /* ================= IMAGE UPLOAD ================= */
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const randomRotation = Math.floor(Math.random() * 10) - 5;

        const newImage = {
          id: Date.now() + Math.random(),
          src: event.target.result,
          x: 120 + Math.random() * 200,
          y: 80 + Math.random() * 200,
          width: 220,
          height: 260,
          rotation: randomRotation,
          zIndex: images.length
        };

        setImages((prev) => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  /* ================= DRAG ================= */
  const handleDragStart = (e, id) => {
    setDraggedId(id);
    setSelectedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrag = (e) => {
    if (!draggedId || e.clientX === 0 || e.clientY === 0) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 110;
    const y = e.clientY - rect.top - 130;

    setImages((prev) =>
      prev.map((img) =>
        img.id === draggedId ? { ...img, x, y } : img
      )
    );
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  /* ================= ACTIONS ================= */
  const rotateImage = (id) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id
          ? { ...img, rotation: img.rotation + 15 }
          : img
      )
    );
  };

  const resizeImage = (id, scale) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id
          ? {
              ...img,
              width: Math.max(120, img.width * scale),
              height: Math.max(150, img.height * scale)
            }
          : img
      )
    );
  };

  const deleteImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setSelectedId(null);
  };

  /* ================= DOWNLOAD ================= */
  const downloadCollage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 1400;
    canvas.height = 900;

    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const loadImage = (src) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = src;
      });

    Promise.all(images.map((img) => loadImage(img.src))).then(
      (loadedImages) => {
        images.forEach((imgData, index) => {
          ctx.save();
          ctx.translate(
            imgData.x + imgData.width / 2,
            imgData.y + imgData.height / 2
          );
          ctx.rotate((imgData.rotation * Math.PI) / 180);

          ctx.fillStyle = "#ffffff";
          ctx.fillRect(
            -imgData.width / 2 - 10,
            -imgData.height / 2 - 10,
            imgData.width + 20,
            imgData.height + 40
          );

          ctx.drawImage(
            loadedImages[index],
            -imgData.width / 2,
            -imgData.height / 2,
            imgData.width,
            imgData.height
          );
          ctx.restore();
        });

        const link = document.createElement("a");
        link.download = "snippix-collage.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    );
  };

  /* ================= SAVE TO FIRESTORE ================= */
  const saveSnippix = async () => {
    if (!images.length) return;

    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to save your Snippix");
      return;
    }

    try {
      await addDoc(collection(db, "snippix"), {
        userId: user.uid,
        images: images.map(({ id, ...rest }) => rest),
        createdAt: serverTimestamp()
      });

      alert("Snippix saved 🤍");
    } catch (err) {
      console.error(err);
      alert("Failed to save Snippix");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-800">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-serif mb-2">
          Create your Snippix
        </h1>
        <p className="text-gray-500">
          A quiet space to collect moments.
        </p>
      </div>

      {/* TOOLBAR */}
      <div className="max-w-6xl mx-auto px-6 mb-6 flex flex-wrap gap-3 items-center">
        <button
          onClick={() => fileInputRef.current.click()}
          className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:shadow"
        >
          <Upload size={18} />
          Add photos
        </button>

        {selectedId && (
          <>
            <button
              onClick={() => rotateImage(selectedId)}
              className="px-3 py-2 bg-white border rounded-lg shadow-sm"
            >
              <RotateCw size={18} />
            </button>

            <button
              onClick={() => resizeImage(selectedId, 1.15)}
              className="px-3 py-2 bg-white border rounded-lg shadow-sm"
            >
              <ZoomIn size={18} />
            </button>

            <button
              onClick={() => resizeImage(selectedId, 0.85)}
              className="px-3 py-2 bg-white border rounded-lg shadow-sm"
            >
              <ZoomOut size={18} />
            </button>

            <button
              onClick={() => deleteImage(selectedId)}
              className="px-3 py-2 bg-white border border-red-300 text-red-500 rounded-lg shadow-sm"
            >
              <Trash2 size={18} />
            </button>
          </>
        )}

        {images.length > 0 && (
          <div className="ml-auto flex gap-3">
            <button
              onClick={downloadCollage}
              className="px-4 py-2 bg-black text-white rounded-lg flex items-center gap-2"
            >
              <Download size={18} />
            </button>

            <button
              onClick={saveSnippix}
              className="px-4 py-2 bg-white border rounded-lg shadow-sm hover:shadow"
            >
              Save Snippix
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* CANVAS */}
      <div
        ref={canvasRef}
        className="relative max-w-6xl mx-auto bg-[#fdfdfd] border rounded-2xl shadow-inner overflow-hidden"
        style={{ height: "650px" }}
      >
        {images.map((img) => (
          <div
            key={img.id}
            draggable
            onDragStart={(e) => handleDragStart(e, img.id)}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            onClick={() => setSelectedId(img.id)}
            className={`absolute cursor-move ${
              selectedId === img.id ? "ring-2 ring-gray-300" : ""
            }`}
            style={{
              left: img.x,
              top: img.y,
              width: img.width,
              height: img.height + 30,
              transform: `rotate(${img.rotation}deg)`,
              zIndex: img.zIndex
            }}
          >
            <div className="bg-white p-2 pb-6 shadow-lg rounded-sm">
              <img
                src={img.src}
                alt=""
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          </div>
        ))}

        {images.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            Upload photos to begin your collage
          </div>
        )}
      </div>
    </div>
  );
}
