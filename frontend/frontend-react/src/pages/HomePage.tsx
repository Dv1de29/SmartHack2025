import React, { useEffect, useMemo, useState } from 'react';
import '../styles/HomePage.css';

import { roomType } from '../assets/types';
import RoomsList from '../components/RoomsList';

const getRooms = async (url: string): Promise<roomType[]> => {
    try {
        const token = localStorage.getItem("token")
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // const response = await fetch(url);
        if (!response.ok) {
            const errorText = await response.text();
            if (errorText.trim().startsWith('<')) {
                 console.error(`Fetch path was likely incorrect. Check that '${url}' exists in the public directory.`);
            }
            throw new Error(`Error in fetching: ${response.status} ${response.statusText || 'Unknown Error'}`);
        }

        const data = await response.json();

        // 1. Determine the array source: If data is an array, use it directly. 
        // If it's an object, assume the array is inside data.results.
        const resultsArray = Array.isArray(data) ? data : data.results;

        // 2. CHECK for API Error Code (Only if data looks like an API wrapper object)
        if (!Array.isArray(data) && data.response_code !== undefined && data.response_code !== 0) {
             throw new Error(`API returned error code: ${data.response_code}`);
        }
        
        if (!Array.isArray(resultsArray)) {
            console.error("Data structure error: Expected an array of rooms.", data);
            return [];
        }
        
        // 3. Map the data using the correct property names from offices.json
        return resultsArray.map((room: any) => ({
            id: room.id,
            name: room.name,
            type: room.type, 
            capacity: room.capacity,
            facilities: room.facilities,
            // Assuming the boolean field is named 'isAvailable' in offices.json
            isAvailable: room.isAvailable, 
        }));

    } catch (error) {
        console.error("Failed to fetch rooms:", error);
        return [];
    }
};

const HomePage: React.FC = () => {
  const [ rooms, setRooms ] = useState<roomType[]>([])

  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const filters = [
    { id: "all", name: 'All', icon: <AllIcon /> },
    { id: "office", name: 'Office', icon: <DeskIcon /> },
    { id: "meeting", name: 'meeting', icon: <MeetingRoomIcon /> },
    { id: "phone-booth", name: 'Phone Booth', icon: <PhoneBoothIcon /> },
  ];

    useEffect(() => {
        const fetched = async () => {
            const tempRooms = await getRooms("/data.json");
            console.log(tempRooms)
            
            setRooms(tempRooms)
            
            if (tempRooms.length === 0) {
                console.warn("Warning: No rooms were loaded.");
            }
        }

        fetched();
    }, []);

    const showedRooms = useMemo(() => {
        return rooms.filter((room) => {
            const matchFilter = selectedFilter === "all" || selectedFilter === room.type
            const matchAvailable = !onlyAvailable || room.isAvailable

            return matchFilter && matchAvailable
        })
    }, [selectedFilter, onlyAvailable, rooms])


  return (
    <div className="home-page">
      <header className="home-header">
        <div className="header-content">
          <div className="logo-title">
            <BuildingIcon className="header-icon" />
            <h1>Rezervare Spații de Lucru</h1>
          </div>
          <p className="header-subtitle">
            Alege biroul sau sala de meeting perfectă pentru tine din planul etajului
          </p>
        </div>
      </header>

      <div className="controls-container">
        <div className="filters-wrapper">
          <div className="type-filters">
            {filters.map((filter) => (
              <button
                key={filter.name}
                className={`filter-btn ${
                  selectedFilter === filter.name ? 'active' : ''
                }`}
                onClick={() => setSelectedFilter(filter.id)}
              >
                {filter.icon}
                {filter.name}
              </button>
            ))}
          </div>
          <div className="availability-filter">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
              />
              <span className="checkmark"></span>
              Doar disponibile
            </label>
          </div>
        </div>

        <div className="view-toggle-container">
          <div className="view-toggle">
            <button
              className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
              onClick={() => setViewMode('map')}
            >
              Hartă Etaj
            </button>
            <button
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              Listă
            </button>
          </div>
        </div>
      </div>

      <main className="content-area">
        {/* Content will go here based on viewMode */}
        {viewMode === 'map' && (<></>)}
        {viewMode === 'list' && (
            <RoomsList rooms={showedRooms}/>
        )}
      </main>
    </div>
  );
};

export default HomePage;

// --- Simple SVG Components for demonstration ---
const AllIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const DeskIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="12" width="20" height="8" rx="2"></rect>
    <path d="M6 12V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8"></path>
  </svg>
);

const MeetingRoomIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const PhoneBoothIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const BuildingIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <path d="M9 22v-4h6v4"></path>
    <path d="M8 6h.01"></path>
    <path d="M16 6h.01"></path>
    <path d="M12 6h.01"></path>
    <path d="M12 10h.01"></path>
    <path d="M12 14h.01"></path>
    <path d="M16 10h.01"></path>
    <path d="M16 14h.01"></path>
    <path d="M8 10h.01"></path>
    <path d="M8 14h.01"></path>
  </svg>
);