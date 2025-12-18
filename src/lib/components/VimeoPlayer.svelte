<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import VimeoPlayer from '@vimeo/player';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let videoId: string;
	export let autoplay = false;
	export let muted = true;
	export let loop = false;
	export let background = true;
	export let isPlaying = false;

	let player: any | undefined;
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
			dispatch('ready');
			if (autoplay) {
				isPlaying = true;
				dispatch('playingChange', { isPlaying });
			}
		});

		player.on('play', () => {
			isPlaying = true;
			dispatch('playingChange', { isPlaying });
		});

		player.on('pause', () => {
			isPlaying = false;
			dispatch('playingChange', { isPlaying });
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

	let viewportHeight: number;
	let viewportWidth: number;
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
