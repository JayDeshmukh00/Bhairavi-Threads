export default function Lightbox({ zoomImage, setZoomImage }) {
  if (!zoomImage) return null;
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[70] p-4" onClick={() => setZoomImage(null)}>
      <div className="relative max-w-4xl max-h-full">
        <button className="absolute -top-12 right-0 text-white text-4xl font-light" onClick={() => setZoomImage(null)}>×</button>
        <img src={zoomImage} className="max-h-[85vh] max-w-full object-contain shadow-2xl rounded-lg" alt="Zoomed Saree" />
      </div>
    </div>
  );
}