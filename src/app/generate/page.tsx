"use client";

import React, { useState } from "react";
import Image from "next/image";

const Page = () => {
  const [responseData, setResponseData] = useState<object | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to handle the POST request
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
        body: JSON.stringify({}), // Add any required data here
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setResponseData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">HugMorty API Example</h1>
      <button
        onClick={handleButtonClick}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Loading..." : "Fetch Data"}
      </button>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {responseData && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(responseData, null, 2)}
          </pre>
          <img
            src={responseData.url}
            width={500}
            height={500}
            alt="Picture of the author"
          />
        </div>
      )}
    </div>
  );
};

export default Page;
