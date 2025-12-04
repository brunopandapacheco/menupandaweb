import { useState, useRef, useEffect } from "react";

export default function ImageCropper() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const lastPosition = useRef({ x: 0, y: 0 });
  const lastDistance = useRef<number | null>(null);
  const isDragging = useRef(false);

  // --- UPLOAD ---
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setImage(img);
    };
  };

  // --- MOUSE DRAG ---
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastPosition.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setPosition({
      x: e.clientX - lastPosition.current.x,
      y: e.clientY - lastPosition.current.y,
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // --- PINÇA TOUCH ZOOM ---
  const getDistance = (touches: TouchList) => {
    const [t1, t2] = [touches[0], touches[1]];
    return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = getDistance(e.touches);

      if (lastDistance.current) {
        const delta = dist - lastDistance.current;
        setScale((prev) => Math.min(Math.max(prev + delta * 0.005, 0.5), 6));
      }

      lastDistance.current = dist;
      return;
    }

    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setPosition((p) => ({
        x: p.x + (touch.clientX - (p.x + 200)),
        y: p.y + (touch.clientY - (p.y + 200)),
      }));
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => container.removeEventListener("touchmove", handleTouchMove);
  }, []);

  // --- SALVAR EXATAMENTE O QUE ESTÁ NO CÍRCULO ---
  const saveImage = () => {
    if (!imgRef.current) return;

    const canvas = document.createElement("canvas");
    const size = 400;
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();

    ctx.drawImage(
      imgRef.current,
      position.x,
      position.y,
      imgRef.current.width * scale,
      imgRef.current.height * scale
    );

    const url = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = url;
    link.download = "logo-final.png";
    link.click();
  };

  // --- CANCELAR (apenas limpa tudo) ---
  const cancel = () => {
    setImage(null);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div style={{ width: "100%", maxWidth: 420, margin: "0 auto", textAlign: "center" }}>
      
      <input type="file" accept="image/*" onChange={handleUpload} />

      <div
        ref={containerRef}
        style={{
          width: 400,
          height: 400,
          borderRadius: "50%",
          overflow: "hidden",
          margin: "20px auto",
          position: "relative",
          touchAction: "none",
          background: "#eee",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {image && (
          <img
            ref={imgRef}
            src={image.src}
            alt="preview"
            draggable={false}
            style={{
              position: "absolute",
              top: position.y,
              left: position.x,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              width: image.width,
              height: image.height,
            }}
          />
        )}
      </div>

      {image && (
        <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
          <button onClick={cancel} style={{ padding: "10px 20px", fontSize: 18 }}>
            Cancelar
          </button>

          <button onClick={saveImage} style={{ padding: "10px 20px", fontSize: 18 }}>
            Salvar
          </button>
        </div>
      )}
    </div>
  );
}
