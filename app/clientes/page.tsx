import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import ClientesSection from '@/components/sections/ClientesSection';


export default function ClientesPage() {
    return (
        <div className="min-h-screen bg-black text-white flex">
            <Sidebar />

            <div className="flex-1 pl-64 min-h-screen flex flex-col">
                <main className="flex-grow p-8 md:p-12 max-w-7xl mx-auto w-full">
                    <Header
                        title="Clientes"
                        subtitle="Administra los clientes de Natta Cocinas."
                    />
                    <ClientesSection />
                </main>
            </div>
        </div>
    );
}
