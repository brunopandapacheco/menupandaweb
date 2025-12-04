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

  // Motion values real → os que vemos
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs para animação suave
  const xSpring = useSpring(0, { stiffness: 300, damping: 30 });
  const ySpring = useSpring(0, { stiffness: 300, damping: 30 });

  // Mantém spring sincronizado com motion value
  useEffect(() => {
    const unsubX = x.on("change", (v) => xSpring.set(v));
    const unsubY = y.on("change", (v) => ySpring.set(v));
    return () => {
      unsubX();
      unsubY();
    };
  }, []);

  // Carregar imagem
  useEffect(() => {
    x.set(0);
    y.set(0);

    const url = URL.createObjectURL(imageFile);
    setImageUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  /** =====================================================================
   *  💡 O PULO DO GATO:
   *  Cortar exatamente o que está aparecendo no círculo (preview real)
   *  =====================================================================
   */
  const performCrop = useCallback(() => {
    if (!canvasRef.current || !imageRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Medidas visuais EXATAS:
    const previewWidth = circularCrop ? 240 : 400;
    const previewHeight = circularCrop ? 240 : 200;

    // Tamanho real da imagem exibida
    const imgDisplayWidth = circularCrop ? 300 : 400;
    const imgDisplayHeight = circularCrop ? 300 : 300;

    // Configurar canvas com tamanho exato da máscara
    canvas.width = previewWidth;
    canvas.height = previewHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Clip circular se necessário
    if (circularCrop) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(previewWidth / 2, previewHeight / 2, previewWidth / 2, 0, Math.PI * 2);
      ctx.clip();
    }

    // Pegamos exatamente a posição que vemos na tela
    const offsetX = x.get();
    const offsetY = y.get();

    // A imagem é desenhada como o preview REAL
    ctx.drawImage(
      imageRef.current,
      previewWidth / 2 - imgDisplayWidth / 2 + offsetX,
      previewHeight / 2 - imgDisplayHeight / 2 + offsetY,
      imgDisplayWidth,
      imgDisplayHeight
    );

    if (circularCrop) ctx.restore();

    // Salvar
    canvas.toBlob((blob) => {
      if (blob) onCropComplete(blob);
    }, "image/jpeg", 0.9);
  }, [circularCrop, onCropComplete, x, y]);

  /** Gestos — Somente arrastar */
  const bind = useGesture(
    {
      onDrag: ({ offset: [dx, dy] }) => {
        x.set(dx);
        y.set(dy);
      },
    },
    {
      drag: {
        filterTaps: true,
      },
    }
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      >
        <div className="relative w-full max-w-md">
          <button
            onClick={onCancel}
            className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
              <h2 className="text-lg font-bold text-center">Ajustar Logo</h2>
              <p className="text-center text-white/70 text-sm">Arraste para posicionar</p>
            </div>

            <div className="p-4 bg-gray-50">
              <div
                ref={containerRef}
                className="relative mx-auto"
                style={{
                  width: circularCrop ? "240px" : "400px",
                  height: circularCrop ? "240px" : "200px",
                }}
              >
                {/* Máscara */}
                <div
                  className={`absolute inset-0 pointer-events-none border-2 border-purple-400 ${
                    circularCrop ? "rounded-full" : "rounded-lg"
                  }`}
                  style={{ boxShadow: "0 0 0 9999px rgba(0,0,0,.45)", zIndex: 10 }}
                />

                {/* Área com gestos */}
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
                      className="w-full h-full object-cover"
                      draggable={false}
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
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
