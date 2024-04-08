<script lang='ts'>
    import linkArrow from "$lib/assets/icons/sonderArrowRight.svg"
    export let text = "";
    export let href ="#"
    export let twProps = "";

    let isLinkArrowActive=false;

</script>

<a 
on:mouseenter={()=>isLinkArrowActive=true} 
on:mouseleave={()=>isLinkArrowActive=false}
on:click= {()=>isLinkArrowActive=false}
class="flex flex-row items-center text-center no-underline justify-center transition-all duration-300 active:-translate-y-2 w-fit {twProps}" 
{href}>
    <span class="h-5 uppercase no-underline translate-y-[3.5px]">{text}</span>
    <img src={linkArrow} alt="link arrow" class="h-5 w-5 ml-[10px] transition-transform duration-300 {isLinkArrowActive ? "translate-x-2":""}">
</a>