<template>
  <main class="overflow-hidden">
    <Hero />
    <ServiceArea />
    <Statistics />
    <Features />
    <Solutions />
    <HowItWorks />
    <WhyChoose />
    <Testimonials v-if="websiteStore.showTestimonials" />
    <CTA />
  </main>
</template>

<script setup>
import { useWebsiteStore } from '../../store/websiteStore.js'
import Hero from './Hero.vue'
import ServiceArea from './ServiceArea.vue'
import Statistics from './Statistics.vue'
import Features from './Features.vue'
import Solutions from './Solutions.vue'
import HowItWorks from './HowItWorks.vue'
import WhyChoose from './WhyChoose.vue'
import Testimonials from './Testimonials.vue'
import CTA from './CTA.vue'

const websiteStore = useWebsiteStore()
</script>
