<script>
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { base } from '$app/paths';
	import { TREBLE_NOTES, pickRound, displayName } from '$lib/notes.js';
	import { settings } from '$lib/settings.js';

	const FEEDBACK_MS = 700;

	// Snapshot timer at the start of each round so changes in Settings only take
	// effect from the next round — the active countdown doesn't jump mid-flight.
	let roundMs = Math.round(get(settings).timerSeconds * 1000);

	let current = pickRound(TREBLE_NOTES);
	let timeLeft = roundMs;
	let score = { correct: 0, total: 0 };
	let answered = false;
	let feedback = null; // null | 'correct' | 'wrong' | 'timeout'
	let chosen = null;

	let tickHandle = null;
	let advanceHandle = null;
	let lastTick = 0;

	onMount(() => {
		// Preload all images so transitions are instant
		for (const n of TREBLE_NOTES) {
			const img = new Image();
			img.src = n.image;
		}
		startRound();
	});

	onDestroy(() => {
		stopTimers();
	});

	function stopTimers() {
		if (tickHandle) {
			cancelAnimationFrame(tickHandle);
			tickHandle = null;
		}
		if (advanceHandle) {
			clearTimeout(advanceHandle);
			advanceHandle = null;
		}
	}

	function startRound() {
		stopTimers();
		answered = false;
		feedback = null;
		chosen = null;
		// Pick up any settings change that happened between rounds
		roundMs = Math.round(get(settings).timerSeconds * 1000);
		timeLeft = roundMs;
		lastTick = performance.now();
		tickHandle = requestAnimationFrame(tick);
	}

	function tick(now) {
		const dt = now - lastTick;
		lastTick = now;
		timeLeft = Math.max(0, timeLeft - dt);
		if (timeLeft <= 0) {
			handleTimeout();
			return;
		}
		tickHandle = requestAnimationFrame(tick);
	}

	function handleTimeout() {
		if (answered) return;
		answered = true;
		feedback = 'timeout';
		score = { ...score, total: score.total + 1 };
		scheduleNext();
	}

	function handleChoice(letter) {
		if (answered) return;
		answered = true;
		chosen = letter;
		if (tickHandle) {
			cancelAnimationFrame(tickHandle);
			tickHandle = null;
		}
		const isCorrect = letter === current.note.letter;
		feedback = isCorrect ? 'correct' : 'wrong';
		score = {
			correct: score.correct + (isCorrect ? 1 : 0),
			total: score.total + 1
		};
		scheduleNext();
	}

	function scheduleNext() {
		advanceHandle = setTimeout(() => {
			current = pickRound(TREBLE_NOTES, current.note.id);
			startRound();
		}, FEEDBACK_MS);
	}

	$: timerPct = Math.max(0, Math.min(100, (timeLeft / roundMs) * 100));
	$: timerSeconds = (timeLeft / 1000).toFixed(1);

	function buttonClass(letter) {
		if (!answered) return '';
		if (letter === current.note.letter) return 'correct';
		if (letter === chosen) return 'wrong';
		return 'dim';
	}
</script>

<header class="topbar">
	<a class="back" href="{base}/" aria-label="Back to game modes">‹ Back</a>
	<div class="score">
		<span class="score-num">{score.correct}</span>
		<span class="score-sep">/</span>
		<span class="score-num muted">{score.total}</span>
	</div>
</header>

<section class="timer-wrap" aria-label="Time left">
	<div class="timer-bar">
		<div
			class="timer-fill"
			class:warn={timeLeft < Math.min(1000, roundMs * 0.35) && !answered}
			style="width: {timerPct}%"
		></div>
	</div>
	<div class="timer-label">{timerSeconds}s</div>
</section>

