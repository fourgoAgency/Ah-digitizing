import React from 'react'
import Portfolio from './portfolio/Portfolio'
import Reviews from './Reviews/Reviews'
import Aboutus from './Aboutus/Aboutus'
import Service from './Services/Service'
import Hero from './hero/Hero'
import ScrollTransitionSection from '../ScrollWrapper'

export default function Home() {
  return (
    <div className="overflow-hidden">
      <ScrollTransitionSection>
        <Hero />
      </ScrollTransitionSection>

      <ScrollTransitionSection>
        <Service />
      </ScrollTransitionSection>

      <ScrollTransitionSection>
        <Aboutus />
      </ScrollTransitionSection>

      <ScrollTransitionSection>
        <Portfolio />
      </ScrollTransitionSection>

      <ScrollTransitionSection>
        <Reviews />
      </ScrollTransitionSection>
    </div>
  )
}
