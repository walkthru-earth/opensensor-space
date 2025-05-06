<script>
  import '@evidence-dev/tailwind/fonts.css';
  import '../app.css';		
  import { EvidenceDefaultLayout } from '@evidence-dev/core-components';
  export let data;

  // Add PostHog imports and initialization
  import posthog from 'posthog-js';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { beforeNavigate, afterNavigate } from '$app/navigation';
  import { page } from '$app/stores';

  onMount(() => {
    if (browser) {
      posthog.init(
        'phc_OuE8MVpDq1DjpI2dX0JnHK82wOEhdIhXjk57ZeFNU3T', // Your PostHog API Key
        {
          api_host: 'https://us.i.posthog.com',
          person_profiles: 'always', // Track all users including anonymous ones
          capture_pageview: false, // We'll handle pageviews manually with the SvelteKit router
          capture_pageleave: false, // We'll handle pageleaves manually with the SvelteKit router
          autocapture: true, // Enable autocapture for clicks, form submissions, etc.
          session_recording: {
            maskAllInputs: false, // Set to true if you want to mask all input values in recordings
            maskTextSelector: '.ph-mask', // CSS selector for elements to mask in recordings
            recordCanvas: true, // Record canvas content (for charts/visualizations)
            collectFonts: true // Collect fonts to ensure recordings look correct
          },
          capture_performance: {
            web_vitals: true, // Capture web vitals metrics
            network_timing: true // Capture network timing information
          },
          loaded: function(ph) {
            // Callback when PostHog is loaded
            // console.log('PostHog loaded successfully');
          }
        }
      );
      
      // Identify user if you have user information
      // Uncomment and customize if you have user data
      // posthog.identify(
      //   'user-unique-id', // Unique ID for the user
      //   { // Set any user properties
      //     email: 'user@example.com',
      //     name: 'John Doe'
      //   }
      // );
    }
  });

  // Set up page navigation tracking
  if (browser) {
    // Handle page navigations
    beforeNavigate((navigation) => {
      if (!navigation.willUnload) {
        posthog.capture('$pageleave');
      }
    });
    
    afterNavigate((navigation) => {
      // Capture pageview with current page information
      posthog.capture('$pageview', {
        $current_url: window.location.href,
        $pathname: window.location.pathname,
        page_title: document.title,
        referring_page: navigation.from?.url?.pathname || null
      });
    });
  }

  // Reactive statement at the top level with browser check inside
  // This follows the pattern in the Svelte docs for browser-only code in reactive statements
  $: if (browser && $page) {
    // Only attempt to access PostHog methods if we're in the browser and PostHog is available
    if (typeof posthog !== 'undefined' && posthog.isFeatureEnabled) {
      // You can capture specific page parameters here if needed
      const currentPath = $page.url.pathname;
      const currentParams = Object.fromEntries($page.url.searchParams);
      
      // Optional: Update person properties based on page navigation
      // posthog.setPersonProperties({
      //   last_page_visited: currentPath
      // });
    }
  }
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
