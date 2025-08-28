import React, { useState, ChangeEvent, FormEvent } from "react";
import emailjs from "emailjs-com";

type FormState = {
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({
    nome: "",
    email: "",
    telefone: "",
    mensagem:
      "Olá AutoGo.pt, gostaria de saber mais sobre os vossos serviços. Obrigado!",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await emailjs.send(
        "service_ngduxdg",
        "template_3cb4rfl",
        form,
        "VzMmXG4l4EqvuhAIl"
      );
      setSuccess(true);
      setForm({ nome: "", email: "", telefone: "", mensagem: "" });
    } catch (err) {
      console.error(err); // usa 'err' -> some o aviso do ESLint
      setError("Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex-1 bg-gray-50 rounded-xl p-6 shadow flex flex-col gap-4"
      aria-label="Formulário de contacto"
      noValidate
    >
      <label className="font-semibold" htmlFor="nome">
        Nome
        <input
          id="nome"
          name="nome"
          type="text"
          required
          className="mt-1 block w-full rounded border px-3 py-2"
          value={form.nome}
          onChange={handleChange}
          aria-required="true"
          placeholder="O seu nome"
          autoComplete="name"
        />
      </label>

      <label className="font-semibold" htmlFor="email">
        Email
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 block w-full rounded border px-3 py-2"
          value={form.email}
          onChange={handleChange}
          aria-required="true"
          placeholder="O seu email"
          autoComplete="email"
          inputMode="email"
        />
      </label>

      <label className="font-semibold" htmlFor="telefone">
        Telemóvel
        <input
          id="telefone"
          name="telefone"
          type="tel"
          required
          className="mt-1 block w-full rounded border px-3 py-2"
          value={form.telefone}
          onChange={handleChange}
          aria-required="true"
          placeholder="O seu telemóvel"
          autoComplete="tel"
          inputMode="tel"
        />
      </label>

      <label className="font-semibold" htmlFor="mensagem">
        Mensagem
        <textarea
          id="mensagem"
          name="mensagem"
          required
          rows={4}
          className="mt-1 block w-full rounded border px-3 py-2"
          value={form.mensagem}
          onChange={handleChange}
          aria-required="true"
          placeholder="A sua mensagem"
        />
      </label>

      <button
        type="submit"
        className="bg-[#b42121] text-white rounded-lg px-4 py-2 mt-2 font-semibold hover:bg-[#a11a1a] transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={loading}
        aria-label={loading ? "A enviar..." : "Enviar Mensagem"}
      >
        {loading && (
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        )}
        {loading ? "A enviar..." : "Enviar Mensagem"}
      </button>

      {success && (
        <div className="text-green-600 font-medium mt-2" role="status">
          Mensagem enviada com sucesso!
        </div>
      )}

      {!!error && (
        <div className="text-red-600 font-medium mt-2" role="alert">
          {error}
        </div>
      )}
    </form>
  );
}
