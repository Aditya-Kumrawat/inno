import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FloatingSidebar } from "@/components/FloatingSidebar";
import { FloatingTopBar } from "@/components/FloatingTopBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSidebar } from "@/contexts/SidebarContext";
import {
  Search,
  Bell,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { isCollapsed, setIsCollapsed } = useSidebar();

  const dashboardStats = [
    {
      title: "Total Revenue",
      value: "$54,239",
      change: "+12.5%",
      icon: DollarSign,
      color: "from-green-400 to-green-600",
      bgColor: "from-green-50 to-green-100",
    },
    {
      title: "New Orders",
      value: "1,429",
      change: "+8.2%",
      icon: ShoppingCart,
      color: "from-blue-400 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
    },
    {
      title: "Active Users",
      value: "9,532",
      change: "+18.7%",
      icon: Users,
      color: "from-purple-400 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
    },
    {
      title: "Performance",
      value: "94.2%",
      change: "+2.1%",
      icon: TrendingUp,
      color: "from-orange-400 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
    },
  ];

  // Chart data for the interactive graph
  const chartData = [
    { month: "Jan", revenue: 45000, orders: 120 },
    { month: "Feb", revenue: 52000, orders: 145 },
    { month: "Mar", revenue: 48000, orders: 130 },
    { month: "Apr", revenue: 61000, orders: 180 },
    { month: "May", revenue: 55000, orders: 165 },
    { month: "Jun", revenue: 67000, orders: 200 },
    { month: "Jul", revenue: 72000, orders: 220 },
    { month: "Aug", revenue: 69000, orders: 195 },
    { month: "Sep", revenue: 78000, orders: 240 },
    { month: "Oct", revenue: 84000, orders: 260 },
    { month: "Nov", revenue: 79000, orders: 235 },
    { month: "Dec", revenue: 89000, orders: 285 },
  ];

  // Map data for global business presence
  const mapData = [
    {
      region: "North America",
      customers: 12500,
      revenue: 245000,
      growth: 15.2,
      color: "#8b5cf6",
      position: { x: 150, y: 120 },
    },
    {
      region: "Europe",
      customers: 8900,
      revenue: 189000,
      growth: 12.8,
      color: "#06b6d4",
      position: { x: 420, y: 100 },
    },
    {
      region: "Asia Pacific",
      customers: 15600,
      revenue: 298000,
      growth: 22.5,
      color: "#10b981",
      position: { x: 650, y: 150 },
    },
    {
      region: "South America",
      customers: 4200,
      revenue: 78000,
      growth: 8.3,
      color: "#f59e0b",
      position: { x: 220, y: 250 },
    },
    {
      region: "Africa",
      customers: 2800,
      revenue: 52000,
      growth: 18.7,
      color: "#ef4444",
      position: { x: 480, y: 220 },
    },
  ];

  const [hoveredRegion, setHoveredRegion] = useState(null);

  // Load model-viewer script to render GLB models if not already present
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.querySelector('script[src*="model-viewer"]')) return;
    const s = document.createElement("script");
    s.type = "module";
    s.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
    document.head.appendChild(s);
  }, []);

  return (
    <div className="dashboard-page min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <FloatingSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <FloatingTopBar isCollapsed={isCollapsed} />

      {/* Main Content */}
      <motion.div
        className={`transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-72"} pt-28 p-6 text-sm`}
        animate={{ marginLeft: isCollapsed ? 80 : 272 }}
      >
        {/* Header */}
        <motion.header
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-4xl md:text-5xl font-extrabold text-gray-900 dashboard-title tracking-tight"
                style={{ fontFamily: "Poppins, sans-serif", lineHeight: 1.02 }}
              >
                <span className="block">Dashboard</span>
                <span className="block">Overview</span>
              </h1>
              <p
                className="text-gray-600 mt-2 text-lg max-w-2xl leading-relaxed dashboard-text"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Welcome back! Here's what's happening with your business today.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-800">
                  Good morning, Aditya!
                </div>
                <div className="text-xs text-gray-500">
                  Here's your health snapshot
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  {/* status indicator */}
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white bg-green-500"
                    title="Healthy"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Two Column Layout with Image and Stats */}
        <div className="mb-8">
          <div className="flex gap-5 max-lg:flex-col max-lg:gap-0">
            {/* Left Column - Image */}
            <div className="flex flex-col w-1/2 max-lg:w-full">
              <div
                className="flex flex-col relative mt-5 h-[365px] border-none rounded-2xl"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(124,58,237,0.12) 0%, rgba(124,58,237,0) 40%), radial-gradient(circle at center, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0) 30%)",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="w-full h-full relative">
                  <style>{`@keyframes rotCW{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes rotCCW{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}@keyframes subtlePulse{0%{transform:scale(0.98);opacity:0.9}50%{transform:scale(1.02);opacity:1}100%{transform:scale(0.98);opacity:0.9}}`}</style>

                  {/* concentric circles positioned behind the model */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-visible">
                    <div
                      className="absolute rounded-full"
                      style={{
                        width: "420px",
                        height: "420px",
                        background:
                          "radial-gradient(circle at center, rgba(124,58,237,0.28), rgba(124,58,237,0) 60%)",
                        boxShadow: "0 0 120px rgba(124,58,237,0.45)",
                        opacity: 0.95,
                        transformOrigin: "50% 50%",
                        animation:
                          "rotCW 48s linear infinite, subtlePulse 8s ease-in-out infinite",
                      }}
                    />

                    <div
                      className="absolute rounded-full"
                      style={{
                        width: "280px",
                        height: "280px",
                        background:
                          "radial-gradient(circle at center, rgba(99,102,241,0.36), rgba(99,102,241,0) 60%)",
                        boxShadow: "0 0 60px rgba(99,102,241,0.36)",
                        opacity: 0.95,
                        transformOrigin: "50% 50%",
                        animation:
                          "rotCCW 60s linear infinite, subtlePulse 7s ease-in-out infinite",
                      }}
                    />
                  </div>

                  {/* @ts-ignore - model-viewer web component */}
                  <div className="relative z-10 w-full h-full overflow-visible">
                    <model-viewer
                      src="https://cdn.builder.io/o/assets%2F13b906ad39be4bc99170117fa7908edc%2F17dc1a1ebf484d88b74b53c84ec62453?alt=media&token=765a47e4-6697-4e40-9380-3a940b09ff98&apiKey=13b906ad39be4bc99170117fa7908edc"
                      alt="Realistic Human Heart"
                      camera-controls
                      auto-rotate
                      exposure="1"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 16,
                        background: "transparent",
                        opacity: 0.9,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Dashboard Stats */}
            <div className="flex flex-col w-full lg:w-1/2 lg:ml-5">
              <motion.div className="space-y-6">
                {/* Health Overview Bento Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Vaccination Status */}
                  <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-5 shadow-sm border border-white/30">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <h4
                          className="text-sm md:text-base font-semibold text-gray-800"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          Vaccination Status
                        </h4>
                        <p
                          className="text-2xl font-bold text-gray-900 mt-2"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          78% completed
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Next due: Tdap — 2025-03-10
                        </p>
                      </div>
                      <div className="flex flex-row md:flex-col items-center md:items-end gap-3">
                        <Button
                          size="sm"
                          className="text-white rounded-lg px-3 py-2"
                          style={{ backgroundColor: '#3B82F6' }}
                        >
                          Add / Import
                        </Button>
                        <div className="w-16 md:w-20 h-16 md:h-20 rounded-full flex items-center justify-center text-white font-semibold"
                          style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #14B8A6 100%)' }}>
                          78%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Disease Detection */}
                  <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-5 shadow-sm border border-white/30">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <h4
                          className="text-sm md:text-base font-semibold text-gray-800"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          Disease Detection
                        </h4>
                        <p className="text-xl font-bold text-gray-900 mt-2">
                          Last scan: No issues detected
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Last scanned: 3 days ago
                        </p>
                      </div>
                      <div className="flex flex-row md:flex-col items-center md:items-end gap-2">
                        <Button
                          size="sm"
                          className="text-white rounded-lg px-3 py-2"
                          style={{ backgroundColor: '#14B8A6' }}
                        >
                          Start New Scan
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Exercise */}
                  <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-5 shadow-sm border border-white/30">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <h4
                          className="text-sm md:text-base font-semibold text-gray-800"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          Exercise
                        </h4>
                        <p className="text-xl font-bold text-gray-900 mt-2">
                          Streak: 7 days
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Next: Yoga — Tomorrow 7:00 AM
                        </p>
                      </div>
                      <div className="flex flex-row md:flex-col items-center md:items-end gap-2">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                        <Button
                          size="sm"
                          className="text-white rounded-lg px-3 py-2"
                          style={{ backgroundColor: '#22C55E' }}
                        >
                          Start Workout
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Alerts */}
                  <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-5 shadow-sm border border-white/30">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <h4
                          className="text-sm md:text-base font-semibold text-gray-800"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          Emergency Alerts
                        </h4>
                        <p className="text-xl font-bold text-gray-900 mt-2">
                          All systems normal
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          No recent alerts
                        </p>
                      </div>
                      <div className="flex flex-row md:flex-col items-center md:items-end gap-2">
                        <Button
                          size="sm"
                          className="text-white rounded-2xl px-3 py-2"
                          style={{ backgroundColor: '#DC2626' }}
                        >
                          Emergency SOS
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <Button size="sm" className="text-white rounded-2xl px-3 py-2" style={{ backgroundColor: '#DC2626' }}>🚨 Emergency SOS</Button>
                  <Button size="sm" className="text-white rounded-2xl px-3 py-2" style={{ backgroundColor: '#3B82F6' }}>🗺️ Doctor Heatmap</Button>
                  <Button size="sm" className="text-white rounded-2xl px-3 py-2" style={{ backgroundColor: '#22C55E' }}>➕ Add New Record</Button>
                </div>

                {/* Activity Feed */}
                <div className="mt-4 bg-white/60 backdrop-blur-lg rounded-2xl p-4 shadow-sm border border-white/30">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">
                    Recent Activity
                  </h4>
                  <div className="space-y-3">
                    {[
                      {
                        title: "Uploaded vaccine certificate",
                        time: "1 day ago",
                      },
                      { title: "Completed workout", time: "2 days ago" },
                      {
                        title: "Disease detection scan - clear",
                        time: "3 days ago",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-white/40 transition-colors"
                      >
                        <div className="max-w-[70%]">
                          <div className="text-sm font-medium text-gray-800 truncate">
                            {item.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.time}
                          </div>
                        </div>
                        <div className="text-xs" style={{ color: '#3B82F6', fontWeight: 600 }}>
                          View
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Analytics & Insights - Small cards */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-4 shadow-sm border border-white/30">
                    <h5 className="text-sm font-medium text-gray-800 mb-2">
                      Vaccination over time
                    </h5>
                    <div className="h-16 rounded-md" style={{ background: 'linear-gradient(90deg, rgba(59,130,246,0.06), rgba(59,130,246,0.02))' }} />
                  </div>
                  <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-4 shadow-sm border border-white/30">
                    <h5 className="text-sm font-medium text-gray-800 mb-2">
                      Exercise adherence
                    </h5>
                    <div className="h-16 rounded-md" style={{ background: 'linear-gradient(90deg, rgba(34,197,94,0.06), rgba(34,197,94,0.02))' }} />
                  </div>
                  <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-4 shadow-sm border border-white/30">
                    <h5 className="text-sm font-medium text-gray-800 mb-2">
                      Disease risk trend
                    </h5>
                    <div className="h-16 rounded-md" style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.06), rgba(249,115,22,0.02))' }} />
                  </div>
                </div>

                {/* Doctor Heatmap Preview */}
                <div className="mt-4 bg-white/60 backdrop-blur-lg rounded-2xl p-4 shadow-sm border border-white/30 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-medium text-gray-800">
                      Doctor Heatmap Preview
                    </h5>
                    <p className="text-xs text-gray-500">Tap to expand</p>
                  </div>
                  <div className="w-36 md:w-40 h-24 rounded-lg" style={{ background: 'linear-gradient(90deg, rgba(59,130,246,0.06), rgba(20,184,166,0.06))' }} />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Interactive Animated Graph Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/30">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <h3
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 dashboard-title tracking-tight"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Revenue & Orders Trend
              </h3>
              <motion.div
                className="h-80"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="revenueGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="ordersGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#06b6d4"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#06b6d4"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                      opacity={0.5}
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      type="category"
                      allowDataOverflow={false}
                      allowDecimals={true}
                      allowDuplicatedCategory={true}
                      domain={["dataMin", "dataMax"]}
                      scale="auto"
                      interval="preserveStartEnd"
                      tickCount={5}
                      minTickGap={5}
                      height={60}
                      orientation="bottom"
                      mirror={false}
                      reversed={false}
                      hide={false}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      type="number"
                      allowDataOverflow={false}
                      allowDecimals={true}
                      allowDuplicatedCategory={true}
                      domain={["dataMin", "dataMax"]}
                      scale="auto"
                      tickCount={5}
                      minTickGap={5}
                      width={60}
                      orientation="left"
                      mirror={false}
                      reversed={false}
                      hide={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                        backdropFilter: "blur(10px)",
                      }}
                      labelStyle={{ color: "#374151", fontWeight: "600" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      fill="url(#revenueGradient)"
                      dot={{ fill: "#8b5cf6", strokeWidth: 0, r: 4 }}
                      activeDot={{
                        r: 6,
                        stroke: "#8b5cf6",
                        strokeWidth: 2,
                        fill: "#ffffff",
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Real Geographical World Map Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/30">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dashboard-title">
                Global Business Presence
              </h3>
              <div className="text-sm text-gray-600 dashboard-text">
                Live data from 5 continents
              </div>
            </div>

            <div className="relative">
              {/* Real Geological World Map */}
              <motion.div
                className="relative h-96 rounded-2xl overflow-hidden shadow-lg"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                {/* Real World Map using multiple tile sources for reliability */}
                <div className="relative w-full h-full bg-slate-200">
                  {/* Primary map using Natural Earth */}
                  <img
                    src="https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/img/data/world.png"
                    alt="World Map"
                    className="w-full h-full object-cover rounded-2xl"
                    style={{
                      filter:
                        "hue-rotate(200deg) saturate(1.2) contrast(1.1) brightness(1.05)",
                    }}
                    onError={(e) => {
                      // Fallback to OpenStreetMap static image
                      const target = e.target as HTMLImageElement;
                      target.src = "https://tile.openstreetmap.org/0/0/0.png";
                      target.style.transform = "scale(4)";
                      target.style.transformOrigin = "center";
                    }}
                  />

                  {/* Fallback: Static world map from MapBox */}
                  <img
                    src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-180,-85,180,85/800x400?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw"
                    alt="World Map Fallback"
                    className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-0"
                    style={{
                      filter:
                        "hue-rotate(200deg) saturate(1.2) contrast(1.1) brightness(1.05)",
                    }}
                    onLoad={(e) => {
                      // Show this as backup if primary fails
                      const target = e.target as HTMLImageElement;
                      const primaryImg =
                        target.previousElementSibling as HTMLImageElement | null;
                      if (
                        primaryImg &&
                        primaryImg.complete &&
                        primaryImg.naturalWidth === 0
                      ) {
                        target.style.opacity = "1";
                      }
                    }}
                    onError={(e) => {
                      // Final fallback: Use a data URL with world map
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const container = target.parentElement;
                      if (container) {
                        container.innerHTML = `
                          <div class="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center">
                            <div class="text-center text-white">
                              <h3 class="text-xl font-bold mb-2">World Map</h3>
                              <p class="text-sm opacity-90">Global Business Analytics</p>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />

                  {/* Enhanced overlay with subtle styling */}
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      background: `
                        linear-gradient(45deg, rgba(139, 92, 246, 0.15) 0%, transparent 30%, transparent 70%, rgba(6, 182, 212, 0.15) 100%),
                        radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)
                      `,
                      mixBlendMode: "overlay",
                    }}
                  />

                  {/* Map title overlay */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-md">
                    <h4 className="text-sm font-semibold text-gray-800">
                      Global Coverage
                    </h4>
                    <p className="text-xs text-gray-600">
                      Real-time worldwide data
                    </p>
                  </div>

                  {/* Coordinates grid overlay for authenticity */}
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none opacity-20"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.3) 1px, transparent 1px)
                      `,
                      backgroundSize: "80px 40px",
                    }}
                  />
                </div>
              </motion.div>

              {/* Enhanced Business Metrics */}
              <motion.div
                className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              >
                {/* Total Global Reach */}
                <motion.div
                  className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200/50"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="text-lg font-bold text-[#111827] mb-2">
                    Global Reach
                  </h4>
                  <p className="text-2xl font-bold text-[#111827]">
                    {mapData
                      .reduce((sum, region) => sum + region.customers, 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Total Customers Worldwide
                  </p>
                </motion.div>

                {/* Total Revenue */}
                <motion.div
                  className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200/50"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="text-lg font-bold text-blue-800 mb-2">
                    Global Revenue
                  </h4>
                  <p className="text-2xl font-bold text-blue-900">
                    $
                    {(
                      mapData.reduce((sum, region) => sum + region.revenue, 0) /
                      1000
                    ).toFixed(0)}
                    K
                  </p>
                  <p className="text-sm text-blue-600">
                    Combined Revenue Stream
                  </p>
                </motion.div>

                {/* Average Growth */}
                <motion.div
                  className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border border-green-200/50"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="text-lg font-bold text-green-800 mb-2">
                    Growth Rate
                  </h4>
                  <p className="text-2xl font-bold text-green-900">
                    +
                    {(
                      mapData.reduce((sum, region) => sum + region.growth, 0) /
                      mapData.length
                    ).toFixed(1)}
                    %
                  </p>
                  <p className="text-sm text-green-600">
                    Average Global Growth
                  </p>
                </motion.div>
              </motion.div>

              {/* Regional Breakdown */}
              <motion.div
                className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7, duration: 0.5 }}
              >
                {mapData.map((region, index) => (
                  <motion.div
                    key={region.region}
                    className="bg-white/50 backdrop-blur-sm rounded-2xl p-3 border border-white/30 hover:bg-white/70 transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8 + index * 0.1 }}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div
                        className="w-3 h-3 rounded-full shadow-sm"
                        style={{ backgroundColor: region.color }}
                      />
                      <div className="text-xs font-medium text-gray-800">
                        {region.region}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      <div>{region.customers.toLocaleString()} customers</div>
                      <div className="text-green-600 font-medium">
                        +{region.growth}% growth
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Additional Content Section */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/30">
              <h3
                className="text-xl md:text-2xl font-semibold text-gray-900 mb-4"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "0.2px",
                }}
              >
                Recent Activity
              </h3>
              <div className="space-y-4">
                {[
                  {
                    action: "New order received",
                    time: "2 minutes ago",
                    user: "Sarah Johnson",
                  },
                  {
                    action: "Payment processed",
                    time: "5 minutes ago",
                    user: "Mike Chen",
                  },
                  {
                    action: "User registered",
                    time: "12 minutes ago",
                    user: "Emma Wilson",
                  },
                  {
                    action: "Product updated",
                    time: "1 hour ago",
                    user: "Admin",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/40 transition-colors"
                  >
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p
                        className="text-sm md:text-base font-medium text-gray-800"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">
                        by {activity.user}
                      </p>
                    </div>
                    <p
                      className="text-xs text-gray-500"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {activity.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/30">
              <h3
                className="text-xl md:text-2xl font-semibold text-gray-900 mb-4"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: "0.2px",
                }}
              >
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span
                    className="text-sm md:text-sm text-gray-600 font-medium"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      letterSpacing: "0.1px",
                    }}
                  >
                    Conversion Rate
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    3.2%
                  </span>
                </div>
                <Progress value={32} className="h-2" />

                <div className="flex justify-between items-center">
                  <span
                    className="text-sm md:text-sm text-gray-600 font-medium"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      letterSpacing: "0.1px",
                    }}
                  >
                    Customer Satisfaction
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    4.8/5
                  </span>
                </div>
                <Progress value={96} className="h-2" />

                <div className="flex justify-between items-center">
                  <span
                    className="text-sm md:text-sm text-gray-600 font-medium"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      letterSpacing: "0.1px",
                    }}
                  >
                    Server Uptime
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    99.9%
                  </span>
                </div>
                <Progress value={99.9} className="h-2" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
