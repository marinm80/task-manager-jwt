const ROLE_STYLES = {
  ADMIN: 'bg-purple/15 text-purple',
  OWNER: 'bg-purple/15 text-purple',
  MANAGER: 'bg-amber/20 text-amber-dark',
  MEMBER: 'bg-line/60 text-ink',
  LEAD: 'bg-mint text-green',
  CONTRIBUTOR: 'bg-line/60 text-ink',
  VIEWER: 'bg-line/40 text-muted',
};

const ROLE_LABELS = {
  ADMIN: 'Admin',
  OWNER: 'Owner',
  MANAGER: 'Manager',
  MEMBER: 'Miembro',
  LEAD: 'Lead',
  CONTRIBUTOR: 'Contributor',
  VIEWER: 'Viewer',
};

export default function RoleBadge({ role }) {
  if (!role) return null;
  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-[11px] font-bold ${ROLE_STYLES[role] ?? ROLE_STYLES.MEMBER}`}>
      {ROLE_LABELS[role] ?? role}
    </span>
  );
}

