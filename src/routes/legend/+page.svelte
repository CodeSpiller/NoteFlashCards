<script>
	import { base } from '$app/paths';

	const imageSrc = `${base}/notes/legend/ledger-lines-treble-bass-clef.png`;
</script>

<svelte:head>
	<title>Note legend — NoteFlashCards</title>
</svelte:head>

<header class="topbar">
	<a class="back" href="{base}/" aria-label="Back to game modes">‹ Back</a>
	<h1>Note legend</h1>
	<span class="spacer" aria-hidden="true"></span>
</header>

<main class="body">
	<p class="hint">
		Rotate your phone to landscape for the clearest view. If nothing turns,
		make sure <strong>auto-rotate</strong> is enabled (or disable your
		rotation lock).
	</p>

	<div
		class="image-wrap"
		on:contextmenu|preventDefault
		on:dragstart|preventDefault
	>
		<img
			src={imageSrc}
			alt="Ledger lines and note names for the treble and bass clefs"
			draggable="false"
		/>
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

	.hint strong {
		color: var(--text);
		font-weight: 600;
	}

	.image-wrap {
		background: #ffffff;
		border: 2px solid var(--border);
		border-radius: 20px;
		padding: 10px;
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
		/* Let the image grow up to the full viewport width; when the phone
		   is rotated to landscape it'll get noticeably larger and crisper. */
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
		/* Suppress the iOS long-press "save image / share" callout and
		   its Android equivalent. */
		-webkit-touch-callout: none;
	}
</style>
