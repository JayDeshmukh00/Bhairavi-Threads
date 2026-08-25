export default function CustomAlert({ alertInfo, onClose }) {
  if (!alertInfo) return null;

  const isError = alertInfo.type === 'error';

  return (
    <div className="fixed top-6 right-6 z-[200] max-w-sm w-full animate-fadeIn">
      <div className={`p-5 rounded-2xl shadow-2xl border backdrop-blur-2xl flex items-start gap-3 ${isError ? 'bg-[#02040c]/95 border-red-500/40 text-[#f8fafc]' : 'bg-[#02040c]/95 border-blue-400/40 text-[#f8fafc]'}`}>
        <span className="text-lg">{isError ? '⚠️' : '✨'}</span>
        <div className="flex-grow space-y-0.5">
          <h5 className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-300">
            {isError ? 'Atelier Notice' : 'Bhairavi Trousseau'}
          </h5>
          <p className="text-xs font-serif leading-relaxed text-gray-300 font-light">{alertInfo.message}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white text-sm font-bold cursor-pointer">✕</button>
      </div>
    </div>
  );
}