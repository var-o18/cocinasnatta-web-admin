import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import AgendaSection from '@/components/sections/AgendaSection';


export default function AgendaPage() {
    return (
        <div className="min-h-screen bg-black text-white flex">
            <Sidebar />

            <div className="flex-1 pl-64 min-h-screen flex flex-col">
                <main className="flex-grow p-8 md:p-12 max-w-7xl mx-auto w-full">
                    <Header
                        title="Agenda"
                        subtitle="Gestiona las citas y eventos de Natta Cocinas."
                    />
                    <AgendaSection />
                </main>
            </div>
        </div>
    );
}
