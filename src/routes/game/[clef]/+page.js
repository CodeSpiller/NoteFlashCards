import { error } from '@sveltejs/kit';
import { getClef } from '$lib/notes.js';

// Tell the prerenderer which clefs to build pages for.
export function entries() {
	return [{ clef: 'treble' }, { clef: 'bass' }];
}

export function load({ params }) {
	const clef = getClef(params.clef);
	if (!clef) throw error(404, `Unknown clef: ${params.clef}`);
	return { clef };
}
