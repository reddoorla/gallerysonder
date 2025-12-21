<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import VimeoPlayer from '$lib/components/VimeoPlayer.svelte';
	import { getAppState } from '$lib/contexts/appState.svelte';

	const appState = getAppState();

	const USE_INTRO = import.meta.env.VITE_USE_INTRO && import.meta.env.VITE_USE_INTRO !== 'false';
	const INTRO_DURATION = 6000;

	let isVideoLoaded = !USE_INTRO;
	let isPlaying = !USE_INTRO;
	let isVideoDone = !USE_INTRO;

	interface VimeoComponent {
		play: () => Promise<void>;
		pause: () => Promise<void>;
		reload: () => void;
	}
	let vimeoPlayer: VimeoComponent;

	onMount(() => {
		if (!USE_INTRO) {
			appState.isIntroRunning = false;
            appState.hasIntroRun = true;
		}else if(!appState.hasIntroRun){
            appState.isIntroRunning = true;
        }
	});

	const handleVideoReady = async () => {
		await vimeoPlayer.play();
		isVideoLoaded = true;

		setTimeout(async () => {
			await vimeoPlayer.pause();
			isVideoDone = true;
			appState.isIntroRunning = false;
		}, INTRO_DURATION);
	};

	const togglePlayback = async () => {
		try {
			if (isPlaying) {
				await vimeoPlayer.pause();
			} else {
				await vimeoPlayer.play();
			}
		} catch (error) {
			console.error('Error toggling playback:', error);
		}
	};

</script>

<style>
	.clip-by-logo {
		clip-path: url(#sonderClipPath);
	}

	.gradient-logo {
		background: radial-gradient(86.17% 86.17% at 9.64% 0%, #000 0%, #222020 48.5%, #565454 100%);
		background-size: 400% 400%;
		animation: gradient 5s ease infinite;
	}

	.loading-text {
		color: #727272;
		text-align: center;
		font-feature-settings: 'liga' off, 'clig' off;
		font-family: "commuters-sans";
		font-size: 18px;
		font-style: normal;
		font-weight: 400;
		line-height: 150%;
	}

	@keyframes gradient {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
</style>

<!-- SVG Logo Definition -->
<svg id="sonderLogo" width="0" height="0" viewBox="0 0 383 49" xmlns="http://www.w3.org/2000/svg">
	<clipPath id="sonderClipPath">
		<path d="M302.026 13.1236V18.7285H321.051V29.3915H302.026V34.9964H325.493V47.2998H225.973V0.820227H325.493V13.1236H302.026ZM0 41.8316L4.78466 30.8269C9.91108 34.4495 16.4045 36.2951 23.9916 36.2951C29.3231 36.2951 31.7155 35.4065 31.7155 33.4243C31.7155 31.6471 30.4851 31.1686 23.3765 30.4851C7.10864 28.913 2.11892 25.222 2.11892 15.2426C2.11892 5.26312 10.2528 0 24.1967 0C32.4673 0 39.6443 1.91386 45.1125 5.53653L40.3962 16.0628C36.2267 13.2603 31.1686 11.8249 25.4954 11.8249C19.8222 11.8249 17.7032 12.7135 17.7032 14.7641C17.7032 16.5413 18.8652 17.0197 25.9055 17.7032C42.1734 19.2753 47.2998 22.9664 47.2998 32.9458C47.2998 42.9252 39.576 48.12 24.5385 48.12C14.2856 48.12 5.67324 45.9327 0 41.8316ZM52.973 24.06C52.973 9.36426 63.0208 0 78.8102 0C94.5995 0 104.647 9.36426 104.647 24.06C104.647 38.7557 94.5995 48.12 78.8102 48.12C63.0208 48.12 52.973 38.7557 52.973 24.06ZM88.9263 24.06C88.9263 17.4982 84.9619 13.2603 78.8102 13.2603C72.6585 13.2603 68.694 17.4982 68.694 24.06C68.694 30.6218 72.6585 34.8597 78.8102 34.8597C84.9619 34.8597 88.9263 30.6218 88.9263 24.06ZM160.149 0.820227V47.2998H146.137L127.682 20.9158V47.2998H112.986V0.820227H130.006L145.454 22.9664V0.820227H160.149ZM217.839 24.06C217.839 38.4823 208.611 47.2998 193.505 47.2998H170.881V0.820227H193.505C208.611 0.820227 217.839 9.63767 217.839 24.06ZM202.118 24.06C202.118 17.2931 198.632 13.8072 191.865 13.8072H186.328V34.3128H191.865C198.632 34.3128 202.118 30.8269 202.118 24.06ZM364.523 47.2998L354.953 32.2623H349.622V47.2998H334.174V0.820227H361.857C373.819 0.820227 379.97 6.1517 379.97 16.5413C379.97 23.5815 377.099 28.3662 371.563 30.6218L382.226 47.2998H364.523ZM349.622 20.0956H359.533C362.814 20.0956 364.249 19.0019 364.249 16.5413C364.249 14.0806 362.814 12.9869 359.533 12.9869H349.622V20.0956Z" fill="#231F20"/>
	</clipPath>
</svg>

<!-- Intro Container -->
<div class="w-screen h-screen fixed top-0 left-0 bg-black" transition:fade>
	<!-- Loading Screen -->
	{#if !isVideoLoaded}
		<div class="w-screen h-screen absolute top-0 left-0 bg-black flex flex-col items-center text-center justify-center gap-10 z-20">
			<div class="loading-text">Loading Your</div>
			<div class="h-12 w-95.5 gradient-logo clip-by-logo"></div>
			<div class="loading-text">Experience</div>
		</div>
	{/if}

	<!-- Video Player -->
	<div class="w-screen h-screen absolute top-0 left-0 -z-10 transition-opacity" transition:fade={{duration:200}}>
		<VimeoPlayer
			bind:this={vimeoPlayer}
			videoId="1032470650"
			muted={true}
			bind:isPlaying
			onReady={handleVideoReady}
			onPlayingChange={(playing) => { isPlaying = playing; }}
		/>
	</div>

	<!-- Background Overlays -->
	<div class="bg-black {isVideoDone ? 'opacity-0' : ''} w-full h-full absolute left-0 -z-20 top-0"></div>
	<div class="bg-black {isVideoDone ? 'opacity-20' : 'opacity-0'} w-full h-full absolute left-0 top-0 transition-opacity duration-1000"></div>
</div>

<!-- Main Content (shows after intro) -->
{#if !appState.isIntroRunning && isVideoDone}
	<div transition:fade>
		<!-- Your main content goes here -->
		<slot />
	</div>
{/if}