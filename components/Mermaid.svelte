<script>
    import { onMount } from "svelte";
    import mermaid from "mermaid";
    import { Fullscreen } from "@evidence-dev/core-components";

    export let chart = "";
    export let title = "";

    let container;
    let id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
    let rendered = false;
    let svgContent = "";
    let isOpen = false;

    onMount(async () => {
        mermaid.initialize({ startOnLoad: false, theme: "default" });
        if (container && chart && !rendered) {
            rendered = true;
            try {
                const { svg } = await mermaid.render(id, chart);
                svgContent = svg;
                if (container) {
                    container.innerHTML = svg;
                }
            } catch (e) {
                console.error("Mermaid rendering failed:", e);
                if (container) {
                    container.innerHTML = `<pre class="text-red-500 p-4 bg-red-50 rounded">Error rendering chart: ${e.message}</pre>`;
                }
            }
        }
    });
</script>

<div class="mermaid-wrapper my-4">
    {#if title}
        <h4 class="text-center font-bold mb-2">{title}</h4>
    {/if}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        bind:this={container}
        class="mermaid-chart overflow-x-auto flex justify-center p-4 bg-white rounded-lg border hover:shadow-lg transition-shadow cursor-pointer"
        on:click={() => (isOpen = true)}
        title="Click to expand"
    >
        Loading diagram...
    </div>
</div>

<Fullscreen bind:open={isOpen}>
    <div class="p-4 flex justify-center items-center min-h-full">
        {@html svgContent}
    </div>
</Fullscreen>
