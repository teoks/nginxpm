import "@testing-library/jest-dom/vitest";

if (typeof window !== "undefined") {
	try {
		if (!window.localStorage || typeof window.localStorage.getItem !== "function") {
			const storage = new Map();
			Object.defineProperty(window, "localStorage", {
				value: {
					getItem: (key) => storage.get(key) ?? null,
					setItem: (key, val) => storage.set(key, String(val)),
					removeItem: (key) => storage.delete(key),
					clear: () => storage.clear(),
				},
				configurable: true,
				writable: true,
			});
		}
	} catch {
		// Ignore if window is immutable
	}
}

