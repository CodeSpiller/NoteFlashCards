<script>
	import '../app.css';
</script>

<div class="app-shell">
	<slot />
</div>

<style>
	.app-shell {
		min-height: 100dvh;
		padding-top: var(--safe-top);
		padding-bottom: var(--safe-bottom);
		display: flex;
		flex-direction: column;
		max-width: 560px;
		margin: 0 auto;
	}
</style>
