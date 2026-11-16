import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#07090e] text-slate-100 px-4 text-center">
      <h2 className="text-3xl font-extrabold text-white">404 - Page Not Found</h2>
      <p className="text-sm text-slate-400 mt-2">The wellness module or link you requested does not exist.</p>
      <Link
        href="/"
        className="mt-6 px-4 py-2 rounded-xl text-xs font-bold text-[#07090e] bg-[#00F5D4] hover:bg-[#00F5D4]/90 transition-all"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}