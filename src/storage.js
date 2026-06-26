// Drop-in replacement for Claude's window.storage API, backed by the browser's
// localStorage. Same method shapes (get/set), so the rest of the app code
// doesn't need to change. NOTE: localStorage is per-browser/per-device only —
// it does NOT sync between different people's phones or computers.

const NS = "lily-inv:";

function read(key) {
  try {
    const raw = localStorage.getItem(NS + key);
    if (raw === null) return null;
    return { key, value: raw, shared: false };
  } catch (e) {
    return null;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(NS + key, value);
    return { key, value, shared: false };
  } catch (e) {
    return null;
  }
}

export const localStore = {
  async get(key) {
    return read(key);
  },
  async set(key, value) {
    return write(key, value);
  },
  async delete(key) {
    try {
      localStorage.removeItem(NS + key);
      return { key, deleted: true };
    } catch (e) {
      return null;
    }
  },
};
