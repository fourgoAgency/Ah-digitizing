import CTABanner from '@/components/home/CTA'
import Hero from '@/components/services/raster-to-vector/Hero'
import Pricing from '@/components/services/raster-to-vector/Pricing'
import Testimonials from '@/components/services/raster-to-vector/Testimonials'
import TransformationExamples from '@/components/services/raster-to-vector/TransformationExamples'
import React from 'react'

function RasterToVector() {
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

export default RasterToVector
