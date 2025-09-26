import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FloatingSidebar } from "@/components/FloatingSidebar";
import { FloatingTopBar } from "@/components/FloatingTopBar";
import { useSidebar } from "@/contexts/SidebarContext";
import { Button } from "@/components/ui/button";

export default function ExerciseGuidance() {
  const { isCollapsed, setIsCollapsed } = useSidebar();

  const [sessionActive, setSessionActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reps, setReps] = useState(0);
  const [sets, setSets] = useState(0);
  const [duration, setDuration] = useState(0); // seconds
  const [postureState, setPostureState] = useState<"good" | "ok" | "bad">("good");
  const [audioFeedback, setAudioFeedback] = useState(true);
  const timerRef = useRef<number | null>(null);
  const postureRef = useRef<number | null>(null);

  useEffect(() => {
    if (sessionActive && !paused) {
      timerRef.current = window.setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);

      // simulate posture detection updates
      postureRef.current = window.setInterval(() => {
        const r = Math.random();
        if (r > 0.8) setPostureState("bad");
        else if (r > 0.5) setPostureState("ok");
        else setPostureState("good");

        // simulate rep detection
        if (Math.random() > 0.7) setReps((v) => v + 1);
      }, 1200);

      return () => {
        if (timerRef.current) window.clearInterval(timerRef.current);
        if (postureRef.current) window.clearInterval(postureRef.current);
      };
    }

    // cleanup when paused or stopped
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (postureRef.current) window.clearInterval(postureRef.current);
    };
  }, [sessionActive, paused]);

  useEffect(() => {
    if (!audioFeedback) return;
    // simple audio cue when posture is bad
    if (postureState === "bad") {
      const utter = new SpeechSynthesisUtterance("Adjust your posture");
      utter.rate = 1.05;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    }
  }, [postureState, audioFeedback]);

  const startSession = () => {
    setSessionActive(true);
    setPaused(false);
    setDuration(0);
    setReps(0);
    setSets(0);
    setPostureState("good");
  };
  const pauseSession = () => setPaused((p) => !p);
  const endSession = () => {
    setSessionActive(false);
    setPaused(false);
    setSets((s) => s + 1);
    // save summary to localStorage
    const history = JSON.parse(localStorage.getItem("exercise_history") || "[]");
    history.unshift({ id: Date.now(), reps, sets: sets + 1, duration, postureScore: Math.round(Math.random() * 20 + 80) });
    localStorage.setItem("exercise_history", JSON.stringify(history));
  };

  const postureColor = postureState === "good" ? "bg-green-100 border-green-300" : postureState === "ok" ? "bg-yellow-100 border-yellow-300" : "bg-red-100 border-red-300";
  const postureLabel = postureState === "good" ? "Good" : postureState === "ok" ? "Minor" : "Major";

  return (
    <div className="dashboard-page min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <FloatingSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <FloatingTopBar isCollapsed={isCollapsed} />

      <motion.div className={`transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-72"} pt-28 p-6`}>
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold dashboard-title">Exercise Guidance</h1>
            <p className="text-gray-600 mt-1 dashboard-text">Follow along, track your posture, and stay fit!</p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white shadow ${postureState === "good" ? "bg-green-500" : postureState === "ok" ? "bg-yellow-500" : "bg-red-500"}`}>
              {postureState === "good" ? "💪" : postureState === "ok" ? "🙂" : "⚠️"}
            </div>
            <div className="text-sm text-gray-700">
              <div className="font-semibold">Session</div>
              <div className="text-xs text-gray-500">{sessionActive ? (paused ? "Paused" : "Active") : "Not started"}</div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Horizontal sub-navigation for Exercise */}
          <div className="lg:col-span-12 w-full">
            <div className="flex gap-2 overflow-x-auto mb-3">
              <button className="px-3 py-1 rounded-full bg-white/80 border text-sm">Overview</button>
              <button className="px-3 py-1 rounded-full bg-white/80 border text-sm">Live</button>
              <button className="px-3 py-1 rounded-full bg-white/80 border text-sm">Tutorials</button>
              <button className="px-3 py-1 rounded-full bg-white/80 border text-sm">History</button>
              <button className="px-3 py-1 rounded-full bg-white/80 border text-sm">Settings</button>
            </div>
          </div>

          {/* Tile 1 - Live Camera Feed / Hero */}
          <section className="lg:col-span-7 bg-white rounded-2xl p-4 shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Live Camera Feed</h3>
              <div className="text-sm text-gray-500">Posture overlay + guidance</div>
            </div>


            <div className="relative rounded-xl overflow-hidden bg-black/5 border border-gray-200 h-[420px] flex items-center justify-center">
              {/* Webcam placeholder */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">Webcam feed placeholder</div>

              {/* simulated overlay */}
              <div className={`absolute bottom-4 left-4 px-3 py-1 rounded-md border ${postureColor} text-sm`}>{postureLabel} posture</div>

              <div className="absolute top-4 right-4 flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={audioFeedback} onChange={() => setAudioFeedback((s) => !s)} />
                  Audio
                </label>
                <Button onClick={startSession} className="px-3 py-1 bg-green-600 text-white">Start</Button>
                <Button onClick={pauseSession} className="px-3 py-1 bg-yellow-500 text-white" disabled={!sessionActive}>{paused ? "Resume" : "Pause"}</Button>
                <Button onClick={endSession} className="px-3 py-1 bg-red-500 text-white" disabled={!sessionActive}>End</Button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4">
              <motion.div className="p-3 bg-white rounded-lg shadow-sm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                <div className="text-xs text-gray-500">Reps</div>
                <motion.div className="font-semibold text-xl" key={reps} initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>{reps}</motion.div>
              </motion.div>
              <motion.div className="p-3 bg-white rounded-lg shadow-sm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }}>
                <div className="text-xs text-gray-500">Sets</div>
                <motion.div className="font-semibold text-xl" key={sets} initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>{sets}</motion.div>
              </motion.div>
              <motion.div className="p-3 bg-white rounded-lg shadow-sm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}>
                <div className="text-xs text-gray-500">Duration</div>
                <motion.div className="font-semibold text-xl" key={duration} initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>{Math.floor(duration / 60)}:{String(duration % 60).padStart(2, "0")}</motion.div>
              </motion.div>
              <motion.div className="p-3 bg-white rounded-lg shadow-sm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.15 }}>
                <div className="text-xs text-gray-500">Posture Score</div>
                <motion.div className="font-semibold text-xl" initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>{Math.max(60, 95 - Math.floor(Math.random() * 20))}%</motion.div>
              </motion.div>
            </div>
          </section>

          {/* Tile 2 - Instructions / Form Card (expanded) */}
          <section className="lg:col-span-5 bg-white rounded-2xl p-6 shadow">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Exercise Instructions</h4>
              <div className="text-xs text-gray-500">Demo</div>
            </div>
            <div className="mb-3">
              <div className="font-semibold">Squats</div>
              <div className="text-sm text-gray-500">Target: 3 sets × 12 reps</div>
            </div>
            <div className="rounded-md overflow-hidden bg-gray-50 h-56 mb-4">
              <iframe
                title="Squat Animation Demo"
                src="https://sketchfab.com/models/3e07457bf9df4034bad23ec98b4dfca8/embed?autostart=1&camera=0&transparent=1"
                frameBorder={0}
                allow="autoplay; fullscreen; xr-spatial-tracking"
                className="w-full h-full"
              />
            </div>
            <div className="text-sm text-gray-700 mb-2">Tips:</div>
            <ul className="list-disc list-inside text-sm text-gray-700 mb-3">
              <li>Engage your core.</li>
              <li>Keep back straight.</li>
              <li>Drive through heels.</li>
            </ul>
            <div className="flex gap-2 mb-4">
              <Button onClick={() => alert("Start guided demo (placeholder)")}>Start Demo</Button>
              <Button onClick={() => alert("Expand instructions (placeholder)")}>More</Button>
            </div>

            {/* Live Metrics moved under instructions */}
            <div className="bg-white/50 rounded-lg p-4 border">
              <h5 className="font-semibold mb-2">Live Metrics</h5>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <motion.div className="p-3 bg-white/50 rounded-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                  <div className="text-xs text-gray-500">Reps Completed</div>
                  <motion.div className="font-semibold text-lg" key={reps} initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.25 }}>{reps}</motion.div>
                </motion.div>
                <motion.div className="p-3 bg-white/50 rounded-lg" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.05 } }} transition={{ duration: 0.4 }}>
                  <div className="text-xs text-gray-500">Estimated Calories</div>
                  <motion.div className="font-semibold text-lg" initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.25 }}>{Math.round((reps * 0.5 + duration / 60) * 5)} kcal</motion.div>
                </motion.div>
              </div>
              <div className="text-sm text-gray-500 mb-2">Posture State</div>
              <motion.div className={`px-3 py-2 rounded-md border ${postureColor}`} initial={{ scale: 0.98 }} animate={{ scale: 1 }} transition={{ duration: 0.35 }}>{postureLabel}</motion.div>
            </div>
          </section>

          {/* Tile 4 - Avatar / Motivation */}
          <section className="lg:col-span-3 bg-white rounded-2xl p-4 shadow">
            <h4 className="font-semibold mb-3">Motivation Avatar</h4>
            <div className="w-full h-40 rounded-lg bg-gradient-to-br from-purple-50 to-teal-50 flex items-center justify-center text-6xl">{postureState === "good" ? "🏆" : postureState === "ok" ? "🙂" : "😓"}</div>
            <div className="mt-3 text-sm text-gray-600">Keep your posture correct for a stronger avatar!</div>
            <div className="mt-3 flex gap-2">
              <Button onClick={() => alert("View badges (placeholder)")}>Badges</Button>
              <Button onClick={() => alert("View streaks (placeholder)")}>Streaks</Button>
            </div>
          </section>

          {/* Tile 5 - Session Summary */}
          <section className="lg:col-span-5 bg-white rounded-2xl p-4 shadow">
            <h4 className="font-semibold mb-3">Session Summary</h4>
            {sessionActive ? (
              <div className="text-sm text-gray-500">Session in progress — end to view summary.</div>
            ) : (
              <div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="p-3 bg-white/50 rounded-lg">
                    <div className="text-xs text-gray-500">Last Reps</div>
                    <div className="font-semibold text-lg">{reps}</div>
                  </div>
                  <div className="p-3 bg-white/50 rounded-lg">
                    <div className="text-xs text-gray-500">Last Duration</div>
                    <div className="font-semibold text-lg">{Math.floor(duration / 60)}:{String(duration % 60).padStart(2, "0")}</div>
                  </div>
                </div>
                <div className="mb-3">
                  <Button onClick={() => alert("Save session (placeholder)")}>Save Session</Button>
                  <Button onClick={() => alert("Share summary (placeholder)")}>Share</Button>
                </div>

                <div>
                  <h5 className="font-semibold mb-2">History</h5>
                  <div className="text-sm text-gray-600">Recent sessions saved locally.</div>
                </div>
              </div>
            )}
          </section>

          {/* Tile 6 - Quick Actions */}
          <section className="lg:col-span-4 bg-white rounded-2xl p-4 shadow">
            <h4 className="font-semibold mb-3">Quick Actions</h4>
            <div className="flex flex-col gap-3">
              <Button onClick={() => alert("Schedule next workout (placeholder)")}>📅 Schedule</Button>
              <Button onClick={() => alert("Set reminders (placeholder)")}>🔔 Reminders</Button>
              <Button onClick={() => alert("Export data (placeholder)")}>📤 Export Data</Button>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
