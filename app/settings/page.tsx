"use client";

import { useRef, useState } from "react";
import { useTheme } from "next-themes";
import { useSettings, updateSettings } from "@/lib/hooks/use-settings";
import { exportAllData, importAllData, downloadJSON } from "@/lib/db/export-import";
import { generateSchedule } from "@/lib/db/schedule";
import { db } from "@/lib/db/schema";
import { Download, Upload, RefreshCw, Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const settings = useSettings();
  const { theme, setTheme } = useTheme();
  const fileRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string>("");

  const handleExport = async () => {
    const json = await exportAllData();
    const date = new Date().toISOString().slice(0, 10);
    downloadJSON(json, `muscle-calendar-backup-${date}.json`);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImportStatus("Importing...");
      const text = await file.text();
      await importAllData(text);
      setImportStatus("Import successful! Reloading...");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setImportStatus(`Import failed: ${err}`);
    }
  };

  const handleRegenerate = async () => {
    if (!settings) return;
    if (!confirm("This will clear all scheduled workouts and regenerate. Sessions are kept. Continue?")) return;

    await db.scheduledWorkouts.clear();
    await generateSchedule(new Date(settings.planStartDate), 12);
    alert("Schedule regenerated!");
  };

  const handleStartDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await updateSettings({ planStartDate: e.target.value });
  };

  const handleAutoFillToggle = async () => {
    if (!settings) return;
    await updateSettings({ autoFillLastWeights: !settings.autoFillLastWeights });
  };

  if (!settings) return null;

  return (
    <div className="max-w-lg mx-auto px-4 py-5">
      <h1 className="text-xl font-bold mb-5">Settings</h1>

      <div className="space-y-6">
        {/* Theme */}
        <section>
          <h2 className="text-sm font-semibold mb-3">Appearance</h2>
          <div className="flex gap-2">
            {[
              { key: "light", icon: Sun, label: "Light" },
              { key: "dark", icon: Moon, label: "Dark" },
              { key: "system", icon: Monitor, label: "System" },
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setTheme(key)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors touch-manipulation",
                  theme === key
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--muted)] text-[var(--muted-fg)]"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Schedule */}
        <section>
          <h2 className="text-sm font-semibold mb-3">Schedule</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-[var(--muted-fg)] block mb-1">Plan Start Date</label>
              <input
                type="date"
                value={settings.planStartDate}
                onChange={handleStartDateChange}
                className="w-full h-10 px-3 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            </div>
            <button
              onClick={handleRegenerate}
              className="flex items-center gap-2 w-full py-2.5 rounded-lg bg-[var(--muted)] text-sm font-medium transition-colors hover:bg-[var(--border)] touch-manipulation"
            >
              <RefreshCw className="w-4 h-4 ml-3" />
              <span>Regenerate Schedule (12 weeks)</span>
            </button>
          </div>
        </section>

        {/* Logging */}
        <section>
          <h2 className="text-sm font-semibold mb-3">Logging</h2>
          <button
            onClick={handleAutoFillToggle}
            className="flex items-center justify-between w-full py-2.5 px-3 rounded-lg bg-[var(--muted)] text-sm"
          >
            <span>Auto-fill last weights</span>
            <div
              className={cn(
                "w-10 h-6 rounded-full transition-colors relative",
                settings.autoFillLastWeights ? "bg-[var(--accent)]" : "bg-[var(--border)]"
              )}
            >
              <div
                className={cn(
                  "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                  settings.autoFillLastWeights ? "translate-x-4.5" : "translate-x-0.5"
                )}
              />
            </div>
          </button>
        </section>

        {/* Data */}
        <section>
          <h2 className="text-sm font-semibold mb-3">Data</h2>
          <div className="space-y-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 w-full py-2.5 rounded-lg bg-[var(--muted)] text-sm font-medium transition-colors hover:bg-[var(--border)] touch-manipulation"
            >
              <Download className="w-4 h-4 ml-3" />
              <span>Export All Data (JSON)</span>
            </button>

            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 w-full py-2.5 rounded-lg bg-[var(--muted)] text-sm font-medium transition-colors hover:bg-[var(--border)] touch-manipulation"
            >
              <Upload className="w-4 h-4 ml-3" />
              <span>Import Data (JSON)</span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />

            {importStatus && (
              <p className="text-xs text-[var(--muted-fg)] px-1">{importStatus}</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
