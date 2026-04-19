<script>
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { base } from '$app/paths';
	import { pickRound, displayName } from '$lib/notes.js';
	import { settings } from '$lib/settings.js';

	export let data;
	// Snapshot at mount time. `data.clef` is stable for this component
	// instance — users navigate home → clef → back, not clef → clef — so
	// plain const avoids the `$:`-runs-after-script trap that would leave
	// `pool` undefined when we initialize `current` below.
	const clef = data.clef;
	const pool = clef.notes;

	// Snapshot timer + feedback durations and answer mode at the start of each
	// round so changes in Settings only take effect from the next round — the
	// active countdown doesn't jump mid-flight and the mode doesn't swap while
	// a round is in progress.
	let roundMs = Math.round(get(settings).timerSeconds * 1000);
	let feedbackMs = Math.round(get(settings).feedbackSeconds * 1000);
	let mode = get(settings).answerMode;

	let current = pickRound(pool);
	let timeLeft = roundMs;
	let score = { correct: 0, total: 0 };
	let answered = false;
	let feedback = null; // null | 'correct' | 'wrong' | 'timeout' | 'reveal'
	let chosen = null;

	let tickHandle = null;
	let advanceHandle = null;
	let lastTick = 0;

	// Reveal-mode press interaction:
	//   short tap on the card → advance to the next note (no answer shown)
	//   long press (≥ LONG_PRESS_MS) → show the answer + pause countdown
	//     until release; release then advances to the next note
	const LONG_PRESS_MS = 250;
	let pressHandle = null;
	let pressActive = false;

	onMount(() => {
		// Preload all images for this clef so transitions are instant
		for (const n of pool) {
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
		if (pressHandle) {
			clearTimeout(pressHandle);
			pressHandle = null;
		}
		pressActive = false;
	}

	function handleCardPointerDown() {
		// Pause everything that could change the screen while the user
		// is holding: the countdown tick and any pending auto-advance.
		// This works in both answer modes.
		if (tickHandle) {
			cancelAnimationFrame(tickHandle);
			tickHandle = null;
		}
		if (advanceHandle) {
			clearTimeout(advanceHandle);
			advanceHandle = null;
		}
		pressActive = true;
		// Only schedule the reveal if the answer isn't already on screen
		// (e.g. the countdown expired naturally just before the press, or
		// the user already tapped a button in buttons mode).
		if (feedback !== 'reveal') {
			pressHandle = setTimeout(() => {
				if (pressActive === false) return;
				answered = true;
				// Use the neutral reveal display regardless of mode so the
				// card doesn't suddenly turn red/green from a prior answer.
				feedback = 'reveal';
			}, LONG_PRESS_MS);
		}
	}

	function handleCardPointerRelease() {
		if (pressActive === false) return;
		pressActive = false;
		if (pressHandle) {
			clearTimeout(pressHandle);
			pressHandle = null;
		}
		// Both short taps and long releases advance to the next image.
		current = pickRound(pool, current.note.id);
		startRound();
	}

	function handleCardKeyDown(e) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			// Keyboard shortcut = quick-tap: skip to the next image.
			if (tickHandle) {
				cancelAnimationFrame(tickHandle);
				tickHandle = null;
			}
			if (advanceHandle) {
				clearTimeout(advanceHandle);
				advanceHandle = null;
			}
			current = pickRound(pool, current.note.id);
			startRound();
		}
	}

	function startRound() {
		stopTimers();
		answered = false;
		feedback = null;
		chosen = null;
		// Pick up any settings changes that happened between rounds
		const s = get(settings);
		roundMs = Math.round(s.timerSeconds * 1000);
		feedbackMs = Math.round(s.feedbackSeconds * 1000);
		mode = s.answerMode;
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
		if (mode === 'reveal') {
			// Passive viewing mode — no buttons, no score, just show the answer.
			feedback = 'reveal';
		} else {
			feedback = 'timeout';
			score = { ...score, total: score.total + 1 };
		}
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
			current = pickRound(pool, current.note.id);
			startRound();
		}, feedbackMs);
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

<svelte:head>
	<title>{clef.title} — NoteFlashCards</title>
</svelte:head>

