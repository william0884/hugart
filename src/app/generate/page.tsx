"use client";

import React, { useState } from "react";
import Image from 'next/image';

const Page = () => {
  const [responseData, setResponseData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [usedImages, setUsedImages] = useState<string[]>([]);
  const [formValue, setFormValue] = useState<string>("");

  const handleButtonClick = async () => {
    setLoading(true);
    setError(null);
    setResponseData(null);

    try {
      const response = await fetch("/api/hugmorty", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setResponseData(data);
      setImages([...images, data.url]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!responseData || !responseData.url) {
      alert("No image generated to submit.");
      return;
    }

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: responseData.url,
          inputData: formValue,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      alert("Data submitted successfully!");
      console.log(result);
    } catch (error: any) {
      alert("Failed to submit data.");
      console.error(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue(e.target.value);
  };

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#4b0082] to-[#690060] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <button
          onClick={handleButtonClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? "Loading..." : "Generate"}
        </button>
        {error && <p className="mt-4 text-red-500">{error}</p>}
        {responseData && (
          <div className="mt-4 p-4 bg-gray-800 rounded">
            <Image
              src={responseData.url}
              width={500}
              height={500}
              alt="Generated Image"
              className="max-w-full h-auto"
            />
            <p className='text-white'>Here is the generated image! It is added to Gallery. Now generate another!</p>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(responseData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
};

export default Page;
