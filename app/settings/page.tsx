"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useSettings, updateSettings } from "@/lib/hooks/use-settings";
import { exportAllData, importAllData, downloadJSON } from "@/lib/db/export-import";
import { regenerateFullSchedule } from "@/lib/db/schedule";
import {
  Download,
  Upload,
  RefreshCw,
  Sun,
  Moon,
  Monitor,
  ChevronRight,
  LayoutGrid,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const router = useRouter();
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
    if (
      !confirm(
        "This will clear all scheduled workouts and regenerate. Sessions are kept. Continue?"
      )
    )
      return;

    await regenerateFullSchedule();
    alert("Schedule regenerated!");
  };

  const handleStartDateChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    await updateSettings({ planStartDate: e.target.value });
  };

  const handleAutoFillToggle = async () => {
    if (!settings) return;
    await updateSettings({
      autoFillLastWeights: !settings.autoFillLastWeights,
    });
  };

  const handleUnitToggle = async () => {
    if (!settings) return;
    await updateSettings({
      weightUnit: settings.weightUnit === "lb" ? "kg" : "lb",
    });
  };

  if (!settings) return null;

  return (
    <div className="max-w-lg mx-auto px-4 py-5">
      <h1 className="text-xl font-bold mb-5">Settings</h1>

      <div className="space-y-6">
        {/* Quick Links */}
        <section>
          <h2 className="text-xs font-medium text-[var(--muted-fg)] mb-2 uppercase tracking-wide">
            Quick Links
          </h2>
          <div className="space-y-1">
            <button
              onClick={() => router.push("/program")}
              className="flex items-center justify-between w-full p-3 rounded-lg bg-[var(--card)] border border-[var(--border)] touch-manipulation"
            >
              <div className="flex items-center gap-3">
                <LayoutGrid className="w-4 h-4 text-[var(--accent)]" />
                <div className="text-left">
                  <p className="text-sm font-medium">Program Builder</p>
                  <p className="text-[10px] text-[var(--muted-fg)]">
                    Configure your weekly split
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--muted-fg)]" />
            </button>
            <button
              onClick={() => router.push("/templates")}
              className="flex items-center justify-between w-full p-3 rounded-lg bg-[var(--card)] border border-[var(--border)] touch-manipulation"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-[var(--accent)]" />
                <div className="text-left">
                  <p className="text-sm font-medium">Templates</p>
                  <p className="text-[10px] text-[var(--muted-fg)]">
                    View workout templates
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--muted-fg)]" />
            </button>
          </div>
        </section>

        {/* Theme */}
        <section>
          <h2 className="text-xs font-medium text-[var(--muted-fg)] mb-2 uppercase tracking-wide">
            Appearance
          </h2>
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
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors touch-manipulation border",
                  theme === key
                    ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                    : "bg-[var(--card)] text-[var(--muted-fg)] border-[var(--border)]"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Units */}
        <section>
          <h2 className="text-xs font-medium text-[var(--muted-fg)] mb-2 uppercase tracking-wide">
            Units
          </h2>
          <button
            onClick={handleUnitToggle}
            className="flex items-center justify-between w-full py-2.5 px-3 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm"
          >
            <span>Weight Unit</span>
            <div className="flex bg-[var(--muted)] rounded-md p-0.5">
              <span
                className={cn(
                  "px-3 py-1 rounded text-xs font-medium transition-colors",
                  settings.weightUnit === "lb"
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--muted-fg)]"
                )}
              >
                lb
              </span>
              <span
                className={cn(
                  "px-3 py-1 rounded text-xs font-medium transition-colors",
                  settings.weightUnit === "kg"
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--muted-fg)]"
                )}
              >
                kg
              </span>
            </div>
          </button>
        </section>

        {/* Schedule */}
        <section>
          <h2 className="text-xs font-medium text-[var(--muted-fg)] mb-2 uppercase tracking-wide">
            Schedule
          </h2>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-[var(--muted-fg)] block mb-1">
                Plan Start Date
              </label>
              <input
                type="date"
                value={settings.planStartDate}
                onChange={handleStartDateChange}
                className="w-full h-10 px-3 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>
            <button
              onClick={handleRegenerate}
              className="flex items-center gap-2 w-full py-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm font-medium transition-colors hover:bg-[var(--muted)] touch-manipulation"
            >
              <RefreshCw className="w-4 h-4 ml-3" />
              <span>Regenerate Schedule (12 weeks)</span>
            </button>
          </div>
        </section>

        {/* Logging */}
        <section>
          <h2 className="text-xs font-medium text-[var(--muted-fg)] mb-2 uppercase tracking-wide">
            Logging
          </h2>
          <button
            onClick={handleAutoFillToggle}
            className="flex items-center justify-between w-full py-2.5 px-3 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm"
          >
            <span>Auto-fill last weights</span>
            <div
              className={cn(
                "w-10 h-6 rounded-full transition-colors relative",
                settings.autoFillLastWeights
                  ? "bg-[var(--accent)]"
                  : "bg-[var(--border)]"
              )}
            >
              <div
                className={cn(
                  "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                  settings.autoFillLastWeights
                    ? "translate-x-4.5"
                    : "translate-x-0.5"
                )}
              />
            </div>
          </button>
        </section>

        {/* Data */}
        <section>
          <h2 className="text-xs font-medium text-[var(--muted-fg)] mb-2 uppercase tracking-wide">
            Data
          </h2>
          <div className="space-y-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 w-full py-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm font-medium transition-colors hover:bg-[var(--muted)] touch-manipulation"
            >
              <Download className="w-4 h-4 ml-3" />
              <span>Export All Data (JSON)</span>
            </button>

            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 w-full py-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm font-medium transition-colors hover:bg-[var(--muted)] touch-manipulation"
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
              <p className="text-xs text-[var(--muted-fg)] px-1">
                {importStatus}
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
