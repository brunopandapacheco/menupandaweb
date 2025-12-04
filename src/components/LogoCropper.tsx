import { useState, useRef, useEffect, useCallback } from "react";
import { X, Check } from "lucide-react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { useGesture } from "@use-gesture/react";

interface LogoCropperProps {
  imageFile: File;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
  circularCrop?: boolean;
}

export function LogoCropper({
  imageFile,
  onCropComplete,
  onCancel,
  circularCrop = true,
}: LogoCropperProps) {
  const [imageUrl, setImageUrl] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(0, { stiffness: 300, damping: 30 });
  const ySpring = useSpring(0, { stiffness: 300, damping: 30 });

  // Zoom bidirecional 0.5x–3x
  const [scale, setScale] = useState(1);
  const lastScale = useRef(1);

  // Carregar imagem e resetar posições
  useEffect(() => {
    x.set(0);
    y.set(0);
    setScale(1);
    lastScale.current = 1;

    const url = URL.createObjectURL(imageFile);
    setImageUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  // Travar scroll enquanto o cropper está aberto
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const performCrop = useCallback(() => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const previewWidth = circularCrop ? 240 : 400;
    const previewHeight = circularCrop ? 240 : 200;
    const imgDisplayWidth = circularCrop ? 300 : 400;
    const imgDisplayHeight = circularCrop ? 300 : 300;

    canvas.width = previewWidth;
    canvas.height = previewHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (circularCrop) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(previewWidth / 2, previewHeight / 2, previewWidth / 2, 0, Math.PI * 2);
      ctx.clip();
    }

    const offsetX = x.get();
    const offsetY = y.get();

    ctx.drawImage(
      imageRef.current,
      previewWidth / 2 - (imgDisplayWidth * scale) / 2 + offsetX,
      previewHeight / 2 - (imgDisplayHeight * scale) / 2 + offsetY,
      imgDisplayWidth * scale,
      imgDisplayHeight * scale
    );

    if (circularCrop) ctx.restore();

    canvas.toBlob((blob) => {
      if (blob) onCropComplete(blob);
    }, "image/jpeg", 0.9);
  }, [circularCrop, onCropComplete, x, y, scale]);

  const bind = useGesture(
    {
      onDrag: ({ offset: [dx, dy] }) => {
        x.set(dx);
        y.set(dy);
      },
      onPinch: ({ offset: [d] }) => {
        const newScale = Math.min(Math.max(d, 0.5), 3); // limite bidirecional
        setScale(newScale);
        lastScale.current = newScale;
      },
    },
    { drag: { filterTaps: true }, pinch: { scaleBounds: { min: 0.5, max: 3 } } }
  );

  return (
    <AnimatePresence>
      {/* Overlay fullscreen com blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 backdrop-blur-md bg-black/40 z-40 flex items-center justify-center p-4"
      >
        {/* Card do cropper */}
        <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden z-50">
          {/* Botão de fechar */}
          <button
            onClick={onCancel}
            className="absolute -top-10 right-0 text-black hover:text-gray-700 transition-colors z-50"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header clean, combinando com blur */}
          <div className="bg-white bg-opacity-80 p-4 rounded-t-lg border-b border-gray-300 text-center">
            <h2 className="text-lg font-bold text-gray-800">Ajustar Logo</h2>
            <p className="text-sm text-gray-600 mt-1">
              Toque ou arraste para mover, use pinça para aumentar ou reduzir
            </p>
          </div>

          {/* Área do editor */}
          <div className="p-4 bg-gray-50">
            <div
              ref={containerRef}
              className="relative mx-auto"
              style={{
                width: circularCrop ? "240px" : "400px",
                height: circularCrop ? "240px" : "200px",
              }}
            >
              {/* Máscara do crop */}
              <div
                className={`absolute inset-0 pointer-events-none border-2 border-purple-400 ${
                  circularCrop ? "rounded-full" : "rounded-lg"
                }`}
                style={{ zIndex: 10 }}
              />

              {/* Container da imagem com gestos */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  ...(circularCrop ? { borderRadius: "50%" } : { borderRadius: "12px" }),
                  touchAction: "none",
                }}
                {...bind()}
              >
                <motion.div
                  style={{
                    width: circularCrop ? 300 : 400,
                    height: 300,
                    x: xSpring,
                    y: ySpring,
                    scale: scale,
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    translateX: "-50%",
                    translateY: "-50%",
                  }}
                >
                  <img
                    ref={imageRef}
                    src={imageUrl}
                    alt="preview"
                    draggable={false}
                    className="w-full h-full object-cover"
                    style={{ userSelect: "none" }}
                  />
                </motion.div>
              </div>
            </div>

            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Botões */}
          <div className="bg-white p-4 border-t flex gap-2">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
            >
              Cancelar
            </button>

            <button
              onClick={performCrop}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-1 text-sm"
            >
              <Check className="w-3 h-3" />
              Salvar
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
