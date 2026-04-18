<script>
	import { base } from '$app/paths';

	const modes = [
		{
			id: 'treble',
			title: 'Treble Clef Notes',
			subtitle: 'Name the note on the staff',
			icon: '𝄞',
			available: true,
			href: `${base}/game/treble`
		},
		{
			id: 'bass',
			title: 'Bass Clef Notes',
			subtitle: 'Coming soon',
			icon: '𝄢',
			available: false
		},
		{
			id: 'intervals',
			title: 'Intervals',
			subtitle: 'Coming soon',
			icon: '♪♫',
			available: false
		},
		{
			id: 'keysig',
			title: 'Key Signatures',
			subtitle: 'Coming soon',
			icon: '♯♭',
			available: false
		}
	];
</script>

<header class="hero">
	<a class="gear" href="{base}/settings" aria-label="Settings">
		<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
			<path
				fill="currentColor"
				d="M19.14 12.94a7.97 7.97 0 0 0 0-1.88l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.97 7.97 0 0 0-1.63-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54a7.97 7.97 0 0 0-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.65 8.84a.5.5 0 0 0 .12.64l2.03 1.58a8.1 8.1 0 0 0 0 1.88l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.38 1.05.7 1.63.94l.36 2.54a.5.5 0 0 0 .5.42h3.84a.5.5 0 0 0 .5-.42l.36-2.54c.58-.24 1.13-.56 1.63-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"
			/>
		</svg>
	</a>
	<h1>NoteFlashCards</h1>
	<p>Pick a game mode</p>
</header>

<main class="modes">
	{#each modes as mode (mode.id)}
		{#if mode.available}
			<a class="mode-card" href={mode.href}>
				<span class="icon" aria-hidden="true">{mode.icon}</span>
				<span class="text">
					<span class="title">{mode.title}</span>
					<span class="subtitle">{mode.subtitle}</span>
				</span>
				<span class="chev" aria-hidden="true">›</span>
			</a>
		{:else}
			<div class="mode-card disabled">
				<span class="icon" aria-hidden="true">{mode.icon}</span>
				<span class="text">
					<span class="title">{mode.title}</span>
					<span class="subtitle">{mode.subtitle}</span>
				</span>
			</div>
		{/if}
	{/each}
</main>

<style>
	.hero {
		position: relative;
		padding: 32px 20px 16px;
		text-align: center;
	}

	.gear {
		position: absolute;
		top: 18px;
		right: 14px;
		width: 44px;
		height: 44px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 12px;
		color: var(--text-muted);
		transition:
			color 0.15s ease,
			background 0.15s ease,
			transform 0.08s ease;
	}

	.gear:active {
		color: var(--text);
		background: var(--bg-raised);
		transform: scale(0.94);
	}

	h1 {
		font-size: 28px;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.hero p {
		margin-top: 6px;
		color: var(--text-muted);
		font-size: 15px;
	}

	.modes {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 16px 16px 32px;
	}

	.mode-card {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 18px 18px;
		background: var(--bg-raised);
		border: 1px solid var(--border);
		border-radius: 16px;
		color: var(--text);
		transition:
			transform 0.08s ease,
			background 0.15s ease;
	}

	.mode-card:active {
		transform: scale(0.98);
		background: var(--bg-card);
	}

	.mode-card.disabled {
		opacity: 0.5;
		cursor: default;
	}

	.mode-card .icon {
		font-size: 30px;
		width: 48px;
		text-align: center;
		color: var(--accent);
		font-family: serif;
		line-height: 1;
	}

	.mode-card .text {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.mode-card .title {
		font-weight: 600;
		font-size: 17px;
	}

	.mode-card .subtitle {
		color: var(--text-muted);
		font-size: 13px;
	}

	.mode-card .chev {
		color: var(--text-muted);
		font-size: 28px;
		line-height: 1;
	}
</style>
