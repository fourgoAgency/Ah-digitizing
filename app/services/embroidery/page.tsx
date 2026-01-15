import CTABanner from '@/components/home/CTA'
import Hero from '@/components/services/embroidery/Hero'
import Pricing from '@/components/services/embroidery/Pricing'
import Testimonials from '@/components/services/embroidery/Testimonials'
import TransformationExamples from '@/components/services/embroidery/TransformationExamples'
import React from 'react'

function Embroidery() {
  return (
    <div>
      <Hero />
      <TransformationExamples />
      <Testimonials/>
      <Pricing/>
      <CTABanner/>
    </div>
  )
}

export default Embroidery
