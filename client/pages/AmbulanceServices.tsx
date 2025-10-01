import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FloatingSidebar } from "@/components/FloatingSidebar";
import { FloatingTopBar } from "@/components/FloatingTopBar";
import { useSidebar } from "@/contexts/SidebarContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Phone, Siren, Ambulance as AmbulanceIcon, ShieldAlert, FlameKindling } from "lucide-react";

const frostedCardClass =
  "rounded-3xl border border-white/45 bg-gradient-to-br from-white/85 via-white/50 to-white/25 backdrop-blur-xl shadow-[0_30px_80px_rgba(59,130,246,0.18)]";

const HOSPITAL_POS: [number, number] = [22.7196, 75.8577]; // Indore (mock hospital)
const AMBULANCE_START: [number, number] = [22.7100, 75.8500];

function FitToRoute({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length >= 2) {
      const bounds = L.latLngBounds(points.map((p) => L.latLng(p[0], p[1])));
      map.fitBounds(bounds, { padding: [24, 24] });
    }
  }, [points, map]);
  return null;
}

function makeDivIcon(html: string) {
  return L.divIcon({
    html,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

const ambulanceIcon = makeDivIcon(
  '<div class="flex items-center justify-center w-7 h-7 rounded-full shadow bg-white">🚑</div>'
);
const hospitalIcon = makeDivIcon(
  '<div class="flex items-center justify-center w-7 h-7 rounded-full shadow bg-white text-red-600">✚</div>'
);

function distance(a: [number, number], b: [number, number]) {
  const dLat = a[0] - b[0];
  const dLng = a[1] - b[1];
  return Math.hypot(dLat, dLng);
}

function stepTowards(curr: [number, number], target: [number, number], step = 0.002): [number, number] {
  const dLat = target[0] - curr[0];
  const dLng = target[1] - curr[1];
  const dist = Math.hypot(dLat, dLng);
  if (dist === 0 || dist <= step) return target;
  const r = step / dist;
  return [curr[0] + dLat * r, curr[1] + dLng * r];
}

export default function AmbulanceServices() {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [ambPos, setAmbPos] = useState<[number, number]>(AMBULANCE_START);
  const [isMoving, setIsMoving] = useState(false);
  const [phase, setPhase] = useState<"to-user" | "to-hospital">("to-user");
  const timerRef = useRef<number | null>(null);

  // Geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      setUserPos([22.7205, 75.8571]); // fallback near hospital
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
      },
      () => setUserPos([22.7205, 75.8571])
    );
  }, []);

  const routePoints = useMemo(() => {
    const pts: [number, number][] = [ambPos];
    if (userPos) pts.push(userPos);
    pts.push(HOSPITAL_POS);
    return pts;
  }, [ambPos, userPos]);

  // Movement logic
  useEffect(() => {
    if (!isMoving || !userPos) return;

    const tick = () => {
      const target = phase === "to-user" ? userPos : HOSPITAL_POS;
      setAmbPos((curr) => {
        const next = stepTowards(curr, target);
        const arrived = distance(next, target) <= 0.0008; // ~few dozen meters
        if (arrived) {
          if (phase === "to-user") {
            setPhase("to-hospital");
          } else {
            setIsMoving(false); // finished
          }
        }
        return next;
      });
    };

    tick();
    timerRef.current = window.setInterval(tick, 2000);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isMoving, userPos, phase]);

  const onBook = useCallback(() => {
    if (!userPos) {
      alert("Fetching your location. Please allow location access and try again.");
      return;
    }
    setPhase("to-user");
    setIsMoving(true);
  }, [userPos]);

  const onCancel = useCallback(() => {
    setIsMoving(false);
    setPhase("to-user");
    setAmbPos(AMBULANCE_START);
  }, []);

  const mapCenter = userPos ?? AMBULANCE_START;

  return (
    <div className="dashboard-page min-h-screen bg-gradient-to-br from-white via-[#f8fbff] to-[#eef2ff]">
      <FloatingSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <FloatingTopBar isCollapsed={isCollapsed} />
      <div className={`transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-72"} pt-28`}>
        <div className="mx-auto w-full max-w-7xl px-6 pb-16">
          <h1 className="dashboard-title text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-6">Ambulance Services</h1>

          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            {/* Left: 70% (lg: col-span-7) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <Button onClick={onBook} className="bg-green-600 hover:bg-green-700">
                  <Siren className="mr-2 h-4 w-4" /> Book Ambulance
                </Button>
                <Button variant="destructive" onClick={onCancel}>
                  Cancel Request
                </Button>
              </div>

              <div className="h-[500px] rounded-xl overflow-hidden border border-white/50 shadow-xl bg-white/70">
                {mapCenter && (
                  <MapContainer center={mapCenter} zoom={13} className="h-full w-full">
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Route: Ambulance -> User -> Hospital */}
                    <Polyline positions={routePoints} pathOptions={{ color: "#2563eb", weight: 4 }} />

                    {/* Ambulance */}
                    <Marker position={ambPos} icon={ambulanceIcon} />

                    {/* User location */}
                    {userPos && (
                      <CircleMarker center={userPos} radius={8} pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.9 }} />
                    )}

                    {/* Hospital */}
                    <Marker position={HOSPITAL_POS} icon={hospitalIcon} />

                    <FitToRoute points={routePoints} />
                  </MapContainer>
                )}
              </div>
            </div>

            {/* Right: 30% (lg: col-span-3) */}
            <div className="lg:col-span-3 space-y-4">
              {/* Emergency Services */}
              <Card className={frostedCardClass}>
                <CardHeader>
                  <CardTitle className="dashboard-title text-lg font-semibold tracking-tight">Emergency Services</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-3">
                  <Button className="flex flex-col items-center gap-1 py-6" onClick={() => alert("SMS sent to Ambulance")}>
                    <AmbulanceIcon className="h-5 w-5" />
                    <span className="text-xs">Ambulance</span>
                  </Button>
                  <Button className="flex flex-col items-center gap-1 py-6" onClick={() => alert("SMS sent to Police")}>
                    <ShieldAlert className="h-5 w-5" />
                    <span className="text-xs">Police</span>
                  </Button>
                  <Button className="flex flex-col items-center gap-1 py-6" onClick={() => alert("SMS sent to Fire")}>
                    <FlameKindling className="h-5 w-5" />
                    <span className="text-xs">Fire</span>
                  </Button>
                </CardContent>
              </Card>

              {/* Emergency Contacts */}
              <Card className={frostedCardClass}>
                <CardHeader>
                  <CardTitle className="dashboard-title text-lg font-semibold tracking-tight">Emergency Contacts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between rounded-xl border bg-white/60 p-3">
                    <div>
                      <div className="text-sm font-medium">Riya Sharma</div>
                      <div className="text-xs text-muted-foreground">+91 98765 43210</div>
                    </div>
                    <Button size="sm" onClick={() => alert("SMS sent to Riya")}>Notify</Button>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border bg-white/60 p-3">
                    <div>
                      <div className="text-sm font-medium">Arjun Verma</div>
                      <div className="text-xs text-muted-foreground">+91 91234 56780</div>
                    </div>
                    <Button size="sm" onClick={() => alert("SMS sent to Arjun")}>Notify</Button>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border bg-white/60 p-3">
                    <div>
                      <div className="text-sm font-medium">Family Group</div>
                      <div className="text-xs text-muted-foreground">+91 90000 00000</div>
                    </div>
                    <Button size="sm" onClick={() => alert("SMS sent to Family Group")}>Notify</Button>
                  </div>
                  <Button className="w-full" onClick={() => alert("Emergency message sent to all contacts")}>Notify All</Button>
                </CardContent>
              </Card>

              {/* Call All */}
              <Card className={frostedCardClass}>
                <CardContent className="p-4">
                  <Button className="w-full bg-red-600 hover:bg-red-700 py-6 text-base" onClick={() => alert("Calling ambulance, police, fire, and contacts")}>Call All</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
