import { useAuth } from "../../context/AuthContext";
import { Navbar } from "../../components/Navbar";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold text-[#0B1F3A]">
          Hola, {user?.name || user?.nombre || "administrador"} 👋
        </h1>

        <p className="mt-2 text-slate-500">
          Gestioná los usuarios y servicios de UrbanFix.
        </p>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <span className="text-5xl">⚙️</span>

          <h2 className="mt-4 text-lg font-bold text-[#0B1F3A]">
            Panel de administración
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Próximamente podrás consultar usuarios, solicitudes y estadísticas
            de la plataforma.
          </p>
        </section>
      </main>
    </div>
  );
}