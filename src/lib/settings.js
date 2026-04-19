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

// Notes the user has hidden from the rotation, keyed by clef id. Stored as
// arrays (not Sets) so the value is plain JSON for localStorage.
const HIDDEN_NOTES_DEFAULT = { treble: [], bass: [] };

const DEFAULTS = {
	timerSeconds: TIMER_DEFAULT,
	feedbackSeconds: FEEDBACK_DEFAULT,
	noteNaming: NOTE_NAMING_DEFAULT,
	answerMode: ANSWER_MODE_DEFAULT,
	hiddenNotes: { ...HIDDEN_NOTES_DEFAULT }
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

function clampHiddenNotes(v) {
	const out = { ...HIDDEN_NOTES_DEFAULT };
	if (v && typeof v === 'object') {
		for (const clefId of Object.keys(HIDDEN_NOTES_DEFAULT)) {
			const arr = v[clefId];
			if (Array.isArray(arr)) {
				// Dedupe + coerce to strings; drop anything non-string.
				out[clefId] = [...new Set(arr.filter((x) => typeof x === 'string'))];
			}
		}
	}
	return out;
}

function normalize(raw) {
	const out = { ...DEFAULTS, hiddenNotes: { ...HIDDEN_NOTES_DEFAULT } };
	if (raw && typeof raw === 'object') {
		if ('timerSeconds' in raw) out.timerSeconds = clampTimer(raw.timerSeconds);
		if ('feedbackSeconds' in raw) out.feedbackSeconds = clampFeedback(raw.feedbackSeconds);
		if ('noteNaming' in raw) out.noteNaming = clampNoteNaming(raw.noteNaming);
		if ('answerMode' in raw) out.answerMode = clampAnswerMode(raw.answerMode);
		if ('hiddenNotes' in raw) out.hiddenNotes = clampHiddenNotes(raw.hiddenNotes);
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
		/**
		 * Flip the hidden state of a single note for the given clef.
		 * Hidden notes are excluded from the game's rotation.
		 */
		toggleNoteHidden(clefId, noteId) {
			update((v) => {
				if (!(clefId in HIDDEN_NOTES_DEFAULT)) return v;
				const cur = new Set(v.hiddenNotes?.[clefId] ?? []);
				if (cur.has(noteId)) cur.delete(noteId);
				else cur.add(noteId);
				const next = {
					...v,
					hiddenNotes: { ...v.hiddenNotes, [clefId]: [...cur] }
				};
				save(next);
				return next;
			});
		},
		/** Clear every hidden note for the given clef. */
		showAllNotes(clefId) {
			update((v) => {
				if (!(clefId in HIDDEN_NOTES_DEFAULT)) return v;
				const next = {
					...v,
					hiddenNotes: { ...v.hiddenNotes, [clefId]: [] }
				};
				save(next);
				return next;
			});
		},
		reset() {
			const next = { ...DEFAULTS, hiddenNotes: { ...HIDDEN_NOTES_DEFAULT } };
			save(next);
			set(next);
		}
	};
}

export const settings = createSettings();
