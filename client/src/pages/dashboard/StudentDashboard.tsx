import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  LogOut,
  FolderKanban,
  Database,
  Share2,
  Settings,
  Plus,
  Search,
  Trash2,
  ChevronRight,
  Clock,
  Sparkles,
  LayoutGrid,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import { useProjects } from "../../hooks/queries/useProjects";
import { useDeleteProject } from "../../hooks/mutations/useDeleteProject";
import { CreateProjectModal } from "../../components/projects/CreateProjectModal";
import { useAllDatasets } from "../../hooks/queries/useAllDatasets";

interface UserData {
  emailId: string;
  fullName?: string;
  collegeOrSchool?: string;
  profilePic?: string;
  isPremium: boolean;
}

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: projects = [], isLoading } = useProjects();
  const deleteProject = useDeleteProject();
  const { data: allDatasetsData } = useAllDatasets();

  const loadUserData = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  React.useEffect(() => {
    loadUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  const handleCreateProject = (projectId: number) => {
    setIsCreateModalOpen(false);
    navigate(`/playground/${projectId}`);
  };

  const handleProjectClick = (projectId: number) => {
    navigate(`/playground/${projectId}`);
  };

  const handleDeleteProject = async (
    e: React.MouseEvent,
    projectId: number,
  ) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteProject.mutateAsync(projectId);
    }
  };

  const sharedProjectsCount = projects.filter((p) => p.is_public).length;

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const firstName =
    user?.fullName?.split(" ")[0] || user?.emailId?.split("@")[0] || "there";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm font-medium text-slate-500">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Header ────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-linear-to-r from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
                <FolderKanban className="w-4.5 h-4.5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">Flow ML</h1>
              {user?.isPremium && (
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
                  Premium
                </span>
              )}
            </div>

            {/* Right: User + actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-slate-50 rounded-xl transition-colors"
              >
                {user?.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="Profile"
                    className="h-8 w-8 rounded-xl ring-2 ring-slate-100 object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-xl bg-slate-800 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.emailId?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-slate-900 leading-tight">
                    {user?.fullName || user?.emailId}
                  </p>
                  {user?.collegeOrSchool && (
                    <p className="text-[11px] text-slate-500">
                      {user.collegeOrSchool}
                    </p>
                  )}
                </div>
              </button>

              <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />

              <button
                onClick={() => navigate("/profile")}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </button>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main ──────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative rounded-2xl overflow-hidden mb-8"
        >
          <div className="bg-linear-to-r from-emerald-500 to-emerald-600 px-6 sm:px-8 py-8 sm:py-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzMuMzEzIDAgNiAyLjY4NyA2IDZzLTIuNjg3IDYtNiA2LTYtMi42ODctNi02IDIuNjg3LTYgNi02ek0xOCAzNmMzLjMxMyAwIDYgMi42ODcgNiA2cy0yLjY4NyA2LTYgNi02LTIuNjg3LTYtNiAyLjY4Ny02IDYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <p className="text-emerald-100 text-sm font-medium mb-1">
                  Dashboard
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Welcome back, {firstName}
                </h2>
                <p className="mt-2 text-sm text-emerald-100/80 max-w-lg">
                  Build, train, and visualize machine learning models with an
                  intuitive drag-and-drop pipeline.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-700 text-sm font-semibold rounded-xl hover:bg-emerald-50 transition-colors shrink-0 self-start sm:self-center shadow-sm"
              >
                <Plus className="h-4 w-4" />
                New Project
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {[
            {
              label: "Projects",
              value: projects.length,
              icon: FolderKanban,
              color: "emerald",
            },
            {
              label: "Datasets",
              value: allDatasetsData?.total || 0,
              icon: Database,
              color: "blue",
            },
            {
              label: "Shared",
              value: sharedProjectsCount,
              icon: Share2,
              color: "violet",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    stat.color === "emerald"
                      ? "bg-emerald-50 text-emerald-600"
                      : stat.color === "blue"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-violet-50 text-violet-600"
                  }`}
                >
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                <LayoutGrid className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  My Projects
                </h2>
                <p className="text-xs text-slate-500">
                  {filteredProjects.length}{" "}
                  {filteredProjects.length === 1 ? "project" : "projects"}
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors"
              />
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm py-16 text-center">
              <div className="w-16 h-16 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                <FolderKanban className="h-7 w-7 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                No projects yet
              </h3>
              <p className="mt-1.5 text-sm text-slate-500 max-w-sm mx-auto">
                Get started by creating your first ML project and bring your
                ideas to life.
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-colors shadow-sm"
              >
                <Sparkles className="h-4 w-4" />
                Create Your First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    delay: Math.min(index * 0.04, 0.5),
                  }}
                  onClick={() => handleProjectClick(project.id)}
                  className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer overflow-hidden"
                >
                  {/* Color bar */}
                  <div className="h-1 bg-linear-to-r from-emerald-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                        <FolderKanban className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        {project.is_public && (
                          <span className="px-2 py-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
                            Public
                          </span>
                        )}
                        <button
                          onClick={(e) => handleDeleteProject(e, project.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete project"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 truncate mb-1">
                      {project.name}
                    </h3>
                    <p className="text-xs text-slate-500 truncate mb-4">
                      {project.description || "No description"}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* New project card */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.2,
                  delay: Math.min(filteredProjects.length * 0.04, 0.5),
                }}
                onClick={() => setIsCreateModalOpen(true)}
                className="group bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all cursor-pointer flex flex-col items-center justify-center p-8 min-h-[180px]"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center mb-3 transition-colors">
                  <Plus className="w-6 h-6 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </div>
                <p className="text-sm font-semibold text-slate-500 group-hover:text-emerald-700 transition-colors">
                  New Project
                </p>
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Create Project Modal */}
        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateProject}
        />
      </main>
    </div>
  );
};

export default StudentDashboard;