<main class="stage">
	<div
		class="card"
		class:flash-correct={feedback === 'correct'}
		class:flash-wrong={feedback === 'wrong' || feedback === 'timeout'}
	>
		<img src={current.note.image} alt="Note to identify" draggable="false" />
	</div>
	{#if feedback === 'timeout'}
		<p class="hint wrong-hint">Time's up — it was <strong>{displayName(current.note.letter, $settings.noteNaming)}</strong></p>
	{:else if feedback === 'wrong'}
		<p class="hint wrong-hint">Nope — it was <strong>{displayName(current.note.letter, $settings.noteNaming)}</strong></p>
	{:else if feedback === 'correct'}
		<p class="hint correct-hint">Correct!</p>
	{:else}
		<p class="hint muted">What note is this?</p>
	{/if}
</main>

<footer class="choices" class:solfege={$settings.noteNaming === 'solfege'}>
	{#each current.options as letter}
		<button
			class="choice {buttonClass(letter)}"
			on:click={() => handleChoice(letter)}
			disabled={answered}
		>
			{displayName(letter, $settings.noteNaming)}
		</button>
	{/each}
</footer>

<style>
	.topbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 14px 16px 8px;
	}

	.back {
		font-size: 17px;
		color: var(--text-muted);
		padding: 6px 4px;
	}

	.back:active {
		color: var(--text);
	}

	.score {
		font-variant-numeric: tabular-nums;
		font-weight: 600;
		font-size: 17px;
	}

	.score-num.muted {
		color: var(--text-muted);
		font-weight: 500;
	}

	.score-sep {
		margin: 0 4px;
		color: var(--text-muted);
	}

	.timer-wrap {
		padding: 4px 16px 4px;
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.timer-bar {
		flex: 1;
		height: 8px;
		background: var(--bg-raised);
		border-radius: 999px;
		overflow: hidden;
	}

	.timer-fill {
		height: 100%;
		background: var(--accent);
		border-radius: 999px;
		transition: background 0.15s ease;
	}

	.timer-fill.warn {
		background: var(--wrong);
	}

	.timer-label {
		font-variant-numeric: tabular-nums;
		color: var(--text-muted);
		font-size: 13px;
		min-width: 34px;
		text-align: right;
	}

	.stage {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 16px 20px;
		gap: 16px;
	}

	.card {
		width: 100%;
		max-width: 440px;
		background: #ffffff;
		border: 2px solid var(--border);
		border-radius: 20px;
		padding: 12px;
		transition:
			box-shadow 0.2s ease,
			border-color 0.2s ease,
			transform 0.15s ease;
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
	}

	.card img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 10px;
		-webkit-user-drag: none;
	}

	.card.flash-correct {
		border-color: var(--correct);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--correct) 35%, transparent);
	}

	.card.flash-wrong {
		border-color: var(--wrong);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--wrong) 35%, transparent);
	}

	.hint {
		font-size: 15px;
		min-height: 22px;
		text-align: center;
	}

	.hint.muted {
		color: var(--text-muted);
	}

	.hint.correct-hint {
		color: var(--correct);
		font-weight: 600;
	}

	.hint.wrong-hint {
		color: var(--wrong);
	}

	.choices {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
		padding: 16px 16px calc(16px + var(--safe-bottom));
	}

	.choice {
		height: 72px;
		border-radius: 18px;
		font-size: 28px;
		font-weight: 700;
		background: var(--bg-raised);
		border: 2px solid var(--border);
		transition:
			transform 0.08s ease,
			background 0.2s ease,
			border-color 0.2s ease,
			color 0.2s ease,
			opacity 0.2s ease;
	}

	.choices.solfege .choice {
		font-size: 24px;
		letter-spacing: 0.02em;
	}

	.choice:active:not(:disabled) {
		transform: scale(0.97);
		background: var(--bg-card);
	}

	.choice:disabled {
		cursor: default;
	}

	.choice.correct {
		background: color-mix(in srgb, var(--correct) 22%, var(--bg-raised));
		border-color: var(--correct);
		color: var(--correct);
	}

	.choice.wrong {
		background: color-mix(in srgb, var(--wrong) 22%, var(--bg-raised));
		border-color: var(--wrong);
		color: var(--wrong);
	}

	.choice.dim {
		opacity: 0.45;
	}
</style>
