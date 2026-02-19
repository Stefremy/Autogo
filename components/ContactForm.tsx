import React, { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "Olá AutoGo.pt, gostaria de saber mais sobre os vossos serviços. Obrigado!",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const emailjs = (await import("emailjs-com")).default;
      await emailjs.send("service_ngduxdg", "template_3cb4rfl", form, "VzMmXG4l4EqvuhAIl");
      setSuccess(true);
      setForm({ nome: "", email: "", telefone: "", mensagem: "" });
    } catch {
      setError("Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#b42121]/40 focus:border-[#b42121] bg-white";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" aria-label="Formulário de contacto">

      <div>
        <label htmlFor="nome" className={labelClass}>Nome</label>
        <input
          id="nome" name="nome" type="text" required
          className={inputClass}
          value={form.nome} onChange={handleChange}
          placeholder="O seu nome" autoComplete="name"
        />
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>Email</label>
        <input
          id="email" name="email" type="email" required
          className={inputClass}
          value={form.email} onChange={handleChange}
          placeholder="O seu email" autoComplete="email"
        />
      </div>

      <div>
        <label htmlFor="telefone" className={labelClass}>Telemóvel</label>
        <input
          id="telefone" name="telefone" type="tel" required
          className={inputClass}
          value={form.telefone} onChange={handleChange}
          placeholder="O seu telemóvel" autoComplete="tel"
        />
      </div>

      <div>
        <label htmlFor="mensagem" className={labelClass}>Mensagem</label>
        <textarea
          id="mensagem" name="mensagem" required rows={5}
          className={inputClass}
          value={form.mensagem} onChange={handleChange}
          placeholder="A sua mensagem"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm flex items-center gap-2" role="status">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Mensagem enviada com sucesso! Entraremos em contacto brevemente.
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#b42121] hover:bg-[#9a1c1c] text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        aria-label={loading ? "A enviar..." : "Enviar Mensagem"}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        )}
        {loading ? "A enviar..." : "Enviar Mensagem"}
      </button>

    </form>
  );
}
