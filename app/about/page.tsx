import React from 'react'
import CoreValue from '@/components/about/CoreValue'
import Hero from '@/components/about/Hero'
import Mission from '@/components/about/Mission'
import ChooseUS from '@/components/about/ChooseUS'
import Team from '@/components/about/Team'
export default function page() {
  return (
    <div className="w-full">
      {/* Banner Section */}
      <Hero />
      {/* Mission and Vision */}
      <Mission/>

      {/* Why Choose Us */}
      <ChooseUS />
        
      {/* Core Values */}
      <CoreValue/>

      {/* Meet the Team */}
      <Team />
    </div>
  )
}
