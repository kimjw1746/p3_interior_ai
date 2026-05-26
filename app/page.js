import Image from "next/image";
import Link from "next/link";
import React from 'react'

export default function Home() {
  return (
    <div>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-[85rem]">
            {/* Main Title */}
            <div className="mb-8">
              <h1 className="text-5xl font-bold mb-4">
                AI Room and Home
                <span className="text-primary"> Interior AI</span>
              </h1>
              <p className="text-lg text-gray-600">
                Transform Your Space with AI
              </p>
              <p className="text-sm text-gray-400 mt-2">
                학번: 2021810019 | 이름: 김주완
              </p>
            </div>

            {/* Get Started Button */}
            <div className="flex justify-center mb-8">
              <Link href="/dashboard" className="btn btn-primary gap-2">
                Get started
              </Link>
            </div>

            {/* Main Image */}
            <div className="flex justify-center mb-16">
              <Image src={'/group.png'} alt="mockup" width={1000} height={600} className="rounded-lg shadow-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
