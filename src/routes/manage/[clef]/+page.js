import { error } from '@sveltejs/kit';
import { getClef } from '$lib/notes.js';

// Tell the prerenderer which clefs to build pages for — same set as the
// game route so every navigation from the topbar resolves to a real page.
export function entries() {
	return [{ clef: 'treble' }, { clef: 'bass' }];
}

export function load({ params }) {
	const clef = getClef(params.clef);
	if (!clef) throw error(404, `Unknown clef: ${params.clef}`);
	return { clef };
}
