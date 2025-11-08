import { useState, useMemo } from "react";

import '../styles/HomePage.css'

type Office = {
  id: number;
  name: string;
  address: string;
  type: string;
  available: boolean;
};

const offices: Office[] = [
  { id: 1, name: "Downtown Office", address: "123 Main St", type: "small", available: true },
  { id: 2, name: "Uptown Office", address: "456 High St", type: "large", available: false },
  { id: 3, name: "Midtown Office", address: "789 Center Ave", type: "medium", available: true },
];

function HomePage() {
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
  const [bookingOffice, setBookingOffice] = useState<Office | null>(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOffices = useMemo(() => {
    return offices.filter((office) => {
      const matchesType = typeFilter === "all" || office.type === typeFilter;
      const matchesSearch =
        office.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        office.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [typeFilter, searchQuery]);

  return (
    <div className="container">
      <div className="header">
        <h1>Find Your Perfect Office Space</h1>
        <p>Browse and book flexible office spaces across the city</p>
      </div>

      <div className="filters">
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">All Types</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>

        <input
          type="text"
          placeholder="Search offices..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="main-grid">
        <div className="map">
          <div className="map-placeholder">
            {selectedOffice ? `Selected: ${selectedOffice.name}` : "Map Placeholder"}
          </div>
        </div>

        <div className="office-list">
          {filteredOffices.length === 0 && (
            <p className="no-offices">No offices found matching your criteria</p>
          )}

          {filteredOffices.map((office) => (
            <div
              key={office.id}
              className={`office-card ${selectedOffice?.id === office.id ? "selected" : ""}`}
            >
              <h2>{office.name}</h2>
              <p>{office.address}</p>
              <p>Type: {office.type}</p>
              <p>Available: {office.available ? "Yes" : "No"}</p>

              <button onClick={() => setSelectedOffice(office)}>Select</button>
              {office.available && (
                <button onClick={() => setBookingOffice(office)}>Book</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {bookingOffice && (
        <div className="booking-dialog">
          <div className="booking-content">
            <h3>Booking {bookingOffice.name}</h3>
            <p>{bookingOffice.address}</p>
            <button onClick={() => setBookingOffice(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
