<script lang="ts">
    import GridImage from "./GridImage.svelte";

    import onShowOne from '$lib/assets/images/homeImages/onShow/sonderOnShow1.jpg'
    import onShowTwo from '$lib/assets/images/homeImages/onShow/sonderOnShow2.jpg'
    import onShowThree from '$lib/assets/images/homeImages/onShow/sonderOnShow3.jpg'
    import onShowFour from '$lib/assets/images/homeImages/onShow/sonderOnShow4.jpg'

    export let items = [
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

    export let willBlur = false;
    export let isRegular = false;

    let isHoverArray= new Array(items.length).fill(false);
    

function handleHover(event: CustomEvent<boolean>, index: number) {
  isHoverArray[index] = event.detail;
}

</script>

<div class="w-full flex flex-row flex-wrap {$$props.class || ""}">
    {#each items as item, i (i)} 
        <div class="w-full md:w-1/2 aspect-square use-gpu flex items-center transition duration-700 delay-700 justify-{i%2 == 0 ? "start":"end"} {isHoverArray.some(Boolean) && !isHoverArray[i] && willBlur ? "blur" : ""}">
            <GridImage 
                class="{i%4==0 && !isRegular  ? "ml-10" : ""} {i%3==0 && !isRegular ? "mr-10" : ""}" 
                src={item.image} 
                text={item.title}
                subtitle={item.subtitle}
                alt={item.title}
                bind:isHover={isHoverArray[i]}
                on:hover={(event) => handleHover(event, i)}
            />
        </div>
    {/each}
</div>