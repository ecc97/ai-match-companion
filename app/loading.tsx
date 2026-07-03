export default function Loading() {
    return (
        <main className="flex flex-col min-h-screen bg-teamMatchMain text-white px-4 py-8 pt-24">
            <div className="max-w-md mx-auto space-y-4 animate-pulse">
                <div className="flex items-center justify-center gap-4">
                    <div className="w-10 h-10 bg-neutral-800 rounded-full" />
                    <div className="w-6 h-3 bg-neutral-800 rounded" />
                    <div className="w-10 h-10 bg-neutral-800 rounded-full" />
                </div>
                <div className="h-14 bg-neutral-900 rounded-2xl" />
                <div className="h-20 bg-neutral-900 rounded-xl" />
                <div className="h-20 bg-neutral-900 rounded-xl" />
                <div className="h-24 bg-neutral-900 rounded-xl" />
            </div>
        </main>
    );
}