import React, { useState } from 'react';
import emailjs from 'emailjs-com';

export default function ContactForm() {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', mensagem: 'Olá AutoGo.pt, gostaria de saber mais sobre os vossos serviços. Obrigado!' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess(false);
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CONTACT || '',
        form,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
      );
      setSuccess(true);
      setForm({ nome: '', email: '', telefone: '', mensagem: '' });
    } catch (err) {
      setError('Erro ao enviar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex-1 bg-gray-50 rounded-xl p-6 shadow flex flex-col gap-4"
      aria-label="Formulário de contacto"
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
        aria-label={loading ? 'A enviar...' : 'Enviar Mensagem'}
      >
        {loading && (
          <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        )}
        {loading ? 'A enviar...' : 'Enviar Mensagem'}
      </button>
      {success && (
        <div className="text-green-600 font-medium mt-2" role="status">
          Mensagem enviada com sucesso!
        </div>
      )}
      {error && (
        <div className="text-red-600 font-medium mt-2" role="alert">
          {error}
        </div>
      )}
    </form>
  );
}
