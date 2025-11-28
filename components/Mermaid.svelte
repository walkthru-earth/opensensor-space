<script>
    import { onMount } from "svelte";
    import mermaid from "mermaid";

    export let chart = "";
    export let title = "";

    let container;
    let modalContainer;
    let id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
    let rendered = false;
    let isOpen = false;
    let svgContent = "";

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

    let scale = 1;
    let panning = false;
    let pointX = 0;
    let pointY = 0;
    let startX = 0;
    let startY = 0;

    function openModal() {
        isOpen = true;
        scale = 1;
        pointX = 0;
        pointY = 0;
        // Wait for modal to render then inject SVG
        setTimeout(() => {
            if (modalContainer) {
                modalContainer.innerHTML = svgContent;
                const svg = modalContainer.querySelector("svg");
                if (svg) {
                    // Remove max-width constraint that Mermaid adds
                    svg.style.maxWidth = "none";
                    svg.style.height = "auto";

                    const viewBox = svg.getAttribute("viewBox");
                    if (viewBox) {
                        const [x, y, w, h] = viewBox.split(" ").map(parseFloat);
                        const parent = modalContainer.parentElement;
                        if (parent) {
                            const parentWidth = parent.clientWidth;
                            const parentHeight = parent.clientHeight;
                            const padding = 40;
                            const availableWidth = parentWidth - padding;
                            const availableHeight = parentHeight - padding;

                            const scaleX = availableWidth / w;
                            const scaleY = availableHeight / h;

                            // Fit to screen logic:
                            // Calculate scale needed to fit width and height
                            let fitScale = Math.min(scaleX, scaleY);

                            // Clamp the initial scale to be readable (e.g. don't go below 0.85)
                            // If the diagram is huge, we show a zoomed-in view (0.85) rather than a tiny overview
                            // The user can zoom out further if they want to see the whole thing
                            scale = Math.max(fitScale, 0.85);

                            // Also don't upscale pixelated mess if it's tiny
                            scale = Math.min(scale, 1.2);
                        }
                    }
                }
            }
        }, 0);
    }

    function closeModal() {
        isOpen = false;
    }

    function onWheel(e) {
        e.preventDefault();
        const delta = e.deltaY * -0.002;
        const newScale = Math.min(Math.max(0.1, scale + delta), 5);
        scale = newScale;
    }

    function onMouseDown(e) {
        e.preventDefault();
        startX = e.clientX - pointX;
        startY = e.clientY - pointY;
        panning = true;
    }

    function onMouseMove(e) {
        if (!panning) return;
        e.preventDefault();
        pointX = e.clientX - startX;
        pointY = e.clientY - startY;
    }

    function onMouseUp() {
        panning = false;
    }
</script>

<div class="mermaid-wrapper my-4">
    {#if title}
        <h4 class="text-center font-bold mb-2">{title}</h4>
    {/if}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        bind:this={container}
        class="mermaid-chart overflow-x-auto flex justify-center p-4 bg-white rounded-lg border cursor-pointer hover:shadow-lg transition-shadow"
        on:click={openModal}
        title="Click to expand"
    >
        Loading diagram...
    </div>
</div>

{#if isOpen}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
        on:click={closeModal}
    >
        <div
            class="bg-white rounded-lg p-4 w-full h-full max-w-6xl max-h-[90vh] flex flex-col relative"
            on:click|stopPropagation
        >
            <div class="flex justify-between items-center mb-4 border-b pb-2">
                <h3 class="text-xl font-bold">{title || "Diagram View"}</h3>
                <div class="flex items-center gap-4">
                    <span class="text-sm text-gray-500"
                        >Scroll to zoom • Drag to pan</span
                    >
                    <button
                        on:click={closeModal}
                        class="text-gray-500 hover:text-gray-700 p-2 rounded hover:bg-gray-100"
                    >
                        <svg
                            class="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>
                </div>
            </div>
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
                class="flex-1 overflow-hidden flex justify-center items-center bg-gray-50 rounded border relative cursor-move"
                on:wheel={onWheel}
                on:mousedown={onMouseDown}
                on:mousemove={onMouseMove}
                on:mouseup={onMouseUp}
                on:mouseleave={onMouseUp}
            >
                <div
                    bind:this={modalContainer}
                    class="mermaid-modal-content p-4 origin-center transition-transform duration-75"
                    style="transform: translate({pointX}px, {pointY}px) scale({scale})"
                >
                    <!-- SVG injected here -->
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    /* Force override any Evidence/Tailwind defaults for the modal SVG */
    :global(.mermaid-modal-content svg) {
        max-width: none !important;
        height: auto !important;
        width: auto !important;
    }
</style>
