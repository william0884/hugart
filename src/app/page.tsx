'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';



export default function Home() {
  const images = [
    'https://dc907dsvybtiecmv.public.blob.vercel-storage.com/1725443352273-JAU55cUfBAid2dP70rDmCbSvKkj9Vp.png',
    // Add more image URLs here
    'https://dc907dsvybtiecmv.public.blob.vercel-storage.com/1725443753426-oft5VdozvFNKlBd4EK2FVz5AUmXUSI.png',
    'https://dc907dsvybtiecmv.public.blob.vercel-storage.com/1725443845929-We6vgb7qjAMSLijQ42Z2TE0a6gBX4M.png',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);


  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#4b0082] to-[#690060] text-white">
      <div className="container flex flex-col items-center justify-center gap-6 px-4 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Hugart
        </h1>

        <p className='text-white text-2xl'>Generate AI images with a Rick and Morty influence.</p>
        <p className='text-white text-xl'>Some examples we prepared eariler:</p>
        <Image
          src={images[currentImageIndex]!}
          width={500}
          height={500}
          alt={`Generated Image ${currentImageIndex + 1}`}
          className="max-w-full h-auto"
        />

        <p className='text-white text-xl'>Created with data from <a className='text-blue-300' href="https://rickandmortyapi.com/">Rick and Morty API</a></p>
      </div>
    </main>
  );
}