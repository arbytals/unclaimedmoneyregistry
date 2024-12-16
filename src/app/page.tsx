"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoneySidebar } from "@/components/sideComponent";
import { Loader2 } from "lucide-react";
import type {
  SearchResult,
  SearchParams,
  SearchResponse,
  SearchError,
  FormData,
} from "@/types/search";

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    companyName: "",
  });

  const handleSearch = async (e: React.FormEvent, isCompany: boolean) => {
    e.preventDefault();
    setError(null);

    // Construct search parameters based on search type
    const searchData: SearchParams = isCompany
      ? { companyName: formData.companyName || "" }
      : {
          firstName: formData.firstName || "",
          lastName: formData.lastName || "",
        };

    // Validation
    if (isCompany && !formData.companyName) {
      setError("Please provide a company name.");
      return;
    }
    if (!isCompany && (!formData.firstName || !formData.lastName)) {
      setError("Please provide both first and last names.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(searchData),
      });

      if (!response.ok) {
        // Handle potential error response
        const errorData: SearchError = await response.json();
        throw new Error(errorData.error || "Search failed. Please try again.");
      }

      const data: SearchResponse = await response.json();
      setResults(data.results || []);
      if (data.results.length === 0) setError("No results found.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="md:col-span-2 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <Image
              src="/australia1.png"
              alt="Australia"
              width={100}
              height={100}
            />
            <h1 className="text-2xl font-bold text-primaryBlue text-center">
              THE REGISTRY OF UNCLAIMED MONEY <br /> AUSTRALIA & NEW ZEALAND
            </h1>
            <Image
              src="/new-zealand.png"
              alt="New Zealand"
              width={100}
              height={100}
            />
          </div>

          {/* Info */}
          <div className="text-center space-y-2">
            <p className="text-sm">
              Our FREE search collaborates all of the information kept on
              Australian & New Zealand Government databases and makes it easy
              for you to find any money that is owing to you, your family or
              your friends.
            </p>
            <p className="text-sm">
              The Registry of Unclaimed Money specialises in searching for and
              finding unclaimed monies on behalf of people that believe they may
              possibly have money owing to them.
            </p>
          </div>
          {/* Forms */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Person Search */}
            <form
              onSubmit={(e) => handleSearch(e, false)}
              className="p-4 border-2 border-primaryBlue rounded-lg space-y-3">
              <h2 className="text-center text-primaryBlue font-bold">
                SEARCH BY NAME
              </h2>
              <Input
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
              <Input
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
              <Button
                className="bg-primaryYellow"
                type="submit"
                disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "SEARCH"}
              </Button>
            </form>

            {/* Company Search */}
            <form
              onSubmit={(e) => handleSearch(e, true)}
              className="p-4 border-2 border-primaryBlue rounded-lg space-y-3">
              <h2 className="text-center text-primaryBlue font-bold">
                SEARCH BY COMPANY
              </h2>
              <Input
                placeholder="Company Name"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
              />
              <Button
                className="bg-primaryYellow"
                type="submit"
                disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "SEARCH"}
              </Button>
            </form>
          </div>

          {/* Results */}
          {error && <div className="text-red-500">{error}</div>}

          {results.length > 0 && (
            <div className="space-y-4">
              {results.map((result, idx) => (
                <div key={idx} className="p-4 border rounded-lg shadow-md">
                  <h3 className="font-extrabold text-primaryBlue py-4">
                    {result.name}
                  </h3>
                  <p className="font-semibold">
                    Amount:{" "}
                    <span className="text-primaryYellow">
                      ${result.amount.toFixed(2)}
                    </span>
                  </p>
                  {result.address && (
                    <p className="text-primaryBlue">
                      <span className="font-semibold text-black">
                        Last Known Address:
                      </span>{" "}
                      {result.address}
                    </p>
                  )}
                  <p>Type: {result.type}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <MoneySidebar />
      </div>
    </main>
  );
}
