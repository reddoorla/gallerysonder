<script lang="ts">
    import GridImage from "./GridImage.svelte";

    import onShowOne from '$lib/assets/images/homeImages/onShow/sonderOnShow1.jpg'
    import onShowTwo from '$lib/assets/images/homeImages/onShow/sonderOnShow2.jpg'
    import onShowThree from '$lib/assets/images/homeImages/onShow/sonderOnShow3.jpg'
    import onShowFour from '$lib/assets/images/homeImages/onShow/sonderOnShow4.jpg'

    export let galleryItems = [
        {
            image: onShowOne,
            title: "awaiting the return",
            subtitle: ""
        },
        {
            image: onShowTwo,
            title: "mind body and spirit",
            subtitle: ""
        },
        {
            image: onShowThree,
            title: "in the shadows",
            subtitle: ""
        },
        {
            image: onShowFour,
            title: "before the fall",
        }
    ];
</script>

<div class="w-full flex flex-row flex-wrap">
    {#each galleryItems as item, i} 
        <div class="w-full md:w-1/2 aspect-square flex items-center justify-{i%2 == 0 ? "start":"end"}">
            <GridImage 
            class="{i%4==0 ? "ml-10" : ""} {i%3==0 ? "mr-10" : ""}" 
            src={item.image} 
            text={item.title}
            subtitle={item.subtitle}
            alt={item.title}
        />
        </div>
    {/each}
</div>