import { useEffect, useState } from "react";
import adminApi from "../../services/adminApi";
import { Users, UserCheck, Package, Image as ImageIcon } from "lucide-react"; // Standard for clean UIs

function StatCard({ title, value, icon: Icon, colorClass }) {
	return (
		<div className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-slate-500 font-medium text-sm mb-1">{title}</p>
					<h3 className="text-3xl font-bold text-slate-900 tracking-tight">
						{value?.toLocaleString() || 0}
					</h3>
				</div>
				<div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 group-hover:scale-110 transition-transform`}>
					<Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
				</div>
			</div>
		</div>
	);
}

function AdminDashboard() {
	const [summary, setSummary] = useState(null);

	useEffect(() => {
		const loadSummary = async () => {
			try {
				const res = await adminApi.get("/api/admin/dashboard/summary");
				setSummary(res.data);
			} catch (error) {
				console.error("Failed to fetch dashboard data", error);
			}
		};
		loadSummary();
	}, []);

	if (!summary) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-pulse text-slate-400 font-medium">Loading metrics...</div>
			</div>
		);
	}

	return (
		<div className="max-w-4xl animate-in fade-in duration-500">
			<header className="mb-8">
				<h1 className="text-3xl font-extrabold text-slate-900">Dashboard Overview</h1>
				<p className="text-slate-500 mt-1">Real-time platform performance at a glance.</p>
			</header>

			{/* Stacked Layout: One card per row as requested */}
			<div className="flex flex-col gap-5">
				<StatCard 
					title="Total Users" 
					value={summary.totalUsers} 
					icon={Users} 
					colorClass="bg-blue-600" 
				/>
				<StatCard 
					title="Active Users" 
					value={summary.activeUsers} 
					icon={UserCheck} 
					colorClass="bg-emerald-600" 
				/>
				<StatCard 
					title="Total Products" 
					value={summary.totalProducts} 
					icon={Package} 
					colorClass="bg-violet-600" 
				/>
				<StatCard 
					title="Total Banners" 
					value={summary.totalBanners} 
					icon={ImageIcon} 
					colorClass="bg-amber-600" 
				/>
			</div>
		</div>
	);
}

export default AdminDashboard;