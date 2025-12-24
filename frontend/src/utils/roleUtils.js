// Role-based helper functions
export const getRoleIcon = (role) => {
  if (!role) return 'fas fa-user-circle';
  switch (role.toLowerCase()) {
    case 'admin': return 'fas fa-crown';
    case 'user': return 'fas fa-user';
    default: return 'fas fa-user-circle';
  }
};

export const getRoleColor = (role) => {
  if (!role) return '#667eea';
  switch (role.toLowerCase()) {
    case 'admin': return '#ff6b6b';
    case 'user': return '#4ecdc4';
    default: return '#667eea';
  }
};
