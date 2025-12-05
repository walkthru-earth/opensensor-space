<script context="module">
    // Helper to define diagrams inline without script blocks
    export const diagram = (strings, ...values) =>
        strings.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
</script>

<script>
    import Mermaid from './Mermaid.svelte';
    export let title = "";
</script>

<Mermaid {title} chart={$$restProps.chart || ''}>
    <slot />
</Mermaid>
