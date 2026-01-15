'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import client from '@/lib/sanityClient'

interface FormData {
  name: string
  email: string
  phone: number | string
  message: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await client.create({
        _type: 'contact',
        ...formData,
      })

      setSuccess(true)
      setFormData({ name: '', email: '',phone: '', message: '' })
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className="lg:w-1/2">
    <form onSubmit={handleSubmit} className="bg-gray-50 shadow rounded-lg p-8 space-y-6">
      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
      <input
        type="text"
        id='name'
        name="name"
        placeholder="Your Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
      <input
        type="email"
        id='email'
        name="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone
        </label>
      <input
        type="tel"
        id='phone'
        name="phone"
        placeholder="Your Phone Number"
        value={formData.phone}
        onChange={handleChange}
        required
        className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
      <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message
        </label>
      <textarea
        name="message"
        placeholder="Your Query or Feedback"
        rows={5}
        value={formData.message}
        onChange={handleChange}
        required
        className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-teal-500 text-white py-3 rounded-md shadow hover:bg-teal-600 transition"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
      {success && <p className="text-green-500">Message sent successfully!</p>}
    </form>
  </div>
  )
}
