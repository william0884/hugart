"use client";

import React, { useState } from "react";

const Page = () => {
  const [responseData, setResponseData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [usedImages, setUsedImages] = useState<string[]>([]);
  const [formValue, setFormValue] = useState<string>("");

  // Function to handle the POST request to fetch data
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
            alt="Generated Image"
          />
        </div>
      )}

      {/* Form to submit additional input with the image URL */}
      <form onSubmit={handleFormSubmit} className="mt-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Additional Input
          </label>
          <input
            type="text"
            value={formValue}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Page;
