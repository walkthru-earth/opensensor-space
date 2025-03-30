<script>
  import { EvidenceDefaultLayout } from '@evidence-dev/core-components';
  export let data;
</script>

<EvidenceDefaultLayout 
  {data} 
  title="Cloud Native Weather Station Dashboard"
  builtWithEvidence={false}
  hideBreadcrumbs={true}
  githubRepo="https://github.com/Youssef-Harby"
  xProfile="https://x.com/youssef_7arby"
>
  <slot slot="content" />
</EvidenceDefaultLayout>
