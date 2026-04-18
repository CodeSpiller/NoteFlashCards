import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'noteflashcards:settings:v1';

export const TIMER_MIN = 1.0; // seconds
export const TIMER_MAX = 10.0;
export const TIMER_STEP = 0.1;
export const TIMER_DEFAULT = 3.0;

export const NOTE_NAMING_OPTIONS = ['letters', 'solfege'];
export const NOTE_NAMING_DEFAULT = 'letters';

const DEFAULTS = {
	timerSeconds: TIMER_DEFAULT,
	noteNaming: NOTE_NAMING_DEFAULT
};

function clampTimer(n) {
	const v = Number(n);
	if (Number.isNaN(v)) return TIMER_DEFAULT;
	// snap to 0.1 and clamp to [min, max]
	const snapped = Math.round(v * 10) / 10;
	return Math.min(TIMER_MAX, Math.max(TIMER_MIN, snapped));
}

function clampNoteNaming(v) {
	return NOTE_NAMING_OPTIONS.includes(v) ? v : NOTE_NAMING_DEFAULT;
}

function normalize(raw) {
	const out = { ...DEFAULTS };
	if (raw && typeof raw === 'object') {
		if ('timerSeconds' in raw) out.timerSeconds = clampTimer(raw.timerSeconds);
		if ('noteNaming' in raw) out.noteNaming = clampNoteNaming(raw.noteNaming);
	}
	return out;
}

function load() {
	if (!browser) return { ...DEFAULTS };
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return { ...DEFAULTS };
		return normalize(JSON.parse(raw));
	} catch {
		return { ...DEFAULTS };
	}
}

function save(value) {
	if (!browser) return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
	} catch {
		// ignore quota/privacy errors
	}
}

function createSettings() {
	const store = writable(load());
	const { subscribe, update, set } = store;

	return {
		subscribe,
		setTimerSeconds(s) {
			update((v) => {
				const next = { ...v, timerSeconds: clampTimer(s) };
				save(next);
				return next;
			});
		},
		adjustTimer(deltaSeconds) {
			update((v) => {
				const next = { ...v, timerSeconds: clampTimer(v.timerSeconds + deltaSeconds) };
				save(next);
				return next;
			});
		},
		setNoteNaming(naming) {
			update((v) => {
				const next = { ...v, noteNaming: clampNoteNaming(naming) };
				save(next);
				return next;
			});
		},
		reset() {
			const next = { ...DEFAULTS };
			save(next);
			set(next);
		}
	};
}

export const settings = createSettings();
