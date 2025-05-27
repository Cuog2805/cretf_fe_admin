/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: API.UsersDTO } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    canAdmin: currentUser && (currentUser.roleId === 'ADMIN' || currentUser.roleId === 'SUPERADMIN'),
    canSuperAdmin: currentUser && currentUser.roleId === 'SUPERADMIN',
  };
}
