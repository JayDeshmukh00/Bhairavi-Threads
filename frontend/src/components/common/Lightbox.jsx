export default function Lightbox({ zoomImage, setZoomImage }) {
  if (!zoomImage) return null;
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[70] p-4" onClick={() => setZoomImage(null)}>
      <div className="relative max-w-4xl max-h-full">
        <button className="absolute -top-12 right-0 text-white text-3xl font-light hover:text-blue-300 transition-colors cursor-pointer" onClick={() => setZoomImage(null)}>×</button>
        <img src={zoomImage} className="max-h-[85vh] max-w-full object-contain shadow-[0_25px_60px_rgba(0,0,0,0.9)] rounded-2xl border border-white/10 bg-[#02040c]" alt="Zoomed Saree" />
      </div>
    </div>
  );
}