import Link from "next/link";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav style={{ 
        background: "#1a237e", 
        padding: "1rem", 
        display: "flex", 
        justifyContent: "center",
        gap: "2rem"
      }}>
        <Link href="/" style={{ color: "#fff", fontWeight: "bold" }}>Início</Link>
        <Link href="/viaturas" style={{ color: "#fff" }}>Viaturas</Link>
        <Link href="/simulador" style={{ color: "#fff" }}>Simulador ISV</Link>
        <Link href="/como-funciona" style={{ color: "#fff" }}>Como Funciona</Link>
        <Link href="/pedido" style={{ color: "#fff" }}>Pedido</Link>
        <Link href="/blog" style={{ color: "#fff" }}>Blog</Link>
        <Link href="/contacto" style={{ color: "#fff" }}>Contacto</Link>
      </nav>
      <main>{children}</main>
    </div>
  );
}