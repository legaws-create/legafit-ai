"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const supabase = createClient();

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      setLoading(false);
      return;
    }

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Akun berhasil dibuat! Silakan masuk.");
        setMode("login");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("Email atau password salah.");
      } else {
        router.push("/");
        router.refresh();
      }
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="mb-8 text-center animate-fade-up">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-lime/15">
          <span className="font-display text-2xl font-black text-lime">L</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold text-chalk">Legafit AI</h1>
        <p className="mt-1 text-sm text-chalk-faint">
          {mode === "login" ? "Masuk ke akunmu" : "Buat akun baru"}
        </p>
      </div>

      {/* Form */}
      <div className="card w-full max-w-sm space-y-4 p-6 animate-fade-up">
        {mode === "signup" && (
          <div>
            <label className="label mb-1 block">Nama lengkap</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama kamu"
              className="input"
            />
          </div>
        )}

        <div>
          <label className="label mb-1 block">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="email@contoh.com"
            className="input"
          />
        </div>

        <div>
          <label className="label mb-1 block">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Minimal 6 karakter"
            className="input"
          />
        </div>

        {error && (
          <div className="rounded-2xl bg-ember/15 px-4 py-3 text-sm text-ember">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-2xl bg-lime/15 px-4 py-3 text-sm text-lime">
            {success}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? "Memproses..." : mode === "login" ? "Masuk" : "Daftar"}
        </button>

        <div className="text-center text-sm text-chalk-faint">
          {mode === "login" ? (
            <>
              Belum punya akun?{" "}
              <button
                onClick={() => { setMode("signup"); setError(null); }}
                className="text-lime hover:underline"
              >
                Daftar sekarang
              </button>
            </>
          ) : (
            <>
              Sudah punya akun?{" "}
              <button
                onClick={() => { setMode("login"); setError(null); }}
                className="text-lime hover:underline"
              >
                Masuk
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
