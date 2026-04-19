import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'noteflashcards:settings:v1';

export const TIMER_MIN = 1.0; // seconds
export const TIMER_MAX = 10.0;
export const TIMER_STEP = 0.1;
export const TIMER_DEFAULT = 3.0;

// How long the "answer reveal" / feedback pause lasts between rounds.
export const FEEDBACK_MIN = 0.2;
export const FEEDBACK_MAX = 3.0;
export const FEEDBACK_STEP = 0.1;
export const FEEDBACK_DEFAULT = 0.7;

export const NOTE_NAMING_OPTIONS = ['letters', 'solfege'];
export const NOTE_NAMING_DEFAULT = 'letters';

// `buttons` = tap one of two choices. `reveal` = no buttons; the answer
// is simply shown in white when the timer runs out.
export const ANSWER_MODE_OPTIONS = ['buttons', 'reveal'];
export const ANSWER_MODE_DEFAULT = 'buttons';

const DEFAULTS = {
	timerSeconds: TIMER_DEFAULT,
	feedbackSeconds: FEEDBACK_DEFAULT,
	noteNaming: NOTE_NAMING_DEFAULT,
	answerMode: ANSWER_MODE_DEFAULT
};

function clampStep(n, min, max, fallback) {
	const v = Number(n);
	if (Number.isNaN(v)) return fallback;
	const snapped = Math.round(v * 10) / 10;
	return Math.min(max, Math.max(min, snapped));
}

function clampTimer(n) {
	return clampStep(n, TIMER_MIN, TIMER_MAX, TIMER_DEFAULT);
}

function clampFeedback(n) {
	return clampStep(n, FEEDBACK_MIN, FEEDBACK_MAX, FEEDBACK_DEFAULT);
}

function clampNoteNaming(v) {
	return NOTE_NAMING_OPTIONS.includes(v) ? v : NOTE_NAMING_DEFAULT;
}

function clampAnswerMode(v) {
	return ANSWER_MODE_OPTIONS.includes(v) ? v : ANSWER_MODE_DEFAULT;
}

function normalize(raw) {
	const out = { ...DEFAULTS };
	if (raw && typeof raw === 'object') {
		if ('timerSeconds' in raw) out.timerSeconds = clampTimer(raw.timerSeconds);
		if ('feedbackSeconds' in raw) out.feedbackSeconds = clampFeedback(raw.feedbackSeconds);
		if ('noteNaming' in raw) out.noteNaming = clampNoteNaming(raw.noteNaming);
		if ('answerMode' in raw) out.answerMode = clampAnswerMode(raw.answerMode);
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
		setFeedbackSeconds(s) {
			update((v) => {
				const next = { ...v, feedbackSeconds: clampFeedback(s) };
				save(next);
				return next;
			});
		},
		adjustFeedback(deltaSeconds) {
			update((v) => {
				const next = { ...v, feedbackSeconds: clampFeedback(v.feedbackSeconds + deltaSeconds) };
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
		setAnswerMode(mode) {
			update((v) => {
				const next = { ...v, answerMode: clampAnswerMode(mode) };
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
