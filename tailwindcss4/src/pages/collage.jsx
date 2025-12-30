import React, { useState, useRef, useEffect } from 'react';
import { Upload, Trash2, RotateCw, ZoomIn, ZoomOut, Download, Bell, User, Settings } from 'lucide-react';

function BackgroundWave() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = Math.max(window.innerHeight, document.documentElement.scrollHeight);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    function noise(x, y, t) {
      return (
        Math.sin(x * 0.13 + t * 0.006) * 0.5 +
        Math.cos(y * 0.15 + t * 0.007) * 0.35 +
        Math.sin((x + y) * 0.1 + t * 0.009) * 0.15
      );
    }

    let t = 0;
    let animationId;

    function draw() {
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);

      const cols = 200;
      const rows = Math.floor(height / (window.innerHeight / 300));
      const spacingX = width / cols;
      const spacingY = height / rows;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacingX + spacingX / 2;
          const y = j * spacingY + spacingY / 2;

          let n1 = noise(i * 0.9, j * 0.9, t);
          let n2 = noise(i * 0.45 + 40, j * 0.45 - 10, t * 0.7);
          let n3 = noise(i * 0.22 - 30, j * 0.22 + 50, t * 1.25);

          let blend = (n1 * 0.6 + n2 * 0.3 + n3 * 0.1 + 1) / 2;
          let shape = Math.pow(blend, 3.3);

          const size = (spacingX + spacingY) * (0.03 + shape * 0.33);

          const blue = Math.floor(40 + shape * 215);
          const green = Math.floor(blue * 0.82);
          const red = Math.floor(blue * 0.38);

          const warp =
            Math.sin(i * 0.14 + t * 0.01) * 3 +
            Math.cos(j * 0.14 + t * 0.009) * 3;

          ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
          ctx.beginPath();
          ctx.arc(x + warp, y + warp, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      t += 1;
      animationId = requestAnimationFrame(draw);
    }

    draw();

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
      style={{ minHeight: "100vh" }}
    />
  );
}

export default function CollageMaker() {
  const [images, setImages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [draggedId, setDraggedId] = useState(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = {
          id: Date.now() + Math.random(),
          src: event.target.result,
          x: 100,
          y: 100,
          width: 200,
          height: 200,
          rotation: 0,
          zIndex: images.length
        };
        setImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragStart = (e, id) => {
    setDraggedId(id);
    setSelectedId(id);
    const img = images.find(i => i.id === id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target);
  };

  const handleDrag = (e) => {
    if (!draggedId || e.clientX === 0 && e.clientY === 0) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - 100;
    const y = e.clientY - rect.top - 100;

    setImages(prev => prev.map(img => 
      img.id === draggedId ? { ...img, x, y } : img
    ));
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  const deleteImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
    setSelectedId(null);
  };

  const rotateImage = (id) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, rotation: (img.rotation + 45) % 360 } : img
    ));
  };

  const resizeImage = (id, scale) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { 
        ...img, 
        width: Math.max(50, img.width * scale),
        height: Math.max(50, img.height * scale)
      } : img
    ));
  };

  const downloadCollage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1200;
    canvas.height = 800;
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const loadImage = (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = src;
      });
    };

    Promise.all(images.map(img => loadImage(img.src))).then(loadedImages => {
      images.forEach((imgData, index) => {
        ctx.save();
        ctx.translate(imgData.x + imgData.width / 2, imgData.y + imgData.height / 2);
        ctx.rotate((imgData.rotation * Math.PI) / 180);
        ctx.drawImage(
          loadedImages[index],
          -imgData.width / 2,
          -imgData.height / 2,
          imgData.width,
          imgData.height
        );
        ctx.restore();
      });

      const link = document.createElement('a');
      link.download = 'snippix-collage.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <div className="min-h-screen bg-transparent text-white">
      <BackgroundWave />

      {/* TOP NAVBAR */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
        <h2 className="text-2xl font-bold">Snippix</h2>
        <div className="flex items-center space-x-4">
          <Bell size={24} className="cursor-pointer" />
          <User size={24} className="cursor-pointer" />
          <Settings size={24} className="cursor-pointer" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Create Your Collage</h1>
          <p className="text-gray-400">Upload images and drag them around to design your perfect collage</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 backdrop-blur-sm">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all active:scale-95"
            >
              <Upload size={20} />
              Upload Images
            </button>
            
            {selectedId && (
              <>
                <button
                  onClick={() => rotateImage(selectedId)}
                  className="flex items-center gap-2 px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all active:scale-95"
                >
                  <RotateCw size={20} />
                  Rotate
                </button>
                
                <button
                  onClick={() => resizeImage(selectedId, 1.2)}
                  className="flex items-center gap-2 px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all active:scale-95"
                >
                  <ZoomIn size={20} />
                  Larger
                </button>
                
                <button
                  onClick={() => resizeImage(selectedId, 0.8)}
                  className="flex items-center gap-2 px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all active:scale-95"
                >
                  <ZoomOut size={20} />
                  Smaller
                </button>
                
                <button
                  onClick={() => deleteImage(selectedId)}
                  className="flex items-center gap-2 px-4 py-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl hover:bg-red-500/30 transition-all active:scale-95"
                >
                  <Trash2 size={20} />
                  Delete
                </button>
              </>
            )}

            {images.length > 0 && (
              <button
                onClick={downloadCollage}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-all active:scale-95"
              >
                <Download size={20} />
                Download
              </button>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        <div 
          ref={canvasRef}
          className="relative bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm"
          style={{ width: '100%', height: '600px' }}
        >
          {images.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Upload size={64} className="mx-auto mb-4 opacity-30" />
                <p className="text-xl">Click "Upload Images" to start creating your collage</p>
              </div>
            </div>
          )}
          
          {images.map(img => (
            <div
              key={img.id}
              draggable
              onDragStart={(e) => handleDragStart(e, img.id)}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              onClick={() => setSelectedId(img.id)}
              className={`absolute cursor-move ${selectedId === img.id ? 'ring-4 ring-blue-400/50' : ''}`}
              style={{
                left: `${img.x}px`,
                top: `${img.y}px`,
                width: `${img.width}px`,
                height: `${img.height}px`,
                transform: `rotate(${img.rotation}deg)`,
                zIndex: img.zIndex,
                transition: draggedId === img.id ? 'none' : 'all 0.1s'
              }}
            >
              <img
                src={img.src}
                alt="Collage item"
                className="w-full h-full object-cover rounded-lg shadow-2xl pointer-events-none border border-white/20"
                draggable={false}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>💡 Click on an image to select it, then use the buttons above to rotate, resize, or delete</p>
        </div>
      </div>
    </div>
  );
}