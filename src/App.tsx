import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  HardDrive,
  ExternalLink,
  Maximize2,
  ImageOff,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowDown,
} from "lucide-react";

// --- Helper Functions ---
const getOptimizedUrl = (url: string, type: string = "thumbnail"): string => {
  if (!url) return "";

  // 1. กรณีรูปจาก Unsplash
  if (url.includes("images.unsplash.com")) {
    const baseUrl = url.split("?")[0];
    if (type === "thumbnail")
      return `${baseUrl}?q=60&w=400&auto=format&fit=crop`;
    else return `${baseUrl}?q=90&w=1200&auto=format&fit=crop`;
  }

  // 2. กรณีรูปจาก GitHub (ใช้ wsrv.nl เพื่อย่อรูปให้โหลดเร็ว)
  if (url.includes("raw.githubusercontent.com") || url.startsWith("http")) {
    if (type === "thumbnail") {
      return `https://wsrv.nl/?url=${encodeURIComponent(
        url
      )}&w=400&q=75&output=webp&il`;
    }
    return url;
  }

  return url;
};

const generateCameraSequence = (
  baseUrl: string,
  count: number,
  prefix: string = "",
  startNum: number = 1,
  padding: number = 3,
  extension: string = "jpg"
): string[] => {
  const cleanBaseUrl = baseUrl.replace(/\/$/, "");
  return Array.from({ length: count }, (_, i) => {
    const currentNum = startNum + i;
    const numStr = String(currentNum).padStart(padding, "0");
    return `${cleanBaseUrl}/${prefix}${numStr}.${extension}`;
  });
};

// --- Components กราฟิกและลายไทย ---
const ThaiTopBorder = ({ className }: { className?: string }) => (
  <div
    className={`w-full overflow-hidden leading-[0] bg-[#1a1a1a] ${className}`}
  >
    <svg
      width="100%"
      height="60"
      viewBox="0 0 1200 60"
      preserveAspectRatio="xMidYMid slice"
      fill="currentColor"
      className="text-[#c5a059] opacity-80"
    >
      <defs>
        <pattern
          id="lai-thai-pattern"
          x="0"
          y="0"
          width="100"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M50 30 L65 45 L50 60 L35 45 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />
          <path
            d="M50 30 L65 15 L50 0 L35 15 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />
          <path d="M20 30 Q 35 10, 50 30 Q 65 50, 50 30" fill="none" />
          <path
            d="M0 50 Q 15 50, 25 40 Q 35 30, 50 30 Q 65 30, 75 40 Q 85 50, 100 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M0 10 Q 15 10, 25 20 Q 35 30, 50 30 Q 65 30, 75 20 Q 85 10, 100 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="50" cy="30" r="4" fill="currentColor" />
          <circle cx="0" cy="30" r="2" fill="currentColor" />
          <circle cx="100" cy="30" r="2" fill="currentColor" />
        </pattern>
        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#aa8e5a" />
          <stop offset="50%" stopColor="#e6d299" />
          <stop offset="100%" stopColor="#aa8e5a" />
        </linearGradient>
      </defs>
      <rect
        x="0"
        y="0"
        width="100%"
        height="5"
        fill="url(#gold-gradient)"
        opacity="0.7"
      />
      <rect
        x="0"
        y="55"
        width="100%"
        height="5"
        fill="url(#gold-gradient)"
        opacity="0.7"
      />
      <rect
        x="0"
        y="5"
        width="100%"
        height="50"
        fill="url(#lai-thai-pattern)"
      />
    </svg>
  </div>
);

const LotusIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
  >
    <path
      d="M50 10 C 50 10, 30 40, 30 60 C 30 80, 50 90, 50 90 C 50 90, 70 80, 70 60 C 70 40, 50 10, 50 10 Z"
      className="text-[#c5a059]"
    />
    <path
      d="M50 15 C 50 15, 40 45, 40 60 C 40 70, 50 80, 50 80 C 50 80, 60 70, 60 60 C 60 45, 50 15, 50 15 Z"
      fill="currentColor"
      opacity="0.3"
    />
    <path d="M30 60 Q 10 50, 10 30" strokeOpacity="0.5" />
    <path d="M70 60 Q 90 50, 90 30" strokeOpacity="0.5" />
    <path d="M50 90 L 50 100" />
    <path d="M10 95 Q 50 100, 90 95" strokeOpacity="0.5" />
  </svg>
);

const EVENT_DATA = {
  title: "อนุสรณ์งานบำเพ็ญกุศล",
  subtitle: "คุณแม่วิไลวรรณ ปินตารักษ์\n(ป้าหวานเย็น)",
  dateRange: "๒๓ - ๒๗ ธันวาคม พ.ศ. ๒๕๖๘",
  location: "ณ วัดมหาธาตุ อ.พิชัย จ.อุตรดิตถ์",
  description:
    "ขอกราบขอบพระคุณแขกผู้มีเกียรติทุกท่าน ที่มาร่วมไว้อาลัยและส่งดวงวิญญาณสู่สุคติ\nในวาระสุดท้ายนี้ ความเมตตาของท่านจะสถิตในใจเราตลอดไป",
};

interface DayData {
  id: number;
  label: string;
  date: string;
  driveLink: string;
  images: string[];
}

const DAYS_DATA: DayData[] = [
  {
    id: 1,
    label: "วันที่ ๒๕",
    date: "พิธีสวดพระอภิธรรม",
    driveLink: "https://drive.google.com/drive/folders/YOUR_FOLDER_ID_DAY_1",
    images: [
      ...generateCameraSequence(
        "https://raw.githubusercontent.com/Supparerkk/memorial-photos-wanyen/main/day-25-wanyen",
        50,
        "",
        1,
        3,
        "jpg"
      ),
    ],
  },
  {
    id: 2,
    label: "วันที่ ๒๖",
    date: "พิธีสวดพระอภิธรรม",
    driveLink: "https://drive.google.com/drive/folders/YOUR_FOLDER_ID_DAY_2",
    images: [
      ...generateCameraSequence(
        "https://raw.githubusercontent.com/Supparerkk/memorial-photos-wanyen/main/day-26-wanyen",
        100,
        "",
        1,
        3,
        "jpg"
      ),
    ],
  },
  {
    id: 3,
    label: "วันที่ ๒๗",
    date: "พิธีฌาปนกิจศพ",
    driveLink:
      "https://drive.google.com/drive/folders/1Bpm6Z2DBZnt-ge2ugY3eLCQD4lWv803o",
    images: [
      ...generateCameraSequence(
        "https://raw.githubusercontent.com/Supparerkk/memorial-photos-wanyen/main/day-27-wanyen",
        109,
        "",
        1,
        3,
        "jpg"
      ),
    ],
  },
];

