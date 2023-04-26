export const useUserStore = () => {
  const user = useState<null | Record<string, any>>('user');
  const updateUserFn = (_user: Record<string, any>) => {
    user.value = _user;
  };
  onNuxtReady(() => {
    let _user = localStorage.getItem('user');
    if (_user) {
      user.value = JSON.parse(_user);
    }
  });
  return {
    user,
    updateUserFn,
  };
};
