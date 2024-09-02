"use client";
import React, { useEffect, useState } from "react";
import { drizzle } from "drizzle-orm/neon-http";

import { neon } from "@neondatabase/serverless";
import { generatedTable } from "../../../database/schema";
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const Test = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data...");
        const result = await db.select().from(generatedTable);
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Data from Database</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <strong>Sentence:</strong> {item.sentence} <br />
            <strong>URL:</strong> {item.url} <br />
            <strong>Character ID:</strong> {item.charId}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Test;
