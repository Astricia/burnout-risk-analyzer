import './globals.css';
import Link from 'next/link';

export default function RootLayout({
children,
}: {
children: React.ReactNode;
}) {
return (
<html lang="en">
<body className="bg-slate-50 min-h-screen text-slate-800 font-sans">
<nav className="bg-white shadow-sm p-4 mb-8">
<div className="max-w-4xl mx-auto flex gap-6 font-semibold">
<Link href="/" className="hover:text-blue-600 transition-colors">Dashboard</Link>
<Link href="/log-work" className="hover:text-blue-600 transition-colors">Log Work</Link>
<Link href="/log-stress" className="hover:text-blue-600 transition-colors">Log Stress</Link>
<Link href="/insights" className="hover:text-blue-600 transition-colors">Insights</Link>
</div>
</nav>
<main className="max-w-4xl mx-auto p-4">
{children}
</main>
</body>
</html>
);
}