export default function App() {
  const [activeDayId, setActiveDayId] = useState<number>(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeData = DAYS_DATA.find((d) => d.id === activeDayId)!;

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (selectedImageIndex === null) return;
      setSelectedImageIndex((prev) =>
        prev !== null ? (prev + 1) % activeData.images.length : 0
      );
    },
    [selectedImageIndex, activeData.images.length]
  );

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (selectedImageIndex === null) return;
      setSelectedImageIndex((prev) =>
        prev !== null
          ? (prev - 1 + activeData.images.length) % activeData.images.length
          : 0
      );
    },
    [selectedImageIndex, activeData.images.length]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") setSelectedImageIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, handleNext, handlePrev]);

  const handleDownload = async (url: string) => {
    try {
      const fullUrl = getOptimizedUrl(url, "full");
      const response = await fetch(fullUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `photo-day${activeDayId}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-[#c5a059] selection:text-black bg-[#050505] text-[#e0e0e0] font-sans">
      {/* Inject Fonts & Global Styles */}
      <style>
        {`
                    @import url('https://fonts.googleapis.com/css2?family=Chonburi&display=swap');
                    @import url('https://fonts.googleapis.com/css2?family=Niramit:wght@200;300;400;500;600&display=swap');
                    
                    body { 
                        font-family: 'Niramit', sans-serif; 
                        background-color: #050505; 
                        background-image: radial-gradient(circle at 50% 50%, #151515 0%, #050505 100%);
                    }
                    
                    h1, h2, h3, .thai-header {
                        font-family: 'Chonburi', serif;
                    }


                    .fade-in { animation: fadeIn 1s ease-out; }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}
      </style>

      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none shadow-lg">
        <ThaiTopBorder />
      </div>

      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ${
          isScrolled
            ? "bg-[#050505]/95 backdrop-blur-md border-b border-[#c5a059]/30 py-4 mt-12"
            : "bg-transparent py-8 mt-12"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-center items-center">
          <div
            className={`text-[#c5a059] font-medium text-xl tracking-wider thai-header transition-opacity duration-500 ${
              isScrolled ? "opacity-100" : "opacity-0"
            }`}
          >
            {EVENT_DATA.title}
          </div>
        </div>
      </nav>

      <header className="relative pt-44 pb-20 px-4 text-center">
        <div className="fade-in max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-2xl md:text-6xl text-[#e6d299] tracking-wide leading-tight mt-4 drop-shadow-md break-words md:whitespace-nowrap">
            {EVENT_DATA.title}
          </h1>

          <div className="my-6 flex items-center justify-center gap-4 opacity-50">
            <div className="h-[1px] w-12 bg-[#c5a059]"></div>
            <div className="w-2 h-2 rotate-45 border border-[#c5a059]"></div>
            <div className="h-[1px] w-12 bg-[#c5a059]"></div>
          </div>

          <h2 className="text-lg md:text-3xl text-white font-normal mb-2 tracking-wide break-words whitespace-pre-line">
            {EVENT_DATA.subtitle}
          </h2>
          <p className="text-[#c5a059] text-base md:text-xl mt-4 font-light tracking-wider break-words">
            {EVENT_DATA.dateRange} <br />
            <span className="text-sm md:text-base opacity-80 text-gray-400">
              {EVENT_DATA.location}
            </span>
          </p>

          <p className="text-gray-400 text-sm md:text-base mt-10 italic max-w-3xl mx-auto font-light leading-loose opacity-80 px-2 break-words whitespace-pre-line">
            "{EVENT_DATA.description}"
          </p>
        </div>
      </header>

      <div className="sticky top-[100px] z-30 bg-[#0a0a0a]/95 backdrop-blur border-y border-[#c5a059]/20 shadow-2xl">
        <div className="container mx-auto px-2">
          <div className="flex justify-center space-x-2 md:space-x-6 py-4 overflow-x-auto no-scrollbar">
            {DAYS_DATA.map((day) => (
              <button
                key={day.id}
                onClick={() => setActiveDayId(day.id)}
                className={`
                                    px-6 py-2 rounded-sm text-base md:text-lg tracking-wide transition-all duration-500 border border-transparent thai-header
                                    ${
                                      activeDayId === day.id
                                        ? "text-[#c5a059] border-[#c5a059]/50 bg-[#c5a059]/10 shadow-[0_0_15px_rgba(197,160,89,0.1)]"
                                        : "text-gray-500 hover:text-[#c5a059] hover:bg-[#c5a059]/5"
                                    }
                                `}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-16 min-h-[60vh]">
        <div className="text-center mb-12 fade-in border-b border-[#c5a059]/20 pb-8">
          <h3 className="text-2xl md:text-3xl text-[#e6d299] font-medium thai-header inline-block border-b-2 border-[#c5a059] pb-2 px-8">
            {activeData.date}
          </h3>
          <p className="text-gray-500 text-sm mt-4 font-light tracking-wide">
            รวมภาพความทรงจำอันทรงคุณค่า
          </p>
        </div>

        {activeData.images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 fade-in">
            {activeData.images.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-[3/4] md:aspect-square group cursor-pointer overflow-hidden bg-[#151515] shadow-lg border border-[#333] hover:border-[#c5a059]/50 transition-all duration-500 group"
                onClick={() => setSelectedImageIndex(idx)}
              >
                <div className="absolute inset-0 p-1 md:p-2 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 border border-inset border-white/10"></div>
                <img
                  src={getOptimizedUrl(img, "thumbnail")}
                  alt={`Memory ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 opacity-70 group-hover:opacity-100 grayscale-[50%] group-hover:grayscale-0"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                <div className="absolute bottom-4 right-4 bg-[#c5a059] p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 shadow-[0_0_15px_#c5a059]">
                  <Maximize2 size={18} className="text-black" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 text-gray-600 border border-dashed border-[#333] bg-[#111]">
            <ImageOff size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-light">ยังไม่มีรูปภาพในวันนี้</p>
          </div>
        )}

        <div className="text-center mt-24">
          <LotusIcon className="w-8 h-8 text-[#c5a059] mx-auto mb-6 opacity-30" />
          <p className="text-gray-600 text-xs tracking-[0.2em] opacity-50 uppercase">
            In Loving Memory
          </p>
        </div>
      </main>

      <footer className="border-t border-[#c5a059]/20 mt-12 py-12 text-center bg-[#080808]">
        <p className="text-gray-500 text-sm font-light tracking-wide">
          &copy; {new Date().getFullYear()} ด้วยรักและอาลัย
        </p>
      </footer>

      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/98 backdrop-blur-xl p-0 md:p-4 fade-in"
          onClick={() => setSelectedImageIndex(null)}
        >
          <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-start z-50 bg-gradient-to-b from-black via-black/80 to-transparent h-32 pointer-events-none">
            <div className="text-[#c5a059]/80 text-lg font-serif tracking-widest pointer-events-auto">
              {selectedImageIndex + 1}{" "}
              <span className="text-xs text-gray-600 mx-2">/</span>{" "}
              {activeData.images.length}
            </div>
            <div className="flex space-x-4 pointer-events-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(activeData.images[selectedImageIndex]);
                }}
                className="p-3 text-[#c5a059] hover:text-white hover:bg-white/10 rounded-full transition-all flex items-center gap-2 group"
                title="Download"
              >
                <span className="text-xs uppercase tracking-widest block opacity-100 text-[#c5a059]">
                  บันทึกรูป
                </span>
                <Download size={24} strokeWidth={1.5} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(null);
                }}
                className="p-3 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <button
            onClick={handlePrev}
            className="absolute left-2 md:left-8 z-50 p-3 md:p-4 rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-[#c5a059] transition-all hover:scale-110 backdrop-blur-sm border border-white/10"
          >
            <ChevronLeft
              size={32}
              strokeWidth={2}
              className="md:w-14 md:h-14"
            />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 md:right-8 z-50 p-3 md:p-4 rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-[#c5a059] transition-all hover:scale-110 backdrop-blur-sm border border-white/10"
          >
            <ChevronRight
              size={32}
              strokeWidth={2}
              className="md:w-14 md:h-14"
            />
          </button>

          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative border-8 border-white p-2 bg-white shadow-2xl max-h-[80vh] max-w-[90vw] rotate-1 transform transition-transform duration-500 hover:rotate-0">
              <img
                src={getOptimizedUrl(
                  activeData.images[selectedImageIndex],
                  "full"
                )}
                alt="Full view"
                className="max-w-full max-h-[75vh] object-contain select-none"
              />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')] opacity-10 mix-blend-multiply pointer-events-none"></div>
            </div>
            <div
              className="absolute inset-y-0 left-0 w-1/5 z-10"
              onClick={handlePrev}
            ></div>
            <div
              className="absolute inset-y-0 right-0 w-1/5 z-10"
              onClick={handleNext}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
