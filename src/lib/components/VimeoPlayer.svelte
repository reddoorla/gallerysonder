<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import VimeoPlayer from '@vimeo/player';

	let {
		videoId,
		autoplay = false,
		muted = true,
		loop = false,
		background = true,
		isPlaying = $bindable(false),
		onReady = undefined,
		onPlayingChange = undefined
	}: {
		videoId: string;
		autoplay?: boolean;
		muted?: boolean;
		loop?: boolean;
		background?: boolean;
		isPlaying?: boolean;
		onReady?: (() => void) | undefined;
		onPlayingChange?: ((playing: boolean) => void) | undefined;
	} = $props();

	let player: VimeoPlayer | undefined;
	let playerContainer: HTMLElement;

	const createPlayer = () => {
		if (!playerContainer) return;

		const options = {
			id: videoId,
			autopause: false,
			background,
			autoplay,
			loop,
			muted,
			responsive: true
		};

		player = new VimeoPlayer(playerContainer, options);

		player.ready().then(() => {
			onReady?.();
			if (autoplay) {
				isPlaying = true;
				onPlayingChange?.(isPlaying);
			}
		});

		player.on('play', () => {
			isPlaying = true;
			onPlayingChange?.(isPlaying);
		});

		player.on('pause', () => {
			isPlaying = false;
			onPlayingChange?.(isPlaying);
		});
	};

	const destroyPlayer = () => {
		if (player) {
			player.unload();
			player = undefined;
		}
	};

	onMount(() => {
		createPlayer();
	});

	onDestroy(() => {
		destroyPlayer();
	});

	export const play = async () => {
		try {
			await player?.play();
		} catch (error) {
			console.error('Error playing video:', error);
		}
	};

	export const pause = async () => {
		try {
			await player?.pause();
		} catch (error) {
			console.error('Error pausing video:', error);
		}
	};

	export const reload = () => {
		destroyPlayer();
		createPlayer();
	};

	let viewportHeight=$state(900);
	let viewportWidth = $state(1600);
</script>

<svelte:window bind:innerHeight={viewportHeight} bind:innerWidth={viewportWidth} />

<div
	bind:this={playerContainer}
	class="aspect-video absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 {viewportHeight *
		16 >
	viewportWidth * 9
		? 'h-screen min-w-full'
		: 'w-screen min-h-full'} contrast-[1.15] -z-10"
></div>
