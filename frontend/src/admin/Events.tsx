import Sidebar from '../components/Sidebar';

export default function Events() {
  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      <Sidebar />
      <main className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif text-primary mb-4">Events & Scheduling</h1>
          <div className="inline-block px-4 py-2 bg-surface-container-low rounded-full">
            <p className="text-on-surface-variant font-sans tracking-wider uppercase text-[10px] font-bold">
              Canvas Kosong - Fitur Sedang Dikembangkan
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
