import EmbCategory from '@/components/services/EmbCategory'
import EmbHero from '@/components/services/EmbHero'
import VecCategory from '@/components/services/VecCategory'
import VecHero from '@/components/services/VecHero'
import React from 'react'

export default function service() {
  return (
    <div>
      <EmbCategory/>
      <EmbHero />
      <VecCategory/>
      <VecHero/>
    </div>
  )
}
