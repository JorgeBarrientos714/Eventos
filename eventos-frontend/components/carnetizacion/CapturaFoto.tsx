// Módulo: carnetizacion
// Función: Captura de fotografía vía cámara para el carnet
// Relacionados: pages/carnetizacion.tsx, CarnetSteps
// Rutas/Endpoints usados: ninguno (operación en cliente)
// Notas: No se renombra para conservar imports.
import { useEffect, useRef, useState } from "react";

type Props = {
  foto: string | null;
  onFoto: (dataUrl: string | null) => void;
  onBack: () => void;
  onFinish: () => void;
};

export default function CapturaFoto({ foto, onFoto, onBack, onFinish }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [streamReady, setStreamReady] = useState(false);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setStreamReady(true);
        }
      })
      .catch(() => {
        setStreamReady(false);
      });

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((t) => t.stop());
      }
    };
  }, []);

  const handleCapturar = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    onFoto(dataUrl);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-gray-700">Captura de fotografía</h2>
      <p className="text-xs text-gray-500">
        Toma la fotografía directamente desde la cámara. No se permite subir archivo.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="bg-black/5 rounded-lg overflow-hidden w-full sm:w-1/2 aspect-video flex items-center justify-center">
          {foto ? (
            <img src={foto} alt="Foto capturada" className="w-full h-full object-contain" />
          ) : (
            <video ref={videoRef} className="w-full h-full object-contain" />
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />
        <div className="flex flex-col gap-3">
          <button
            onClick={handleCapturar}
            disabled={!streamReady}
            className="bg-teal-800 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
          >
            Capturar foto
          </button>
          {foto && (
            <button
              onClick={() => onFoto(null)}
              className="text-sm text-gray-500 underline"
            >
              Volver a tomar
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onBack} className="px-4 py-2 rounded-lg border text-sm">
          Volver
        </button>
        <button
          onClick={onFinish}
          disabled={!foto}
          className="bg-lime-300 text-teal-800 px-4 py-2 rounded-lg text-sm disabled:opacity-50"
        >
          Finalizar
        </button>
      </div>
    </div>
  );
}
