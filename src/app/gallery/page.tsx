"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
export const dynamic = 'force-dynamic';

const Page = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data...");
        const response = await fetch("/api/fetch-data");
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        console.log("Fetched data:", result);
        setData(result);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add this function inside the Page component
  const getImageUrl = (url: string) => {
    return `${url}?t=${new Date().getTime()}`;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#4b0082] to-[#690060] text-white">
      <div className="container flex flex-col items-center justify-center gap-6 px-4 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Gallery
        </h1>
          <ul className="space-y-6">
          {data.map((item) => (
            <li
              key={item.id}
              className="p-4 bg-gray-700 border rounded-lg shadow-md flex flex-col items-start"
            >
              <strong className="text-lg font-semibold">Sentence:</strong>{" "}
              <p className="mb-2 text-white">{item.sentence}</p>
              <strong className="text-lg font-semibold">Image Describe:</strong>{" "}
              <p className="mb-2 text-white">{item.imgdescribe}</p>
              {item.url ? (
                <Link href={`/gallery/${item.id}`} passHref>
                  <Image
                    src={getImageUrl(item.url)}
                    alt={`Generated image for ID: ${item.id}`}
                    width={480}
                    height={480}
                    className="mt-2 mb-2 rounded-lg border border-gray-300 cursor-pointer"
                  />
                </Link>
              ) : (
                <p className="text-gray-500">No image available</p>
              )}
              <strong className="text-lg font-semibold">Character ID:</strong>{" "}
              <p className="text-white">{item.charId}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default Page;
