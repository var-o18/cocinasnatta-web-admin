import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import ProveedoresSection from '@/components/sections/ProveedoresSection';

export default function ProveedorPage() {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />

      <div className="flex-1 min-w-0 pl-64 min-h-screen flex flex-col">
        <main className="grow p-8 md:p-12 max-w-7xl mx-auto w-full min-w-0">
          <Header
            title="Proveedores"
            subtitle="Administra los proveedores de Natta Cocinas."
          />
          <ProveedoresSection />
        </main>
      </div>
    </div>
  );
}
