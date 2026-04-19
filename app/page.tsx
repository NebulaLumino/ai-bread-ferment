"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

const ACCENT = "bg-pink-500";
const ACCENT_TEXT = "text-pink-400";
const ACCENT_GLOW = "shadow-pink-500/20";

export default function BreadFermentation() {
  const [flourType, setFlourType] = useState("");
  const [preferment, setPreferment] = useState("");
  const [desiredCrumb, setDesiredCrumb] = useState("");
  const [ambientTemp, setAmbientTemp] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flourType || !preferment || !desiredCrumb || !ambientTemp) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flourType, preferment, desiredCrumb, ambientTemp }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      setResult(data.result || "");
    } catch {
      setError("Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col">
      <header className="border-b border-white/10 px-6 py-5 flex items-center gap-3">
        <div className={`w-10 h-10 ${ACCENT} rounded-xl flex items-center justify-center text-xl`}>🍞</div>
        <div>
          <h1 className="text-xl font-bold text-white">AI Bread Fermentation Schedule Planner</h1>
          <p className="text-sm text-gray-400">Autolyse, fold & proof timelines</p>
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Flour Type</label>
            <select value={flourType} onChange={e => setFlourType(e.target.value)}
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 transition-colors">
              <option value="" className="bg-gray-900">Select flour type...</option>
              <option value="all-purpose" className="bg-gray-900">All-Purpose</option>
              <option value="bread flour" className="bg-gray-900">Bread Flour (high gluten)</option>
              <option value="whole wheat" className="bg-gray-900">Whole Wheat</option>
              <option value="spelt" className="bg-gray-900">Spelt</option>
              <option value="rye" className="bg-gray-900">Rye</option>
              <option value="00 tipo" className="bg-gray-900">00 Tipo (pizza flour)</option>
              <option value="einkorn" className="bg-gray-900">Einkorn</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Preferment</label>
            <select value={preferment} onChange={e => setPreferment(e.target.value)}
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 transition-colors">
              <option value="" className="bg-gray-900">Select preferment...</option>
              <option value="none (straight dough)" className="bg-gray-900">None (Straight Dough)</option>
              <option value="poolish" className="bg-gray-900">Poolish</option>
              <option value="biga" className="bg-gray-900">Biga</option>
              <option value="sponge" className="bg-gray-900">Sponge</option>
              <option value="levain" className="bg-gray-900">Levain (sourdough starter)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Desired Crumb</label>
            <select value={desiredCrumb} onChange={e => setDesiredCrumb(e.target.value)}
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 transition-colors">
              <option value="" className="bg-gray-900">Select desired crumb...</option>
              <option value="open and airy" className="bg-gray-900">Open & Airy (high hydration, big holes)</option>
              <option value="tight and fine" className="bg-gray-900">Tight & Fine (sandwich bread)</option>
              <option value="moderate" className="bg-gray-900">Moderate (everyday artisan)</option>
              <option value="dense and hearty" className="bg-gray-900">Dense & Hearty (whole grain)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Ambient Temperature (°F)</label>
            <input type="number" value={ambientTemp} onChange={e => setAmbientTemp(e.target.value)} placeholder="e.g., 72"
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 transition-colors" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${ACCENT} hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${ACCENT_GLOW}`}>
            {loading ? "Generating Schedule..." : "Generate Fermentation Schedule"}
          </button>
        </form>
        <div className="flex flex-col">
          <h2 className={`text-sm font-semibold uppercase tracking-wider ${ACCENT_TEXT} mb-3`}>AI Output</h2>
          <div className="flex-1 bg-gray-800/40 border border-white/10 rounded-xl p-6 overflow-y-auto max-h-[600px]">
            {result ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-gray-500 italic">Your fermentation schedule will appear here...</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
