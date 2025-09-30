import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleVaccines } from "./routes/vaccines";
import { createReminder, listReminders } from "./routes/reminders";
import { createFamilyMember, listFamilyMembers } from "./routes/family";
import {
  handleVapiProxy,
  handleVapiCall,
  handleVapiTest,
} from "./routes/vapi-proxy";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  app.get("/api/vaccines", handleVaccines);

  app.get("/api/reminders", listReminders);
  app.post("/api/reminders", createReminder);

  app.get("/api/family", listFamilyMembers);
  app.post("/api/family", createFamilyMember);

  // Doctors directory
  const { listDoctors } = require("./routes/doctors");
  app.get("/api/doctors", listDoctors);

  // Appointments
  const { createAppointment, listAppointments } = require("./routes/appointments");
  app.get("/api/appointments", listAppointments);
  app.post("/api/appointments", createAppointment);

  // Vapi proxy routes to bypass client-side network restrictions
  app.get("/api/vapi/test", handleVapiTest);
  app.post("/api/vapi/call", handleVapiCall);
  app.all("/api/vapi/:endpoint", handleVapiProxy);

  return app;
}
