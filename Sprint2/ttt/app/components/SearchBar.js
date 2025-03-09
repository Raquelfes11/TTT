// app/components/SearchBar.js
import { useState } from "react";

export default function SearchBar({ handleSearch }) {
  const [query, setQuery] = useState("");

  return (
    <form onSubmit={(e) => handleSearch(e, query)} className="search-form">
      <input
        type="text"
        placeholder="Buscar productos..."
        name="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">Buscar</button>
    </form>
  );
}
