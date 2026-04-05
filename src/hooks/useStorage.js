const useStorage = () => {
  const get = (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  };

  const set = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  };

  const remove = (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  };

  return { get, set, remove };
};

export default useStorage;
