<script>
	import { base } from '$app/paths';

	const slides = [
		{
			src: `${base}/notes/legend/clef-on-sheet-music.jpg`,
			alt: 'A piano grand staff showing the treble and bass clefs on sheet music',
			caption: 'The grand staff: treble clef on top, bass clef on the bottom.'
		},
		{
			src: `${base}/notes/legend/ledger-lines-treble-bass-clef.png`,
			alt: 'Ledger lines and note names for the treble and bass clefs',
			caption: 'All note names across the treble and bass clefs, including ledger lines.'
		}
	];

	let index = 0;
	$: current = slides[index];
	$: atStart = index === 0;
	$: atEnd = index === slides.length - 1;

	function prev() {
		if (!atStart) index -= 1;
	}
	function next() {
		if (!atEnd) index += 1;
	}
	function onKey(e) {
		if (e.key === 'ArrowLeft') prev();
		else if (e.key === 'ArrowRight') next();
	}
</script>

<svelte:head>
	<title>Note legend — NoteFlashCards</title>
</svelte:head>

<svelte:window on:keydown={onKey} />

<header class="topbar">
	<a class="back" href="{base}/" aria-label="Back to game modes">‹ Back</a>
	<h1>Note legend</h1>
	<span class="spacer" aria-hidden="true"></span>
</header>

<main class="body">
	<p class="hint">
		Enable rotation lock on your phone to improve readability.
	</p>

	<div
		class="image-wrap"
		on:contextmenu|preventDefault
		on:dragstart|preventDefault
	>
		<img
			src={current.src}
			alt={current.alt}
			draggable="false"
		/>
	</div>

	<p class="caption">{current.caption}</p>

	<div class="nav">
		<button
			class="nav-btn"
			on:click={prev}
			disabled={atStart}
			aria-label="Previous image"
		>
			‹
		</button>
		<div class="dots" aria-hidden="true">
			{#each slides as _, i}
				<span class="dot" class:active={i === index}></span>
			{/each}
		</div>
		<span class="counter" aria-live="polite">{index + 1} / {slides.length}</span>
		<button
			class="nav-btn"
			on:click={next}
			disabled={atEnd}
			aria-label="Next image"
		>
			›
		</button>
	</div>
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

	.image-wrap {
		background: #ffffff;
		border: 2px solid var(--border);
		border-radius: 20px;
		padding: 10px;
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
		width: 100%;
		overflow: hidden;
	}

	.image-wrap img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 10px;
		-webkit-user-drag: none;
		-webkit-user-select: none;
		user-select: none;
		-webkit-touch-callout: none;
	}

	.caption {
		font-size: 14px;
		color: var(--text);
		text-align: center;
		line-height: 1.45;
		margin: 0;
	}

	.nav {
		display: grid;
		grid-template-columns: 64px 1fr auto 64px;
		align-items: center;
		gap: 10px;
		margin-top: 4px;
	}

	.nav-btn {
		height: 56px;
		border-radius: 16px;
		font-size: 28px;
		font-weight: 700;
		background: var(--bg-raised);
		border: 2px solid var(--border);
		color: var(--text);
		transition:
			transform 0.08s ease,
			background 0.15s ease,
			opacity 0.2s ease;
	}

	.nav-btn:active:not(:disabled) {
		transform: scale(0.96);
		background: var(--border);
	}

	.nav-btn:disabled {
		opacity: 0.35;
		cursor: default;
	}

	.dots {
		display: flex;
		justify-content: center;
		gap: 8px;
	}

	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--border);
		transition:
			background 0.15s ease,
			transform 0.15s ease;
	}

	.dot.active {
		background: var(--accent);
		transform: scale(1.25);
	}

	.counter {
		font-size: 13px;
		color: var(--text-muted);
		font-variant-numeric: tabular-nums;
		min-width: 38px;
		text-align: right;
	}
</style>
