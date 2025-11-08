import React, { useState, useMemo, useEffect } from "react";
import "../styles/HomePage.css";

import axios from "axios";

type Office = {
  id: number;
  name: string;
  address: string;
  capacity: number;
  priceHr: number;
  priceDay: number;
  amenities: string[];
  type: string;
  markerIcon: string; // emoji or icon class
};

const offices: Office[] = [
  {
    id: 1,
    name: "Downtown Executive Suite",
    address: "123 Market St, San Francisco, CA",
    capacity: 4,
    priceHr: 45,
    priceDay: 300,
    amenities: ["WiFi", "Coffee", "Printer", "Projector", "Parking"],
    type: "private",
    markerIcon: "🏢",
  },
  {
    id: 2,
    name: "Startup Hub",
    address: "456 Mission St, San Francisco, CA",
    capacity: 6,
    priceHr: 30,
    priceDay: 200,
    amenities: ["WiFi", "Coffee", "Whiteboard"],
    type: "shared",
    markerIcon: "🤝",
  },
  // add more offices...
];

function HomePage() {
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [email, setEmail] = useState("david.barbu2005@gmail.com"); // example initial value
  const [password, setPassword] = useState("david.barbu2005");

  const filteredOffices = useMemo(() => {
    return offices.filter((office) => {
      const matchesType = typeFilter === "all" || office.type === typeFilter;
      const matchesSearch =
        office.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        office.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [searchQuery, typeFilter]);


useEffect(() => {
  const getData = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "david.barbu2005@gmail.com",
        password: "david.barbu2005",
      }),
    });
      const data = await res.json();
      console.log(data); // this is your room list
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  getData();
}, []);
  return (
    <div className="homepage-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search offices..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">All Types</option>
          <option value="private">Private Office</option>
          <option value="shared">Shared Office</option>
        </select>
      </div>

      <div className="main-grid">
        <div className="map-grid">
          {filteredOffices.map((office) => (
            <div
              key={office.id}
              className={`marker ${selectedOffice?.id === office.id ? "selected" : ""}`}
              onClick={() => setSelectedOffice(office)}
            >
              {office.markerIcon}
            </div>
          ))}
        </div>

        <div className="office-panel">
          {offices.map( off => (
            <div className="office-card">
              <h2>{off.name}</h2>
              <p>{off.address}</p>
              <p>Capacity: {off.capacity} people</p>
              <p>
                ${off.priceHr}/hr · ${off.priceDay}/day
              </p>
              <div className="amenities">
                {off.amenities.slice(0, 3).map((a) => (
                  <span key={a} className="amenity">
                    {a}
                  </span>
                ))}
                {off.amenities.length > 3 && (
                  <span className="amenity">+{off.amenities.length - 3} more</span>
                )}
              </div>
            </div>
          ))
          }
        </div>
      </div>
    </div>
  );
}


export default HomePage;
