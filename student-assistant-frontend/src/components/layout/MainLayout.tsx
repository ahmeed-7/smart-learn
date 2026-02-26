import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { LayoutDashboard, Calendar, TreePine, Coffee, Settings, LogOut, Menu } from 'lucide-react';
import { authService } from '../../api/authService';
import ChatSupport from './ChatSupport';

const MainLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const { logout, user, updateUser } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
        const fetchProfile = async () => {
            if (!user) {
                try {
                    const profile = await authService.getProfile();
                    updateUser(profile);
                } catch (_error) {
                    // if it fails, the token might be invalid, handled by interceptor
                }
            }
        };
        fetchProfile();
    }, [user, updateUser]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Calendar, label: 'Schedule', path: '/schedule' },
        { icon: TreePine, label: 'Knowledge Tree', path: '/tree' },
        { icon: Coffee, label: 'Weekend Mode', path: '/weekend' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const isWeekend = () => {
        const day = new Date().getDay();
        return day === 0 || day === 6;
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-slate-100">
                        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary-600">
                            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white">SA</div>
                            <span>StudentAssist</span>
                        </Link>
                    </div>

                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname.startsWith(item.path)
                                    ? 'bg-primary-50 text-primary-600 font-semibold'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                                {item.label === 'Weekend Mode' && isWeekend() && (
                                    <span className="ml-auto w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-slate-100">
                        <div className="flex items-center gap-3 px-4 py-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-semibold italic">
                                {user?.name?.[0] || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'Student'}</p>
                                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                        >
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Header (Mobile Only) */}
                <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg">
                        <Menu size={24} />
                    </button>
                    <span className="font-bold text-primary-600">StudentAssist</span>
                    <div className="w-10" />
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
            <ChatSupport />
        </div>
    );
};

export default MainLayout;
