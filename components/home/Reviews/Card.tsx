import React from 'react'
import Image, { StaticImageData } from 'next/image'

interface ReviewCardProps {
  name: string  // Name of the person giving the Review
  role: string  // Role of the person (e.g., "CEO", "Manager", etc.)  
  Review: string  // The Review text
  rating: number  // Rating out of 5 (default is 0)
  avatarInitial?: string  // Initials for the avatar if no image is provided
  avatarImage?: StaticImageData  // URL of the avatar image
}
const ReviewCard = ({
  name,
  role,
  Review,
  rating = 0,
  avatarInitial,
  avatarImage,
}: ReviewCardProps) => {
  // Split Review into lines if it contains newline characters
  const ReviewLines = Review.split('\n');

  return (
    <div className="w-full h-full rounded-3xl shadow-2xl p-6 ">

      {/* Review Text */}
      <blockquote className="mb-6 ">
        {ReviewLines.map((line, index) => (
          <p key={index} className="text-teal-500 mb-2 italic">
            {line}
          </p>
        ))}
      </blockquote>
      <div className="bg-gray-400 h-px mt-3 mb-5"></div>

      {/* Author Info */}
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {avatarImage ? (
            <Image
              src={avatarImage}
              alt={name}
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-teal-600 text-xl font-bold">
                {avatarInitial || name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="ml-4">
          <p className="text-sm font-bold text-teal-900">{name}</p>
          <p className="text-sm text-teal-750">{role}</p>
        </div>
        {/* Rating Stars */}
        <div className="flex ml-auto mt-2">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${i < rating ? 'text-teal-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
    </div>
  );
};


export default ReviewCard;

