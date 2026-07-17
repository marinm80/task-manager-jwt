const prisma = require('../config/db');

const ORGANIZATION_RANK = { MEMBER: 1, MANAGER: 2, OWNER: 3 };
const PROJECT_RANK = { VIEWER: 1, CONTRIBUTOR: 2, LEAD: 3 };

const hasMinimumRole = (rank, actualRole, requiredRole) =>
  Boolean(actualRole && rank[actualRole] >= rank[requiredRole]);

const resolveCapabilities = ({ platformRole, organizationRole, projectRole }) => {
  const isAdmin = platformRole === 'ADMIN';
  const isOrganizationManager = hasMinimumRole(ORGANIZATION_RANK, organizationRole, 'MANAGER');
  const isProjectLead = projectRole === 'LEAD';
  const isContributor = projectRole === 'CONTRIBUTOR';
  const hasProjectAccess = Boolean(projectRole || isOrganizationManager || isAdmin);

  return {
    readProject: hasProjectAccess,
    manageProject: isAdmin || isOrganizationManager || isProjectLead,
    manageProjectMembers: isAdmin || isOrganizationManager || isProjectLead,
    readTasks: hasProjectAccess,
    createTasks: isAdmin || isOrganizationManager || isProjectLead || isContributor,
    manageAnyTask: isAdmin || isOrganizationManager || isProjectLead,
    manageOwnTask: isAdmin || isOrganizationManager || isProjectLead || isContributor,
  };
};

const canManageOrganizationRole = ({ platformRole, actorRole, targetRole, nextRole }) => {
  if (platformRole === 'ADMIN') return true;
  if (actorRole === 'OWNER') return true;
  if (actorRole !== 'MANAGER') return false;
  return targetRole !== 'OWNER' && nextRole !== 'OWNER';
};

const getProjectContext = async (user, projectId) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      organization: {
        include: { members: { where: { userId: user.id }, select: { role: true } } },
      },
      members: { where: { userId: user.id }, select: { role: true } },
    },
  });

  if (!project) return null;
  const organizationRole = project.organization.members[0]?.role ?? null;
  const projectRole = project.members[0]?.role ?? null;

  return {
    project,
    organizationRole,
    projectRole,
    capabilities: resolveCapabilities({
      platformRole: user.role,
      organizationRole,
      projectRole,
    }),
  };
};

const canModifyTask = ({ capabilities, userId, task }) =>
  capabilities.manageAnyTask ||
  (capabilities.manageOwnTask && (task.userId === userId || task.createdById === userId));

module.exports = {
  ORGANIZATION_RANK,
  PROJECT_RANK,
  hasMinimumRole,
  resolveCapabilities,
  canManageOrganizationRole,
  getProjectContext,
  canModifyTask,
};