<header class="topbar">
	<a class="back" href="{base}/" aria-label="Back to game modes">‹ Back</a>
	<div class="title" aria-label="Current game mode">{clef.title}</div>
	{#if mode === 'reveal'}
		<div class="score" aria-hidden="true"></div>
	{:else}
		<div class="score">
			<span class="score-num">{score.correct}</span>
			<span class="score-sep">/</span>
			<span class="score-num muted">{score.total}</span>
		</div>
	{/if}
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
		class="card pressable"
		class:flash-correct={feedback === 'correct'}
		class:flash-wrong={feedback === 'wrong' || feedback === 'timeout'}
		role="button"
		tabindex="0"
		aria-label="Tap for next note, long-press to reveal the answer"
		on:pointerdown={handleCardPointerDown}
		on:pointerup={handleCardPointerRelease}
		on:pointercancel={handleCardPointerRelease}
		on:pointerleave={handleCardPointerRelease}
		on:keydown={handleCardKeyDown}
		on:contextmenu|preventDefault
		on:dragstart|preventDefault
	>
		<img src={current.note.image} alt="Note to identify" draggable="false" />
	</div>
	<!-- Fixed-height message slot so the image never shifts between states,
	     regardless of mode or whether the (larger) reveal text is on screen. -->
	<div class="msg-slot">
		{#if feedback === 'reveal'}
			<p class="reveal">answer is <strong>{displayName(current.note.letter, $settings.noteNaming)}</strong></p>
		{:else if feedback === 'timeout'}
			<p class="hint wrong-hint">Time's up — it was <strong>{displayName(current.note.letter, $settings.noteNaming)}</strong></p>
		{:else if feedback === 'wrong'}
			<p class="hint wrong-hint">Nope — it was <strong>{displayName(current.note.letter, $settings.noteNaming)}</strong></p>
		{:else if feedback === 'correct'}
			<p class="hint correct-hint">Correct!</p>
		{:else if mode === 'reveal'}
			<!-- Intentionally empty: no "What note is this?" prompt when
			     there are no answer buttons to tap. -->
		{:else}
			<p class="hint muted">What note is this?</p>
		{/if}
	</div>
</main>

{#if mode !== 'reveal'}
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
{/if}

<style>
	.topbar {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		padding: 14px 16px 8px;
		gap: 10px;
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

	.title {
		font-size: 13px;
		font-weight: 600;
		color: var(--text-muted);
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.score {
		font-variant-numeric: tabular-nums;
		font-weight: 600;
		font-size: 17px;
		justify-self: end;
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
		-webkit-user-select: none;
		user-select: none;
		/* Disable iOS's long-press "save image / copy / share" callout. */
		-webkit-touch-callout: none;
		/* Let pointer + touch events fall through to the parent .card
		   button, which routes them through our short-tap / long-press
		   handler. This also prevents the OS from recognising the press
		   as happening on an <img>, which suppresses the image context
		   menu on both iOS and Android. */
		pointer-events: none;
	}

	.card.flash-correct {
		border-color: var(--correct);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--correct) 35%, transparent);
	}

	.card.flash-wrong {
		border-color: var(--wrong);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--wrong) 35%, transparent);
	}

	/* Reveal mode: the card is tappable. Suppress iOS long-press callouts
	   and text selection so holding doesn't pop a context menu. */
	.card.pressable {
		cursor: pointer;
		user-select: none;
		-webkit-user-select: none;
		-webkit-touch-callout: none;
		outline: none;
	}

	.card.pressable:active {
		transform: scale(0.985);
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

	.reveal {
		color: #ffffff;
		font-size: 24px;
		font-weight: 600;
		letter-spacing: 0.01em;
		text-align: center;
		min-height: 32px;
		margin-top: 4px;
	}

	.reveal strong {
		font-size: 30px;
		font-weight: 800;
		margin-left: 2px;
	}

	/* Fixed slot beneath the card. Large enough to fit the tallest child
	   (.reveal), so swapping between hint / reveal / correct / wrong /
	   timeout / empty never shifts the card above. */
	.msg-slot {
		min-height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.msg-slot .hint,
	.msg-slot .reveal {
		margin: 0;
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
