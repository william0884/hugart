"use client";

import React, { useEffect, useState } from "react";
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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Gallery</h1>
      <ul className="space-y-6">
        {data.map((item) => (
          <li
            key={item.id}
            className="p-4 bg-white border rounded-lg shadow-md flex flex-col items-start"
          >
            <strong className="text-lg font-semibold">Sentence:</strong>{" "}
            <p className="mb-2 text-gray-700">{item.sentence}</p>
            <strong className="text-lg font-semibold">Image Describe:</strong>{" "}
            <p className="mb-2 text-gray-700">{item.imgdescribe}</p>
            {item.url ? (
              <img
                src={getImageUrl(item.url)}
                alt={`Generated image for ID: ${item.id}`}
                className="mt-2 mb-2 rounded-lg border border-gray-300"
                width={480}
              />
            ) : (
              <p className="text-gray-500">No image available</p>
            )}
            <strong className="text-lg font-semibold">Character ID:</strong>{" "}
            <p className="text-gray-700">{item.charId}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
