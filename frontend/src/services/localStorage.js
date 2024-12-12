const PROJECT_KEY = 'video-streams:';

export const store = {
  set: (key, value) => {
    localStorage.setItem(PROJECT_KEY + key, JSON.stringify(value));
  },
  get: key => {
    const value = localStorage.getItem(PROJECT_KEY + key);
    return value ? JSON.parse(value) : null;
  },
};
