<script>
	import { base } from '$app/paths';
	import { settings } from '$lib/settings.js';

	export let data;
	const clef = data.clef;

	$: hidden = new Set($settings.hiddenNotes?.[clef.id] ?? []);
	$: hiddenCount = hidden.size;
	$: visibleCount = clef.notes.length - hiddenCount;

	function toggle(noteId) {
		settings.toggleNoteHidden(clef.id, noteId);
	}

	function showAll() {
		settings.showAllNotes(clef.id);
	}
</script>

<svelte:head>
	<title>Manage notes — {clef.title}</title>
</svelte:head>

<header class="topbar">
	<a class="back" href="{base}/game/{clef.id}" aria-label="Back to game">‹ Back</a>
	<h1>Manage notes</h1>
	<span class="spacer" aria-hidden="true"></span>
</header>

<main class="body">
	<p class="hint">
		Tap a note to hide it from the game rotation. Hidden notes won't be shown
		in the {clef.title.toLowerCase()} game.
	</p>

	<div class="summary" aria-live="polite">
		<span><strong>{visibleCount}</strong> active</span>
		<span class="sep" aria-hidden="true">•</span>
		<span><strong>{hiddenCount}</strong> hidden</span>
		{#if hiddenCount > 0}
			<button class="show-all" type="button" on:click={showAll}>Show all</button>
		{/if}
	</div>

	<ul class="grid" role="list">
		{#each clef.notes as note (note.id)}
			{@const isHidden = hidden.has(note.id)}
			<li>
				<button
					class="tile"
					class:hidden={isHidden}
					type="button"
					aria-pressed={isHidden}
					aria-label={isHidden
						? `${note.letter}: hidden, tap to show`
						: `${note.letter}: visible, tap to hide`}
					on:click={() => toggle(note.id)}
				>
					<img src={note.image} alt="" draggable="false" />
					<span class="eye" aria-hidden="true">
						{#if isHidden}
							<!-- eye-off: stroke-based, matches eye-open visually -->
							<svg viewBox="0 0 24 24" width="20" height="20">
								<g
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
									<path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
									<path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
									<line x1="2" y1="2" x2="22" y2="22" />
								</g>
							</svg>
						{:else}
							<svg viewBox="0 0 24 24" width="20" height="20">
								<g
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
									<circle cx="12" cy="12" r="3" />
								</g>
							</svg>
						{/if}
					</span>
				</button>
			</li>
		{/each}
	</ul>
</main>

<style>
	.topbar {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		padding: 14px 16px 8px;
	}

	.back {
		font-size: 17px;
		color: var(--text-muted);
		padding: 6px 4px;
		justify-self: start;
	}

	.back:active {
		color: var(--text);
	}

	h1 {
		font-size: 17px;
		font-weight: 600;
		margin: 0;
		text-align: center;
	}

	.spacer {
		justify-self: end;
		width: 1px;
	}

	.body {
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: 8px 16px calc(24px + var(--safe-bottom));
	}

	.hint {
		font-size: 13px;
		color: var(--text-muted);
		text-align: center;
		line-height: 1.45;
		margin: 0;
	}

	.summary {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		font-size: 14px;
		color: var(--text-muted);
	}

	.summary strong {
		color: var(--text);
		font-variant-numeric: tabular-nums;
	}

	.summary .sep {
		opacity: 0.5;
	}

	.show-all {
		margin-left: 6px;
		padding: 6px 12px;
		border-radius: 999px;
		background: var(--bg-raised);
		border: 1px solid var(--border);
		color: var(--text);
		font-size: 13px;
		font-weight: 500;
		transition: transform 0.08s ease, background 0.15s ease;
	}

	.show-all:active {
		transform: scale(0.97);
		background: var(--bg-card);
	}

	.grid {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 10px;
	}

	.tile {
		position: relative;
		display: block;
		width: 100%;
		aspect-ratio: 1 / 1;
		padding: 6px;
		background: #ffffff;
		border: 2px solid var(--border);
		border-radius: 14px;
		overflow: hidden;
		transition:
			transform 0.08s ease,
			border-color 0.15s ease,
			opacity 0.2s ease,
			filter 0.2s ease;
		touch-action: manipulation;
	}

	.tile:active {
		transform: scale(0.97);
	}

	.tile:focus-visible {
		outline: 3px solid var(--accent);
		outline-offset: 3px;
	}

	.tile img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
		border-radius: 6px;
		-webkit-user-drag: none;
		-webkit-user-select: none;
		user-select: none;
		-webkit-touch-callout: none;
		pointer-events: none;
	}

	.tile.hidden {
		opacity: 0.4;
		filter: grayscale(1);
		border-color: var(--border);
	}

	.eye {
		position: absolute;
		top: 6px;
		right: 6px;
		width: 30px;
		height: 30px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 10px;
		color: #0f172a;
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
	}

	.tile.hidden .eye {
		color: #ffffff;
		background: rgba(15, 23, 42, 0.88);
	}
</style>
