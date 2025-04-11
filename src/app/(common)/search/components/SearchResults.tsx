"use client";
// src/app/(common)/search/components/SearchResults.tsx
import useFetchSearchResults from "@/hooks/api/useFetchSearchResults";
import React from "react";

interface SearchResultsProps {
  query: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ query }) => {
  const { results, loading, error, fetchMore } = useFetchSearchResults(query);

  if (loading)
    return <div className="my-4 text-center">Loading results...</div>;
  if (error)
    return (
      <div className="my-4 text-center text-red-500">
        Error loading results: {error.message}
      </div>
    );

  return (
    <div className="my-8">
      <h2 className="text-xl font-semibold mb-4">Search Results</h2>

      {results.length === 0 ? (
        <div className="text-center text-gray-500">
          {query
            ? "No results found. Try a different search term."
            : "Enter a search term to see results."}
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result) => (
            <div
              key={`${result.type}-${result.id}`}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              {result.type === "therapist" ? (
                <div className="flex items-start">
                  {result.profilePicture && (
                    <div className="flex-shrink-0 mr-4">
                      <img
                        src={result.profilePicture}
                        alt={result.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">{result.name}</h3>
                    {result.rating && (
                      <div className="text-yellow-500">
                        Rating: {result.rating}
                      </div>
                    )}
                    {result.bio && (
                      <p className="text-sm text-gray-600 mt-1">
                        {result.bio.substring(0, 100)}...
                      </p>
                    )}
                    {result.services && result.services.length > 0 && (
                      <p className="text-sm font-medium mt-1">
                        From {result.services[0]?.price || "N/A"}{" "}
                        {result.services[0]?.currency || "JPY"}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-start">
                  {result.thumbnailUrl && (
                    <div className="flex-shrink-0 mr-4">
                      <img
                        src={result.thumbnailUrl}
                        alt={result.title}
                        className="w-24 h-16 rounded object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">{result.title}</h3>
                    {result.category && (
                      <div className="text-sm text-blue-500">
                        {result.category}
                      </div>
                    )}
                    {result.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {result.description.substring(0, 100)}...
                      </p>
                    )}
                    {result.location && (
                      <p className="text-xs text-gray-500 mt-1">
                        {result.location}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {results.length >= 10 && (
            <button
              onClick={fetchMore}
              className="w-full py-2 border border-gray-300 rounded-md text-center text-gray-600 hover:bg-gray-50"
            >
              Load more results
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
