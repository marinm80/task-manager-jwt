import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import MetricCard from '../components/dashboard/MetricCard';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectForm from '../components/projects/ProjectForm';
import ProjectTaskForm from '../components/projects/ProjectTaskForm';
import ProjectTaskTable from '../components/projects/ProjectTaskTable';
import RoleBadge from '../components/projects/RoleBadge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { useToast } from '../components/ui/ToastProvider';
import projectService from '../services/projectService';

const STATUS_LABEL = {
  PLANNING: 'Planificación',
  ACTIVE: 'Activo',
  ON_HOLD: 'En pausa',
  COMPLETED: 'Completado',
};

export default function ProjectsPage() {
  const { showToast } = useToast();
  const [organizations, setOrganizations] = useState([]);
  const [organizationId, setOrganizationId] = useState('');
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    projectService.getOrganizations()
      .then(({ data }) => {
        setOrganizations(data);
        if (data[0]) setOrganizationId(String(data[0].id));
      })
      .catch(() => setError('No pudimos cargar tus organizaciones.'))
      .finally(() => setLoading(false));
  }, []);

  const loadProjects = (orgId, selectId) => {
    setLoading(true);
    return projectService.getProjects(orgId)
      .then(({ data }) => {
        setProjects(data);
        setProjectId(selectId ?? (data[0] ? String(data[0].id) : ''));
      })
      .catch(() => setError('No pudimos cargar los proyectos.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!organizationId) return;
    loadProjects(organizationId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId]);

  const loadProjectDetail = (id) => {
    setLoading(true);
    return Promise.all([projectService.getProject(id), projectService.getProjectTasks(id)])
      .then(([projectResponse, tasksResponse]) => {
        setProject(projectResponse.data);
        setTasks(tasksResponse.data);
      })
      .catch(() => setError('No pudimos cargar el espacio del proyecto.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!projectId) {
      setProject(null);
      setTasks([]);
      return;
    }
    loadProjectDetail(projectId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleCreateProject = async (data) => {
    try {
      const { data: created } = await projectService.createProject(organizationId, data);
      showToast('success', `Proyecto "${created.name}" creado.`);
      await loadProjects(organizationId, String(created.id));
    } catch (err) {
      showToast('error', err.response?.data?.message ?? 'No pudimos crear el proyecto.');
    }
  };

  const handleCreateTask = async (data) => {
    try {
      await projectService.createProjectTask(projectId, data);
      showToast('success', 'Tarea agregada al proyecto.');
      await loadProjectDetail(projectId);
    } catch (err) {
      showToast('error', err.response?.data?.message ?? 'No pudimos crear la tarea.');
    }
  };

  const handleAdvanceStatus = async (task, nextStatus) => {
    try {
      await projectService.updateProjectTask(projectId, task.id, { status: nextStatus });
      setTasks((current) => current.map((item) => (item.id === task.id ? { ...item, status: nextStatus } : item)));
    } catch (err) {
      showToast('error', err.response?.data?.message ?? 'No pudimos actualizar la tarea.');
    }
  };

  const activeOrganization = organizations.find((organization) => String(organization.id) === organizationId);
  const stats = useMemo(() => ({
    active: projects.filter((item) => item.status === 'ACTIVE').length,
    completed: projects.filter((item) => item.status === 'COMPLETED').length,
    tasks: projects.reduce((sum, item) => sum + (item._count?.tasks ?? 0), 0),
  }), [projects]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-eyebrow text-green">Espacios de trabajo</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-card-title text-ink">Proyectos de {activeOrganization?.name ?? 'Taskly'}</h1>
              <RoleBadge role={activeOrganization?.effectiveRole} />
            </div>
            <p className="mt-1 text-sm text-muted">Equipos, responsables y entregables en un solo lugar.</p>
          </div>
          <div className="flex items-end gap-3">
            <label className="flex min-w-64 flex-col gap-1 text-xs font-semibold text-muted">
              Organización
              <select
                aria-label="Organización"
                value={organizationId}
                onChange={(event) => setOrganizationId(event.target.value)}
                className="rounded-btn border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-green"
              >
                {organizations.map((organization) => (
                  <option key={organization.id} value={organization.id}>{organization.name}</option>
                ))}
              </select>
            </label>
            <Button variant="primary" size="md" onClick={() => setShowProjectForm(true)} disabled={!organizationId}>
              + Nuevo proyecto
            </Button>
          </div>
        </div>

        {error && <div role="alert" className="rounded-card border border-coral/30 bg-coral/10 p-4 text-sm text-coral-dark">{error}</div>}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Proyectos" value={projects.length} tone="neutral" />
          <MetricCard label="Activos" value={stats.active} tone="green" />
          <MetricCard label="Completados" value={stats.completed} tone="purple" />
          <MetricCard label="Tareas del espacio" value={stats.tasks} tone="amber" />
        </div>

        {loading && !project ? (
          <p className="py-20 text-center text-sm text-muted">Cargando espacio de trabajo…</p>
        ) : projects.length === 0 ? (
          <EmptyState
            title="Todavía no hay proyectos"
            description="Crea tu primer proyecto para agrupar tareas y dar seguimiento a su avance."
            actionLabel="Crear mi primer proyecto"
            onAction={() => setShowProjectForm(true)}
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
            <aside className="space-y-3" aria-label="Lista de proyectos">
              {projects.map((item) => (
                <ProjectCard key={item.id} project={item} selected={String(item.id) === projectId} onSelect={(id) => setProjectId(String(id))} />
              ))}
            </aside>

            {project && (
              <section className="min-w-0 space-y-5">
                <div className="rounded-card border border-line bg-surface p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-green">{project.key}</span>
                        <span className="rounded-full bg-mint px-2 py-1 text-[11px] font-bold text-green">{STATUS_LABEL[project.status]}</span>
                      </div>
                      <h2 className="mt-3 text-xl font-bold text-ink">{project.name}</h2>
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{project.description}</p>
                    </div>
                    <RoleBadge role={project.permissions?.manageProject ? 'LEAD' : 'VIEWER'} />
                  </div>

                  <div className="mt-5 border-t border-line pt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted">Equipo ({project.members.length})</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.members.map((member) => (
                        <div key={member.userId} className="flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-2">
                          <span className="grid h-7 w-7 place-items-center rounded-full bg-mint text-[10px] font-bold text-green">
                            {member.user.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                          </span>
                          <span className="text-xs font-medium text-ink">{member.user.name}</span>
                          <RoleBadge role={member.role} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-eyebrow text-green">Trabajo del proyecto</p>
                      <h2 className="mt-1 text-card-title text-ink">Tareas asignadas ({tasks.length})</h2>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => setShowTaskForm(true)}>
                      + Agregar tarea
                    </Button>
                  </div>
                  {tasks.length === 0 ? (
                    <EmptyState
                      title="Sin tareas todavía"
                      description="Agrega la primera tarea de este proyecto."
                      actionLabel="Agregar tarea"
                      onAction={() => setShowTaskForm(true)}
                    />
                  ) : (
                    <ProjectTaskTable tasks={tasks} onAdvanceStatus={handleAdvanceStatus} />
                  )}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {showProjectForm && (
        <ProjectForm onClose={() => setShowProjectForm(false)} onSubmit={handleCreateProject} />
      )}
      {showTaskForm && (
        <ProjectTaskForm onClose={() => setShowTaskForm(false)} onSubmit={handleCreateTask} />
      )}
    </DashboardLayout>
  );
}

