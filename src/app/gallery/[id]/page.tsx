"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const ImagePage = () => {
  const { id } = useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`/api/fetch-data/${id}`);
        if (!response.ok) throw new Error('Failed to fetch item');
        const result = await response.json();
        setItem(result);
      } catch (err: any) {
        console.error('Error fetching item:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!item) return <p>Item not found</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link href="/gallery" className="text-blue-500 hover:underline mb-4 block">
        &larr; Back to Gallery
      </Link>
      <h1 className="text-3xl font-bold mb-6">Image Details</h1>
      <div className="bg-white border rounded-lg shadow-md p-6">
        <img
          src={item.url}
          alt={`Generated image for ID: ${item.id}`}
          className="w-full mb-4 rounded-lg border border-gray-300"
        />
        <p className="mb-2"><strong>Sentence:</strong> {item.sentence}</p>
        <p className="mb-2"><strong>Image Description:</strong> {item.imgdescribe}</p>
        <p><strong>Character ID:</strong> {item.charId}</p>
      </div>
    </div>
  );
};

export default ImagePage;