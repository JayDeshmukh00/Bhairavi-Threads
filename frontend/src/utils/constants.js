export const ADMIN_EMAILS = ["admin@bhairavithreads.com", "jay@bhairavithreads.com"]; 
export const ADMIN_PHONES = ["9657127253"]; // Configured Admin Phone Number

export const assets = {
  heroVideo: "https://res.cloudinary.com/dp3njnwvf/video/upload/v1787301733/bhairavi-pallu-reveal_-_Copy_wdmpkw.mp4",
  modelVideo1: "https://res.cloudinary.com/dp3njnwvf/video/upload/v1787304108/VID-20260821-WA0018_lvmmds.mp4",
  modelVideo2: "https://res.cloudinary.com/dp3njnwvf/video/upload/v1787304111/VID-20260405-WA0004_mifhcc.mp4",
  modelVideo3: "https://res.cloudinary.com/dp3njnwvf/video/upload/v1787304109/VID-20260614-WA0008_p2ters.mp4",
  modelVideo4: "https://res.cloudinary.com/dp3njnwvf/video/upload/v1787304116/VID-20260821-WA0019_jotniq.mp4",
  handwoven: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000",
  handpainted: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1000",
  kalamkari: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=1000",
  tissue: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1000",
  cotton: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=1000",
  embroidery: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1000",
  artisan: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=1200",
};

export const collectionsList = [
  { id: "01", title: "HANDWOVEN", desc: "The timeless rhythm of wooden looms, where warp and weft meet in sacred harmony.", image: assets.handwoven },
  { id: "02", title: "HAND-PAINTED", desc: "Canvases of pure silk brought to life by master artists stroke by delicate stroke.", image: assets.handpainted },
  { id: "03", title: "KALAMKARI", desc: "Earth-toned narrative drapes etched with organic dyes and ancient pen craft.", image: assets.kalamkari },
  { id: "04", title: "TISSUE", desc: "Luminous drapes interwoven with gossamer metallic threads that catch the morning sun.", image: assets.tissue },
  { id: "05", title: "COTTON", desc: "Breathable, tactile, and pure—organic fibers whispering the poetry of simplicity.", image: assets.cotton },
  { id: "06", title: "EMBROIDERY", desc: "Intricate needlework and rich zari embellishments echoing royal heritage.", image: assets.embroidery },
];

export const INITIAL_CATEGORIES = [
  { name: 'Kalamkari', designs: ['Classic Motifs', 'Earth-Toned Narrative', 'Temple Border'] },
  { name: 'Cotton', designs: ['Plain Weave', 'Handblock Printed', 'Checks & Stripes'] },
  { name: 'Organza', designs: ['Tissue Sheer', 'Floral Embroidered', 'Metallic Trim'] },
  { name: 'Raga Tissue', designs: ['Pure Gold Zari', 'Silver Shimmer', 'Antique Brocade'] },
  { name: 'Embroidery', designs: ['Zardosi Work', 'Aari Handwork', 'Resham Threadwork'] },
  { name: 'Hand Painted', designs: ['Pichwai Flora', 'Madhubani Art', 'Abstract Silk Canvas'] }
];

export const COLOR_OPTIONS = [
  'Crimson', 'Gold', 'Emerald', 'Ivory', 'Indigo', 'Midnight Black', 'Blush Pink', 'Royal Blue', 'Antique Mustard'
];

export const DESIGN_OPTIONS = [
  'Classic Motifs', 
  'Earth-Toned Narrative', 
  'Temple Border', 
  'Plain Weave', 
  'Handblock Printed', 
  'Checks & Stripes', 
  'Tissue Sheer', 
  'Floral Embroidered', 
  'Metallic Trim', 
  'Pure Gold Zari', 
  'Silver Shimmer', 
  'Antique Brocade', 
  'Zardosi Work', 
  'Aari Handwork', 
  'Resham Threadwork', 
  'Pichwai Flora', 
  'Madhubani Art', 
  'Abstract Silk Canvas'
];

export const MY_WHATSAPP_NUMBER = "9657127253";

export const ui = {
  input: "w-full bg-[#f4f1ea] border border-black/15 rounded-xl px-4 py-3 text-xs tracking-widest text-[#1a1a1a] placeholder:text-[#888] focus:outline-none focus:border-black transition-all",
  select: "w-full bg-[#f4f1ea] border border-black/15 rounded-xl px-4 py-3 text-xs uppercase tracking-widest text-[#1a1a1a] focus:outline-none focus:border-black transition-all cursor-pointer",
  primaryBtn: "bg-[#111111] text-[#fbf9f5] py-3.5 text-xs uppercase tracking-[0.25em] rounded-xl hover:bg-black transition-all shadow-md font-medium",
  ghostBtn: "bg-transparent border border-black/20 text-[#1a1a1a] py-3.5 text-xs uppercase tracking-[0.25em] rounded-xl hover:bg-black/5 transition-all"
};