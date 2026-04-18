import { base } from '$app/paths';

// Treble clef note pool, using the images in /static/notes/treble.
// Each entry: { id, letter, image }
// `letter` is the note name (without octave) that the user must identify.
// `base` prefixes the URL when deployed to a subpath (e.g. /noteflashcards).
// Order below is roughly low → high pitch.
const BASE = `${base}/notes/treble`;

export const TREBLE_NOTES = [
	// Well below the staff
	{ id: 'low-low-F', letter: 'F', image: `${BASE}/Treble-Clef-Notes-Quiz-low-low-F.png` },
	// Below / around middle C
	{ id: 'middle-C', letter: 'C', image: `${BASE}/Treble-Clef-Notes-Quiz-middle-C.jpg` },
	// Lower half of the staff
	{ id: 'low-E', letter: 'E', image: `${BASE}/Treble-Clef-Notes-Quiz-low-E.jpg` },
	{ id: 'low-F', letter: 'F', image: `${BASE}/Treble-Clef-Notes-Quiz-low-F.jpg` },
	{ id: 'low-G', letter: 'G', image: `${BASE}/Treble-Clef-Notes-Quiz-low-G.png` },
	{ id: 'low-A', letter: 'A', image: `${BASE}/Treble-Clef-Notes-Quiz-low-A.png` },
	{ id: 'low-B', letter: 'B', image: `${BASE}/Treble-Clef-Notes-Quiz-low-B.png` },
	// Middle / upper staff
	{ id: 'C', letter: 'C', image: `${BASE}/Treble-Clef-Notes-Quiz-C.jpg` },
	{ id: 'D', letter: 'D', image: `${BASE}/Treble-Clef-Notes-Quiz-D.jpg` },
	{ id: 'E', letter: 'E', image: `${BASE}/Treble-Clef-Notes-Quiz-E.jpg` },
	{ id: 'F', letter: 'F', image: `${BASE}/Treble-Clef-Notes-Quiz-F.jpg` },
	{ id: 'G', letter: 'G', image: `${BASE}/Treble-Clef-Notes-Quiz-G.jpg` },
	{ id: 'A', letter: 'A', image: `${BASE}/Treble-Clef-Notes-Quiz-A.jpg` },
	{ id: 'B', letter: 'B', image: `${BASE}/Treble-Clef-Notes-Quiz-B.jpg` },
	// Above the staff (ledger lines)
	{ id: 'high-C', letter: 'C', image: `${BASE}/Treble-Clef-Notes-Quiz-high-C.png` },
	{ id: 'high-D', letter: 'D', image: `${BASE}/Treble-Clef-Notes-Quiz-high-D.png` },
	{ id: 'high-E', letter: 'E', image: `${BASE}/Treble-Clef-Notes-Quiz-high-E.png` },
	{ id: 'high-G', letter: 'G', image: `${BASE}/Treble-Clef-Notes-Quiz-high-G.png` },
	{ id: 'high-A', letter: 'A', image: `${BASE}/Treble-Clef-Notes-Quiz-high-A.png` },
	{ id: 'high-B', letter: 'B', image: `${BASE}/Treble-Clef-Notes-Quiz-high-B.png` }
];

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
