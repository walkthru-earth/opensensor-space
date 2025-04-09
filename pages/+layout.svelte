<script>
  import '@evidence-dev/tailwind/fonts.css';
  import '../app.css';		
  import { EvidenceDefaultLayout } from '@evidence-dev/core-components';
  export let data;

  // Add PostHog imports and initialization
  import posthog from 'posthog-js';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  onMount(() => {
    if (browser) {
      posthog.init(
        'phc_OuE8MVpDq1DjpI2dX0JnHK82wOEhdIhXjk57ZeFNU3T', // Replace with your actual PostHog Project API Key
        {
          api_host: 'https://us.i.posthog.com', // Make sure this is correct for your PostHog instance (US/EU)
          person_profiles: 'always', // 'identified_only' or 'always'
          // You can add other PostHog config options here
        }
      )
      // Optional: Capture pageviews (if not using SvelteKit router integration)
      // posthog.capture('$pageview'); 
    }
    // No return needed inside onMount if it doesn't clean anything up
  });
</script>

<EvidenceDefaultLayout 
  {data} 
  title="Cloud Native Weather Station"
  builtWithEvidence={false}
  hideBreadcrumbs={true}
  githubRepo="https://github.com/Youssef-Harby"
  xProfile="https://x.com/youssef_7arby"
  blueskyProfile="https://bsky.app/profile/youssefharby.com"
  fullWidth={true}
>
  <slot slot="content" />
</EvidenceDefaultLayout>
