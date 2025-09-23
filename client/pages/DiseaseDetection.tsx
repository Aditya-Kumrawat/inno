import React, { useEffect, useRef, useState } from "react";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FloatingSidebar } from "@/components/FloatingSidebar";
import { FloatingTopBar } from "@/components/FloatingTopBar";
import { useSidebar } from "@/contexts/SidebarContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type UploadedImage = {
  id: string;
  name: string;
  dataUrl: string;
};

export default function DiseaseDetection() {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const navigate = useNavigate();

  const [category, setCategory] = useState("Skin");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [afterWidth, setAfterWidth] = useState(50);

  const categories = ["Skin", "Leaf", "Eye", "Oral", "Nail"];

  useEffect(() => {
    let t: number | undefined;
    if (analyzing) {
      setProgress(0);
      t = window.setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            window.clearInterval(t);
            setAnalyzing(false);
            setProgress(100);
            // produce a demo result based on randomness
            const confidence = Math.floor(70 + Math.random() * 25);
            const severity = confidence > 85 ? "severe" : confidence > 78 ? "moderate" : "mild";
            setResult({
              disease: `${category} Condition ${Math.floor(Math.random() * 900 + 100)}`,
              confidence,
              severity,
              description:
                "This AI model suggests a likely condition based on visual features. Seek professional confirmation.",
            });
            return 100;
          }
          return Math.min(100, p + Math.floor(4 + Math.random() * 8));
        });
      }, 350);
    }
    return () => {
      if (t) window.clearInterval(t);
    };
  }, [analyzing, category]);

  const onFiles = async (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).slice(0, 5 - images.length);
    const newOnes: UploadedImage[] = await Promise.all(
      arr.map(async (f) => {
        const dataUrl = await readFileAsDataURL(f);
        return { id: `${Date.now()}-${Math.random()}`, name: f.name, dataUrl };
      })
    );
    setImages((s) => [...s, ...newOnes]);
  };

  const readFileAsDataURL = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const removeImage = (id: string) => setImages((s) => s.filter((i) => i.id !== id));

  const startAnalyze = () => {
    if (images.length === 0) return;
    setResult(null);
    setAnalyzing(true);
  };

  const saveToHistory = () => {
    const history = JSON.parse(localStorage.getItem("disease_history" ) || "[]");
    const entry = {
      id: `${Date.now()}`,
      category,
      images: images.map((i) => ({ name: i.name, dataUrl: i.dataUrl })),
      result,
      createdAt: new Date().toISOString(),
    };
    history.unshift(entry);
    localStorage.setItem("disease_history", JSON.stringify(history));
  };

  const findDoctors = () => {
    const specialty = category === "Skin" ? "Dermatologist" : category === "Eye" ? "Ophthalmologist" : "General Practitioner";
    const url = `https://www.google.com/maps/search/${encodeURIComponent(specialty + " near me")}`;
    window.open(url, "_blank");
  };

  const chatWithAssistant = () => {
    const prefill = result ? `I was diagnosed with ${result.disease} with ${result.confidence}% confidence.` : "I uploaded images for diagnosis.";
    navigate(`/dashboard/chatbot?prefill=${encodeURIComponent(prefill)}`);
  };

  return (
    <div className="dashboard-page min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <FloatingSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <FloatingTopBar isCollapsed={isCollapsed} />

      <motion.div
        className={`transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-72"} pt-28 p-6`}
        animate={{ marginLeft: isCollapsed ? 80 : 272 }}
      >
        <header className="mb-6">
          <h1 className="text-3xl font-bold dashboard-title">AI Disease Diagnosis</h1>
          <p className="text-gray-600 mt-1 dashboard-text">Upload an image to detect possible diseases instantly with AI.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tile 1 — Upload & Analyze (Hero Card) */}
          <section className="lg:col-span-6 bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-6 shadow hover:shadow-lg transition-shadow transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Upload Your Image</h3>
                <p className="text-sm text-gray-600">Drag & drop or choose files (1–5). Select a category and analyze.</p>
              </div>
              <div className="text-sm text-gray-500">Category: <span className="font-medium">{category}</span></div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Category</label>
              <select className="w-full p-2 rounded-md mb-3 border" value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  onFiles(e.dataTransfer.files);
                }}
                className="p-6 rounded-xl border-2 border-dashed border-gray-200 bg-white/40 flex flex-col items-center justify-center gap-3"
              >
                <div className="text-4xl">📷</div>
                <p className="text-sm text-gray-600">Drag & drop images here or</p>
                <div className="flex items-center gap-3">
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => onFiles(e.target.files)}
                  />
                  <Button onClick={() => inputRef.current?.click()} className="bg-purple-600 text-white transform transition hover:scale-105">Choose File</Button>
                </div>
                <div className="text-xs text-gray-500 mt-2">{images.length}/5 uploaded</div>
              </div>

              {images.length > 0 && (
                <div className="mt-4 flex gap-3 overflow-x-auto py-2">
                  {images.map((img) => (
                    <div key={img.id} className="w-24 h-24 rounded-md relative flex-shrink-0 border border-white/40 shadow-sm">
                      <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover rounded-md" />
                      <button onClick={() => removeImage(img.id)} className="absolute top-1 right-1 bg-white/80 rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
                    </div>
                  ))}
                </div>
              )}

            </div>

            <div className="mt-2">
              <Button onClick={startAnalyze} className="w-full py-4 bg-purple-600 text-white text-lg font-semibold transform transition hover:scale-105" disabled={images.length === 0 || analyzing}>
                Analyze Now
              </Button>
            </div>
          </section>

          {/* Tile 2 — AI Analysis State (Dynamic Tile) */}
          <section className="lg:col-span-3 bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow border border-white/30 flex flex-col justify-center transition-all">
            {!analyzing && !result && (
              <div className="text-center text-gray-600">Ready to analyze.</div>
            )}
            {analyzing && (
              <div className="text-center">
                <div className="mx-auto w-28 h-28 rounded-full flex items-center justify-center bg-white/30 mb-4 relative animate-pulse">
                  <svg width="88" height="88" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="g2" x1="0" x2="1" y1="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                    <circle cx="44" cy="44" r="30" stroke="url(#g2)" strokeWidth="6" strokeOpacity="0.6" />
                  </svg>
                </div>
                <div className="text-sm font-medium mb-2">Analyzing with AI…</div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-teal-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
                <div className="text-xs text-gray-500 mt-2">{progress}%</div>
              </div>
            )}

            {!analyzing && result && (
              <div>
                <h4 className="text-lg font-bold mb-2">{result.disease}</h4>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-600">Confidence</div>
                  <div className="font-semibold">{result.confidence}%</div>
                </div>
                <div className="w-full h-3 rounded-full bg-green-100 overflow-hidden mb-3">
                  <div className={`h-full transition-all ${result.confidence > 80 ? "bg-red-400 w-3/4" : result.confidence > 70 ? "bg-yellow-300 w-1/2" : "bg-green-400 w-1/4"}`}></div>
                </div>
                <div className="text-sm text-gray-700">Severity: {result.severity}</div>
              </div>
            )}
          </section>

          {/* Tile 3 — Image Comparison (Side-by-Side Card) */}
          <section className="lg:col-span-3 bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow border border-white/30">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Image Comparison</h4>
              <div className="text-xs text-gray-500">Before / After</div>
            </div>
            <div className="rounded-md overflow-hidden relative h-56 bg-gray-50">
              {images[0] ? (
                <>
                  <img src={images[0].dataUrl} alt="before" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 overflow-hidden">
                    <img src={images[0].dataUrl} alt="after" className="absolute left-0 top-0 h-full object-cover mix-blend-overlay" style={{ width: `${afterWidth}%` }} />
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
              )}
            </div>
            <div className="mt-3">
              <input type="range" min={0} max={100} defaultValue={50} className="w-full" onChange={(e) => {
                const val = Number((e.target as HTMLInputElement).value);
                const after = document.querySelectorAll('section .lg\\:col-span-3 img[alt="after"]') as any;
                if (after && after[0]) after[0].style.width = val + "%";
              }} />
            </div>
          </section>

          {/* Second row: Treatment, Actions, Community */}
          <section className="lg:col-span-4 bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow border border-white/30">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Treatment Options</h4>
              <div className="text-xs text-gray-500">Choose a tab</div>
            </div>
            <TreatmentTabs />
          </section>

          <section className="lg:col-span-4 bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow border border-white/30">
            <h4 className="font-semibold mb-3">Next Actions</h4>
            <div className="flex flex-col gap-3">
              <button onClick={saveToHistory} className="w-full px-4 py-3 rounded-md bg-white/90 text-gray-900 font-semibold shadow hover:shadow-md">💾 Save to History</button>
              <button onClick={findDoctors} className="w-full px-4 py-3 rounded-md bg-purple-600 text-white font-semibold shadow hover:shadow-md">🩺 Find Nearby Doctor</button>
              <button onClick={chatWithAssistant} className="w-full px-4 py-3 rounded-md bg-teal-500 text-white font-semibold shadow hover:shadow-md">🤖 Chat with Health Assistant</button>
            </div>
          </section>

          <section className="lg:col-span-4 bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow border border-white/30">
            <h4 className="font-semibold mb-2">Community Insight</h4>
            <p className="text-sm text-gray-600 mb-3">10 similar cases detected near Indore this week.</p>
            <div className="h-28 rounded-md bg-gradient-to-r from-red-100 via-yellow-100 to-green-100 opacity-60" />
            <div className="text-xs text-gray-500 mt-2">Data anonymized, for awareness only.</div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
