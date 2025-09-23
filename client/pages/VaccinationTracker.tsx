import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FloatingSidebar } from "@/components/FloatingSidebar";
import { FloatingTopBar } from "@/components/FloatingTopBar";
import { useSidebar } from "@/contexts/SidebarContext";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

type FamilyMember = { id: string; name: string; avatarColor?: string; upToDate: boolean };
type Vaccine = { id: string; name: string; date: string; dose: number; status: "done" | "upcoming" | "overdue" };

export default function VaccinationTracker() {
  const { isCollapsed, setIsCollapsed } = useSidebar();

  const [members, setMembers] = useState<FamilyMember[]>([
    { id: "m1", name: "Aditya", avatarColor: "bg-green-400", upToDate: true },
    { id: "m2", name: "Neha", avatarColor: "bg-yellow-300", upToDate: false },
    { id: "m3", name: "Rohit", avatarColor: "bg-green-300", upToDate: true },
  ]);
  const [activeMember, setActiveMember] = useState(members[0].id);

  const [vaccines, setVaccines] = useState<Vaccine[]>([
    { id: "v1", name: "Flu Shot", date: "2025-10-01", dose: 1, status: "upcoming" },
    { id: "v2", name: "Tetanus", date: "2023-08-12", dose: 1, status: "done" },
    { id: "v3", name: "Polio", date: "2026-02-20", dose: 2, status: "upcoming" },
    { id: "v4", name: "COVID-19 Booster", date: "2024-11-05", dose: 3, status: "overdue" },
  ]);

  const facts = [
    "Your next Tetanus shot reduces severe infection risk by ~90%.",
    "Vaccines protect you and those around you — herd immunity saves lives.",
    "Over 80% of flu hospitalizations are preventable with vaccination.",
  ];

  const [factIndex, setFactIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setFactIndex((i) => (i + 1) % facts.length), 4000);
    return () => clearInterval(t);
  }, []);

  const activeMemberObj = useMemo(() => members.find((m) => m.id === activeMember) || members[0], [members, activeMember]);

  const doneCount = vaccines.filter((v) => v.status === "done").length;
  const upcomingCount = vaccines.filter((v) => v.status === "upcoming").length;
  const overdueCount = vaccines.filter((v) => v.status === "overdue").length;

  const completion = Math.round((doneCount / Math.max(1, vaccines.length)) * 100);

  function addManualRecord() {
    const id = `v-${Date.now()}`;
    setVaccines((s) => [{ id, name: "New Vaccine", date: new Date().toISOString().slice(0, 10), dose: 1, status: "upcoming" }, ...s]);
  }

  function markDone(id: string) {
    setVaccines((s) => s.map((v) => (v.id === id ? { ...v, status: "done" } : v)));
  }

  function syncCalendar() {
    alert("Syncing to calendar (placeholder)...");
  }

  function downloadCertificate() {
    alert("Downloading certificate (placeholder)...");
  }

  return (
    <div className="dashboard-page min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <FloatingSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <FloatingTopBar isCollapsed={isCollapsed} />

      <motion.div className={`transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-72"} pt-28 p-6`}>
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold dashboard-title">Vaccination Tracker</h1>
            <p className="text-gray-600 mt-1 dashboard-text">Stay protected. Track your vaccinations with ease.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${activeMemberObj.upToDate ? "bg-green-500" : "bg-red-400"} shadow-lg`}>🙂</div>
              <div className="text-sm text-gray-700">
                <div className="font-semibold">{activeMemberObj.name}</div>
                <div className="text-xs text-gray-500">{activeMemberObj.upToDate ? "Up-to-date" : "Overdue"}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/80 p-2 rounded-lg shadow-sm">
              {members.map((m) => (
                <button key={m.id} onClick={() => setActiveMember(m.id)} className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${m.id === activeMember ? "ring-2 ring-purple-400" : "opacity-80"} ${m.avatarColor}`}> {m.name[0]} </button>
              ))}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Overview Card */}
          <section className="lg:col-span-5 bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Vaccination Status</h3>
                <p className="text-sm text-gray-600">Progress for {activeMemberObj.name}</p>
              </div>
              <div className="text-sm text-gray-500">Total: {vaccines.length}</div>
            </div>

            <div className="flex items-center gap-6">
              <div className="w-36 h-36 flex items-center justify-center">
                {/* SVG progress ring */}
                <svg viewBox="0 0 36 36" className="w-32 h-32">
                  <path d="M18 2.0845a15.9155 15.9155 0 1 1 0 31.831" fill="none" stroke="#e6e6e6" strokeWidth="3.2" />
                  <path
                    d="M18 2.0845a15.9155 15.9155 0 1 1 0 31.831"
                    fill="none"
                    stroke="#7c3aed"
                    strokeWidth="3.2"
                    strokeDasharray={`${completion} ${100 - completion}`}
                    strokeLinecap="round"
                  />
                  <text x="18" y="20.5" textAnchor="middle" className="text-sm font-semibold fill-current text-gray-800" style={{ fontSize: 8 }}>
                    {completion}%
                  </text>
                </svg>
              </div>

              <div className="flex-1">
                <div className="mb-2">
                  <div className="text-sm text-gray-600">Next Due</div>
                  <div className="font-semibold">{vaccines[0]?.name || "None"} — {vaccines[0]?.date || "—"}</div>
                </div>

                <div className="flex gap-2 mb-3">
                  <button onClick={addManualRecord} className="px-3 py-2 rounded-md bg-white/90 shadow hover:shadow-md">➕ Add Vaccine Record</button>
                  <button onClick={syncCalendar} className="px-3 py-2 rounded-md bg-white/90 shadow hover:shadow-md">📅 Sync with Calendar</button>
                  <button onClick={downloadCertificate} className="px-3 py-2 rounded-md bg-white/90 shadow hover:shadow-md">⬇️ Download Certificate</button>
                </div>

                <div className="text-sm text-gray-600">Summary</div>
                <div className="mt-2 flex gap-3">
                  <div className="p-3 bg-green-50 rounded-lg flex-1">
                    <div className="text-xs text-gray-500">Done</div>
                    <div className="font-semibold text-lg">{doneCount}</div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg flex-1">
                    <div className="text-xs text-gray-500">Upcoming</div>
                    <div className="font-semibold text-lg">{upcomingCount}</div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg flex-1">
                    <div className="text-xs text-gray-500">Overdue</div>
                    <div className="font-semibold text-lg">{overdueCount}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="lg:col-span-7 bg-white rounded-2xl p-6 shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upcoming Vaccines Timeline</h3>
              <div className="text-sm text-gray-500">Chronological</div>
            </div>

            <div className="flex gap-3 overflow-x-auto py-2">
              {vaccines.map((v) => (
                <div key={v.id} className={`min-w-[220px] p-4 rounded-xl shadow-sm border ${v.status === "done" ? "bg-green-50 border-green-100" : v.status === "upcoming" ? "bg-yellow-50 border-yellow-100" : "bg-red-50 border-red-100"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">{v.name}</div>
                    <div className="text-xs text-gray-500">Dose {v.dose}</div>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">{v.date}</div>
                  <div className="text-sm text-gray-700 mb-3">{v.status === "done" ? "✅ Done" : v.status === "upcoming" ? "⏳ Upcoming" : "⚠️ Overdue"}</div>
                  <div className="text-xs text-gray-600">Why it matters: Helps prevent serious illness.</div>
                  <div className="mt-3 flex gap-2">
                    {v.status !== "done" && <button onClick={() => markDone(v.id)} className="px-2 py-1 rounded-md bg-purple-600 text-white text-sm">Mark Done</button>}
                    <button className="px-2 py-1 rounded-md bg-white/90 text-sm">More</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="text-md font-semibold mb-2">Facts & Insights</h4>
              <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-teal-50">{facts[factIndex]}</div>
            </div>
          </section>

          {/* Right column: Reminders, Gamification, Emergency */}
          <section className="lg:col-span-4 bg-white rounded-2xl p-4 shadow">
            <h4 className="font-semibold mb-3">Reminders & Notifications</h4>
            <div className="flex flex-col gap-3 mb-4">
              <label className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                <div>
                  <div className="text-sm font-medium">Push Notification</div>
                  <div className="text-xs text-gray-500">Receive push alerts</div>
                </div>
                <input type="checkbox" defaultChecked />
              </label>

              <label className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                <div>
                  <div className="text-sm font-medium">WhatsApp Reminder</div>
                  <div className="text-xs text-gray-500">Receive reminders via WhatsApp</div>
                </div>
                <input type="checkbox" />
              </label>

              <label className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                <div>
                  <div className="text-sm font-medium">Calendar Auto-sync</div>
                  <div className="text-xs text-gray-500">Sync upcoming vaccines to calendar</div>
                </div>
                <input type="checkbox" defaultChecked />
              </label>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Gamification</h4>
              <div className="p-3 bg-green-50 rounded-lg">You have kept up vaccinations for <strong>3 years</strong>.</div>
              <div className="mt-3 text-sm text-gray-500">Family protection: <strong>90%</strong></div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Emergency / Quick Access</h4>
              <div className="flex flex-col gap-2">
                <button onClick={() => window.open("https://www.google.com/maps/search/vaccine+center+near+me", "_blank")} className="w-full px-3 py-2 rounded-md bg-purple-600 text-white">Find Nearby Vaccine Center</button>
                <button onClick={() => alert("Call helpline: 123-456-7890 (placeholder)")} className="w-full px-3 py-2 rounded-md bg-white/90">Emergency Helpline</button>
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
