import { base } from '$app/paths';

// ---------- Treble clef ----------
// Note pool using the images in /static/notes/treble.
// Each entry: { id, letter, image }
// `letter` is the note name (without octave) that the user must identify.
// `base` prefixes the URL when deployed to a subpath (e.g. /noteflashcards).
// Order below is roughly low → high pitch.
const TREBLE_BASE = `${base}/notes/treble`;

// Files are named <Letter><Octave>.png where Octave 1 = low, 2 = middle, 3 = high.
// Order below is ascending pitch across three octaves.
export const TREBLE_NOTES = [
	{ id: 'C1', letter: 'C', image: `${TREBLE_BASE}/C1.png` },
	{ id: 'D1', letter: 'D', image: `${TREBLE_BASE}/D1.png` },
	{ id: 'E1', letter: 'E', image: `${TREBLE_BASE}/E1.png` },
	{ id: 'F1', letter: 'F', image: `${TREBLE_BASE}/F1.png` },
	{ id: 'G1', letter: 'G', image: `${TREBLE_BASE}/G1.png` },
	{ id: 'A1', letter: 'A', image: `${TREBLE_BASE}/A1.png` },
	{ id: 'B1', letter: 'B', image: `${TREBLE_BASE}/B1.png` },
	{ id: 'C2', letter: 'C', image: `${TREBLE_BASE}/C2.png` },
	{ id: 'D2', letter: 'D', image: `${TREBLE_BASE}/D2.png` },
	{ id: 'E2', letter: 'E', image: `${TREBLE_BASE}/E2.png` },
	{ id: 'F2', letter: 'F', image: `${TREBLE_BASE}/F2.png` },
	{ id: 'G2', letter: 'G', image: `${TREBLE_BASE}/G2.png` },
	{ id: 'A2', letter: 'A', image: `${TREBLE_BASE}/A2.png` },
	{ id: 'B2', letter: 'B', image: `${TREBLE_BASE}/B2.png` },
	{ id: 'C3', letter: 'C', image: `${TREBLE_BASE}/C3.png` },
	{ id: 'D3', letter: 'D', image: `${TREBLE_BASE}/D3.png` },
	{ id: 'E3', letter: 'E', image: `${TREBLE_BASE}/E3.png` },
	{ id: 'F3', letter: 'F', image: `${TREBLE_BASE}/F3.png` },
	{ id: 'G3', letter: 'G', image: `${TREBLE_BASE}/G3.png` },
	{ id: 'A3', letter: 'A', image: `${TREBLE_BASE}/A3.png` },
	{ id: 'B3', letter: 'B', image: `${TREBLE_BASE}/B3.png` }
];

// ---------- Bass clef ----------
const BASS_BASE = `${base}/notes/bass`;

export const BASS_NOTES = [
	// Below / around the bottom of the bass staff
	{ id: 'low-B', letter: 'B', image: `${BASS_BASE}/bass-clef-low-B.png` },
	{ id: 'low-C', letter: 'C', image: `${BASS_BASE}/bass-clef-low-C.png` },
	{ id: 'low-D', letter: 'D', image: `${BASS_BASE}/bass-clef-low-D.png` },
	{ id: 'low-E', letter: 'E', image: `${BASS_BASE}/bass-clef-low-E.png` },
	{ id: 'low-F', letter: 'F', image: `${BASS_BASE}/bass-clef-low-F.png` },
	{ id: 'low-G', letter: 'G', image: `${BASS_BASE}/bass-clef-low-G.png` },
	// Middle of the bass staff
	{ id: 'mid-A', letter: 'A', image: `${BASS_BASE}/bass-clef-mid-A.png` },
	{ id: 'mid-B', letter: 'B', image: `${BASS_BASE}/bass-clef-mid-B.png` },
	{ id: 'mid-C', letter: 'C', image: `${BASS_BASE}/bass-clef-mid-C.png` },
	{ id: 'mid-D', letter: 'D', image: `${BASS_BASE}/bass-clef-mid-D.png` },
	{ id: 'mid-E', letter: 'E', image: `${BASS_BASE}/bass-clef-mid-E.png` },
	// Upper bass staff / towards middle C
	{ id: 'F', letter: 'F', image: `${BASS_BASE}/bass-clef-F.png` },
	{ id: 'G', letter: 'G', image: `${BASS_BASE}/bass-clef-G.png` },
	{ id: 'A', letter: 'A', image: `${BASS_BASE}/bass-clef-A.png` },
	{ id: 'B', letter: 'B', image: `${BASS_BASE}/bass-clef-B.png` },
	{ id: 'C', letter: 'C', image: `${BASS_BASE}/bass-clef-C.png` },
	{ id: 'D', letter: 'D', image: `${BASS_BASE}/bass-clef-D.png` },
	{ id: 'E', letter: 'E', image: `${BASS_BASE}/bass-clef-E.png` },
	// Above the bass staff (ledger lines)
	{ id: 'high-G', letter: 'G', image: `${BASS_BASE}/bass-clef-high-G.png` },
	{ id: 'high-high-F', letter: 'F', image: `${BASS_BASE}/bass-clef-high-high-F.png` }
];

// ---------- Clef registry ----------
export const CLEFS = {
	treble: {
		id: 'treble',
		title: 'Treble Clef Notes',
		notes: TREBLE_NOTES
	},
	bass: {
		id: 'bass',
		title: 'Bass Clef Notes',
		notes: BASS_NOTES
	}
};

/**
 * Look up a clef configuration by id. Returns null if the id is unknown so
 * callers (e.g. the game route) can decide how to handle invalid URLs.
 */
export function getClef(id) {
	return CLEFS[id] ?? null;
}

export const ALL_LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

// Solfège (fixed-do) names for each letter.
// Using "si" (traditional Romance-language form) for B.
export const LETTER_TO_SOLFEGE = {
	C: 'do',
	D: 're',
	E: 'mi',
	F: 'fa',
	G: 'sol',
	A: 'la',
	B: 'si'
};

/**
 * Display a note letter in the chosen naming convention.
 * @param {string} letter - one of ALL_LETTERS
 * @param {'letters'|'solfege'} naming
 */
export function displayName(letter, naming) {
	if (naming === 'solfege') return LETTER_TO_SOLFEGE[letter] ?? letter;
	return letter;
}

export function randomChoice(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

export function pickRound(pool, previousId = null) {
	// Try not to repeat the exact same note consecutively
	let note = randomChoice(pool);
	if (previousId && pool.length > 1) {
		let attempts = 0;
		while (note.id === previousId && attempts < 5) {
			note = randomChoice(pool);
			attempts++;
		}
	}
	const wrongLetters = ALL_LETTERS.filter((l) => l !== note.letter);
	const wrong = randomChoice(wrongLetters);
	const options = Math.random() < 0.5 ? [note.letter, wrong] : [wrong, note.letter];
	return { note, options };
}
