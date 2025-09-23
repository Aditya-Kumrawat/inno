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
          <section className="lg:col-span-4 bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow border border-white/30">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Category</label>
            <select className="w-full p-2 rounded-md mb-4 border" value={category} onChange={(e) => setCategory(e.target.value)}>
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
              className="mb-4 p-4 rounded-lg border-2 border-dashed border-gray-200 bg-white/40"
            >
              <p className="text-sm text-gray-600 mb-2">Drag & drop images here (1–5)</p>
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => onFiles(e.target.files)}
                />
                <Button onClick={() => inputRef.current?.click()} className="bg-purple-500 text-white">Choose File</Button>
                <div className="text-sm text-gray-500 ml-2">{images.length}/5 uploaded</div>
              </div>

              {images.length > 0 && (
                <div className="mt-4 flex gap-3 overflow-x-auto py-2">
                  {images.map((img) => (
                    <div key={img.id} className="w-20 h-20 rounded-md relative flex-shrink-0">
                      <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover rounded-md" />
                      <button onClick={() => removeImage(img.id)} className="absolute top-1 right-1 bg-white/80 rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
                    </div>
                  ))}
                </div>
              )}

            </div>

            <Button onClick={startAnalyze} className="w-full py-3 text-white bg-purple-600 hover:bg-purple-700" disabled={images.length === 0 || analyzing}>
              Analyze Now
            </Button>
          </section>

          <section className="lg:col-span-4 bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow border border-white/30 flex items-center justify-center">
            {!analyzing && !result && (
              <div className="text-center text-gray-600">Ready to analyze. Upload images and click Analyze Now.</div>
            )}

            {analyzing && (
              <div className="w-full text-center">
                <div className="mx-auto w-40 h-40 rounded-full flex items-center justify-center bg-white/30 mb-4 relative">
                  <div className="absolute inset-0 rounded-full border border-white/60 animate-pulse" />
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                    <g>
                      <circle cx="60" cy="60" r="40" stroke="url(#g1)" strokeWidth="6" strokeOpacity="0.5" />
                      <path d="M40 80C50 60 70 60 80 40" stroke="url(#g1)" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.9" />
                    </g>
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
              <div className="w-full">
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">{result.disease}</h2>
                      <div className="text-sm text-gray-600">Confidence: <span className="font-semibold">{result.confidence}%</span></div>
                    </div>
                    <div className="text-2xl">
                      {result.severity === "mild" && <span className="text-green-500">🟢</span>}
                      {result.severity === "moderate" && <span className="text-yellow-400">🟡</span>}
                      {result.severity === "severe" && <span className="text-red-500">🔴</span>}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mb-4">
                  <div className="w-1/2 rounded-md overflow-hidden bg-gray-50">
                    {images[0] && <img src={images[0].dataUrl} alt="original" className="w-full h-48 object-cover" />}
                  </div>
                  <div className="w-1/2 rounded-md overflow-hidden bg-gradient-to-tr from-transparent to-red-200/40 relative">
                    {images[0] && <img src={images[0].dataUrl} alt="processed" className="w-full h-48 object-cover mix-blend-overlay" />}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,0,0,0.12)_0,_rgba(255,0,0,0)_50%)] pointer-events-none" />
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-4">{result.description}</p>

                <div className="mb-3">
                  <div className="flex gap-2">
                    <button className={`px-3 py-2 rounded-md ${"bg-white/80"}`}>Overview</button>
                    <button className={`px-3 py-2 rounded-md ${"bg-white/30 text-gray-600"}`}>History</button>
                  </div>
                </div>

                <div className="bg-white/50 p-3 rounded-md border border-white/30 mb-3">
                  <div className="text-sm font-medium mb-2">Treatment Options</div>
                  <div>
                    <div className="mb-2">
                      <div className="font-semibold">Organic / Lifestyle Remedies</div>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        <li>Keep the area clean and dry.</li>
                        <li>Avoid known irritants and allergens.</li>
                        <li>Use gentle moisturizers and sunscreen.</li>
                      </ul>
                    </div>
                    <div>
                      <div className="font-semibold">Medical / Chemical Treatments</div>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        <li>Topical medicated creams as prescribed.</li>
                        <li>Oral medication for severe or systemic cases.</li>
                        <li>Consult a specialist for targeted therapy.</li>
                      </ul>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-3">This is an AI suggestion, not a medical diagnosis. Consult a doctor for confirmation.</div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={saveToHistory} className="bg-white/90 text-gray-900">Save Diagnosis to History</Button>
                  <Button onClick={findDoctors} className="bg-purple-500 text-white">Find Nearby Doctors</Button>
                  <Button onClick={chatWithAssistant} className="bg-teal-500 text-white">Chat with Health Assistant</Button>
                </div>
              </div>
            )}

          </section>

          <section className="lg:col-span-4 bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow border border-white/30">
            <div className="mb-3">
              <h3 className="text-lg font-semibold">Community Insights</h3>
              <p className="text-sm text-gray-600">10 similar cases detected in your area this week.</p>
            </div>

            <div className="mb-4">
              <div className="text-sm font-medium">Quick Risk</div>
              <div className="w-full h-4 rounded-full bg-green-100 overflow-hidden mt-2">
                <div className={`h-full transition-all ${result ? (result.confidence > 80 ? "bg-red-400 w-3/4" : "bg-yellow-300 w-1/2") : "bg-green-400 w-1/4"}`}></div>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm font-medium">Timeline</div>
              <div className="text-sm text-gray-600">No previous scans. Saved diagnoses will appear here.</div>
            </div>

            <div>
              <Button onClick={() => {
                const h = JSON.parse(localStorage.getItem("disease_history") || "[]");
                if (h.length === 0) return alert("No history yet");
                navigate("/dashboard");
              }} className="w-full">View History</Button>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
