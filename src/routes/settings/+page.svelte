<script>
	import { base } from '$app/paths';
	import {
		settings,
		TIMER_MIN,
		TIMER_MAX,
		TIMER_STEP,
		FEEDBACK_MIN,
		FEEDBACK_MAX,
		FEEDBACK_STEP
	} from '$lib/settings.js';
	import { LETTER_TO_SOLFEGE } from '$lib/notes.js';

	$: timer = $settings.timerSeconds;
	$: feedback = $settings.feedbackSeconds;
	$: naming = $settings.noteNaming;
	$: mode = $settings.answerMode;

	function dec() {
		settings.adjustTimer(-TIMER_STEP);
	}
	function inc() {
		settings.adjustTimer(TIMER_STEP);
	}
	function onSlider(e) {
		settings.setTimerSeconds(Number(e.currentTarget.value));
	}
	function fbDec() {
		settings.adjustFeedback(-FEEDBACK_STEP);
	}
	function fbInc() {
		settings.adjustFeedback(FEEDBACK_STEP);
	}
	function onFeedbackSlider(e) {
		settings.setFeedbackSeconds(Number(e.currentTarget.value));
	}
	function reset() {
		settings.reset();
	}

	$: atMin = timer <= TIMER_MIN + 1e-6;
	$: atMax = timer >= TIMER_MAX - 1e-6;
	$: timerLabel = timer.toFixed(1);

	$: fbAtMin = feedback <= FEEDBACK_MIN + 1e-6;
	$: fbAtMax = feedback >= FEEDBACK_MAX - 1e-6;
	$: feedbackLabel = feedback.toFixed(1);
</script>

<header class="topbar">
	<a class="back" href="{base}/" aria-label="Back">‹ Back</a>
	<h1>Settings</h1>
	<span class="spacer" aria-hidden="true"></span>
</header>

