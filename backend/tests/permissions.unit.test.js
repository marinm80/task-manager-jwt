jest.mock('../src/config/db', () => ({ project: { findUnique: jest.fn() } }));

const {
  resolveCapabilities,
  canManageOrganizationRole,
  canModifyTask,
} = require('../src/services/permissionService');

describe('project permission matrix', () => {
  it.each([
    ['ADMIN', null, null, true, true, true],
    ['USER', 'OWNER', null, true, true, true],
    ['USER', 'MANAGER', null, true, true, true],
    ['USER', 'MEMBER', 'LEAD', true, true, true],
    ['USER', 'MEMBER', 'CONTRIBUTOR', true, true, false],
    ['USER', 'MEMBER', 'VIEWER', true, false, false],
    ['USER', 'MEMBER', null, false, false, false],
  ])(
    '%s/%s/%s resolves read=%s create=%s manageAny=%s',
    (platformRole, organizationRole, projectRole, read, create, manageAny) => {
      const capabilities = resolveCapabilities({ platformRole, organizationRole, projectRole });
      expect(capabilities.readProject).toBe(read);
      expect(capabilities.createTasks).toBe(create);
      expect(capabilities.manageAnyTask).toBe(manageAny);
    },
  );

  it('allows contributors to edit assigned or authored tasks only', () => {
    const capabilities = resolveCapabilities({
      platformRole: 'USER',
      organizationRole: 'MEMBER',
      projectRole: 'CONTRIBUTOR',
    });
    expect(canModifyTask({ capabilities, userId: 7, task: { userId: 7, createdById: 3 } })).toBe(true);
    expect(canModifyTask({ capabilities, userId: 7, task: { userId: 3, createdById: 7 } })).toBe(true);
    expect(canModifyTask({ capabilities, userId: 7, task: { userId: 3, createdById: 4 } })).toBe(false);
  });

  it('prevents managers from changing owners', () => {
    expect(canManageOrganizationRole({ actorRole: 'MANAGER', targetRole: 'OWNER', nextRole: 'MEMBER' })).toBe(false);
    expect(canManageOrganizationRole({ actorRole: 'MANAGER', targetRole: 'MEMBER', nextRole: 'OWNER' })).toBe(false);
    expect(canManageOrganizationRole({ actorRole: 'MANAGER', targetRole: 'MEMBER', nextRole: 'MEMBER' })).toBe(true);
  });
});