<main class="body">
	<section class="card">
		<div class="section-head">
			<h2>Countdown timer</h2>
			<p>Seconds per note before auto-advance.</p>
		</div>

		<div class="stepper">
			<button
				class="step-btn"
				on:click={dec}
				disabled={atMin}
				aria-label="Decrease by 0.1 seconds"
			>
				−
			</button>
			<div class="value">
				<span class="value-num">{timerLabel}</span>
				<span class="value-unit">s</span>
			</div>
			<button
				class="step-btn"
				on:click={inc}
				disabled={atMax}
				aria-label="Increase by 0.1 seconds"
			>
				+
			</button>
		</div>

		<input
			class="slider"
			type="range"
			min={TIMER_MIN}
			max={TIMER_MAX}
			step={TIMER_STEP}
			value={timer}
			on:input={onSlider}
			aria-label="Countdown timer in seconds"
		/>

		<div class="range-labels">
			<span>{TIMER_MIN.toFixed(1)}s</span>
			<span>{TIMER_MAX.toFixed(1)}s</span>
		</div>

		<div class="presets">
			{#each [1.5, 3.0, 5.0, 8.0] as preset}
				<button
					class="preset"
					class:active={Math.abs(timer - preset) < 1e-6}
					on:click={() => settings.setTimerSeconds(preset)}
				>
					{preset.toFixed(1)}s
				</button>
			{/each}
		</div>
	</section>

	<section class="card">
		<div class="section-head">
			<h2>Answer reveal</h2>
			<p>Seconds the answer stays on screen before the next note.</p>
		</div>

		<div class="stepper">
			<button
				class="step-btn"
				on:click={fbDec}
				disabled={fbAtMin}
				aria-label="Decrease reveal duration by 0.1 seconds"
			>
				−
			</button>
			<div class="value">
				<span class="value-num">{feedbackLabel}</span>
				<span class="value-unit">s</span>
			</div>
			<button
				class="step-btn"
				on:click={fbInc}
				disabled={fbAtMax}
				aria-label="Increase reveal duration by 0.1 seconds"
			>
				+
			</button>
		</div>

		<input
			class="slider"
			type="range"
			min={FEEDBACK_MIN}
			max={FEEDBACK_MAX}
			step={FEEDBACK_STEP}
			value={feedback}
			on:input={onFeedbackSlider}
			aria-label="Answer reveal duration in seconds"
		/>

		<div class="range-labels">
			<span>{FEEDBACK_MIN.toFixed(1)}s</span>
			<span>{FEEDBACK_MAX.toFixed(1)}s</span>
		</div>

		<div class="presets">
			{#each [0.3, 0.7, 1.5, 2.5] as preset}
				<button
					class="preset"
					class:active={Math.abs(feedback - preset) < 1e-6}
					on:click={() => settings.setFeedbackSeconds(preset)}
				>
					{preset.toFixed(1)}s
				</button>
			{/each}
		</div>
	</section>

	<section class="card">
		<div class="section-head">
			<h2>Answer mode</h2>
			<p>Tap to answer, or just watch the answer appear.</p>
		</div>

		<div class="segmented" role="radiogroup" aria-label="Answer mode">
			<button
				class="seg"
				class:active={mode === 'buttons'}
				role="radio"
				aria-checked={mode === 'buttons'}
				on:click={() => settings.setAnswerMode('buttons')}
			>
				<span class="seg-title">Buttons</span>
				<span class="seg-sub">pick one of two</span>
			</button>
			<button
				class="seg"
				class:active={mode === 'reveal'}
				role="radio"
				aria-checked={mode === 'reveal'}
				on:click={() => settings.setAnswerMode('reveal')}
			>
				<span class="seg-title">Reveal only</span>
				<span class="seg-sub">show the answer</span>
			</button>
		</div>
	</section>

	<section class="card">
		<div class="section-head">
			<h2>Note names</h2>
			<p>How note names appear on the answer buttons.</p>
		</div>

		<div class="segmented" role="radiogroup" aria-label="Note naming">
			<button
				class="seg"
				class:active={naming === 'letters'}
				role="radio"
				aria-checked={naming === 'letters'}
				on:click={() => settings.setNoteNaming('letters')}
			>
				<span class="seg-title">Letters</span>
				<span class="seg-sub">C D E F G A B</span>
			</button>
			<button
				class="seg"
				class:active={naming === 'solfege'}
				role="radio"
				aria-checked={naming === 'solfege'}
				on:click={() => settings.setNoteNaming('solfege')}
			>
				<span class="seg-title">Solfège</span>
				<span class="seg-sub">do re mi fa sol la si</span>
			</button>
		</div>

		<dl class="mapping">
			{#each Object.entries(LETTER_TO_SOLFEGE) as [letter, solfege]}
				<div class="map-row">
					<dt>{letter}</dt>
					<dd>{solfege}</dd>
				</div>
			{/each}
		</dl>
	</section>

	<button class="reset" on:click={reset}>Reset to defaults</button>
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
		gap: 16px;
		padding: 16px 16px calc(24px + var(--safe-bottom));
	}

	.card {
		background: var(--bg-raised);
		border: 1px solid var(--border);
		border-radius: 20px;
		padding: 20px 18px 22px;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.section-head h2 {
		font-size: 17px;
		font-weight: 600;
		margin: 0 0 4px;
	}

	.section-head p {
		color: var(--text-muted);
		font-size: 13px;
		margin: 0;
	}

	.stepper {
		display: grid;
		grid-template-columns: 64px 1fr 64px;
		align-items: center;
		gap: 8px;
	}

	.step-btn {
		height: 64px;
		border-radius: 18px;
		font-size: 32px;
		font-weight: 700;
		background: var(--bg-card);
		border: 2px solid var(--border);
		transition:
			transform 0.08s ease,
			background 0.15s ease,
			opacity 0.2s ease;
	}

	.step-btn:active:not(:disabled) {
		transform: scale(0.96);
		background: var(--border);
	}

	.step-btn:disabled {
		opacity: 0.35;
		cursor: default;
	}

	.value {
		text-align: center;
		font-variant-numeric: tabular-nums;
		line-height: 1;
	}

	.value-num {
		font-size: 56px;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.value-unit {
		font-size: 22px;
		color: var(--text-muted);
		margin-left: 4px;
	}

	.slider {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 6px;
		background: var(--bg-card);
		border-radius: 999px;
		outline: none;
		margin: 0;
	}

	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: var(--accent);
		border: 3px solid var(--bg-raised);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
		cursor: pointer;
	}

	.slider::-moz-range-thumb {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: var(--accent);
		border: 3px solid var(--bg-raised);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
		cursor: pointer;
	}

	.range-labels {
		display: flex;
		justify-content: space-between;
		color: var(--text-muted);
		font-size: 12px;
		font-variant-numeric: tabular-nums;
		margin-top: -8px;
	}

	.presets {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 8px;
	}

	.preset {
		padding: 10px 0;
		border-radius: 12px;
		background: var(--bg-card);
		border: 1.5px solid var(--border);
		font-size: 14px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: var(--text-muted);
		transition:
			color 0.15s ease,
			background 0.15s ease,
			border-color 0.15s ease;
	}

	.preset:active {
		transform: scale(0.97);
	}

	.preset.active {
		color: var(--accent);
		border-color: var(--accent);
		background: color-mix(in srgb, var(--accent) 15%, var(--bg-card));
	}

	.segmented {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
	}

	.seg {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 14px 10px;
		border-radius: 14px;
		background: var(--bg-card);
		border: 2px solid var(--border);
		color: var(--text-muted);
		transition:
			color 0.15s ease,
			background 0.15s ease,
			border-color 0.15s ease,
			transform 0.08s ease;
	}

	.seg:active {
		transform: scale(0.98);
	}

	.seg-title {
		font-size: 15px;
		font-weight: 600;
	}

	.seg-sub {
		font-size: 12px;
		opacity: 0.8;
		font-variant-numeric: tabular-nums;
	}

	.seg.active {
		color: var(--accent);
		border-color: var(--accent);
		background: color-mix(in srgb, var(--accent) 15%, var(--bg-card));
	}

	.mapping {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 6px;
		margin: 0;
		padding: 10px 4px 2px;
	}

	.map-row {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		padding: 8px 0;
		background: var(--bg-card);
		border-radius: 10px;
	}

	.map-row dt {
		font-size: 14px;
		font-weight: 700;
		color: var(--text);
	}

	.map-row dd {
		margin: 0;
		font-size: 12px;
		color: var(--text-muted);
	}

	.reset {
		margin: 4px auto 0;
		padding: 12px 20px;
		font-size: 14px;
		color: var(--text-muted);
		background: transparent;
		border-radius: 10px;
	}

	.reset:active {
		color: var(--text);
	}
</style>
