import React, { useMemo, useState } from "react";
// Assuming you have map.svg in assets now
import MapImage from '../assets/MapImage.png' 
// 
import OfficeImage from '../assets/Office.png'
import MeetingImage from '../assets/Meeting.png'
import Meeting4Image from '../assets/Meeting4.png'
import RelaxImage from '../assets/Relax.png'

import '../styles/MapComp.css'


import COORDS_DATA from '../assets/coordinates.json'; 
import { roomType } from "../assets/types";

// --- TYPE DEFINITIONS ---
interface HotspotType {
  id: string; // Must match roomType.id (e.g., "Desk A7")
  title: string;
  type: "office" | "meeting" | "relax";
  coords: {x: string, y: string}[]; 
  shape: "rect" | "poly";
}

interface SeatType {
  seat_id: string;
  is_available: boolean;
  coords: string;
}



interface MapCompProps {
  rooms: roomType[];
  selectedFilter: string;
  onlyAvailable: boolean;
}

// --- STATIC MAPPING DATA ---
// NOTE: This must be manually maintained to match the order of coordinates in coordinates.json
const STATIC_ROOM_IDS = [
    // Offices (40 coords = 20 desks)
    "Desk A7", "Desk A8", "Desk A9", "Desk A10", "Desk A11", 
    "Desk A12", "Desk A13", "Desk A14", "Desk A15", "Desk A16", 
    "Desk B1", "Desk B2", "Desk B3", "Desk B4", "Desk B5", 
    "Desk B6", "Desk B7", "Desk B8", "Desk B9", "Desk B10",
    // You must continue this list for all 20+20 offices (if the data is 80 coords long)
    // This example list only covers 20 desks. Extend as needed.
];

// --- HOTSPOT GENERATION ---

const generateFinalHotspots = (): HotspotType[] => {
  const finalHotspots: HotspotType[] = [];
  let officeIndex = 0;

  // Process Offices 
  for (let i = 0; i < COORDS_DATA.offices.length; i += 2) {
      if (i + 1 < COORDS_DATA.offices.length && officeIndex < STATIC_ROOM_IDS.length) {
          
          // CRITICAL CHANGE: Use the pre-defined ID from the STATIC_ROOM_IDS array
          const roomId = STATIC_ROOM_IDS[officeIndex] || `Office_Unknown_${officeIndex + 1}`;

          finalHotspots.push({
              id: roomId,
              title: roomId,
              type: "office",
              coords: [COORDS_DATA.offices[i], COORDS_DATA.offices[i+1]], 
              shape: "rect",
          });
          officeIndex++;
      }
  }

  // Process Meetings
  let meetingIndex = 0;
  for (let i = 0; i < COORDS_DATA.meetings.length; i += 2) {
      if (i + 1 < COORDS_DATA.meetings.length) {
          finalHotspots.push({
              id: `Meeting_Room_${meetingIndex + 1}`,
              title: `Meeting ${meetingIndex + 1}`,
              type: "meeting",
              coords: [COORDS_DATA.meetings[i], COORDS_DATA.meetings[i+1]],
              shape: "rect",
          });
          meetingIndex++;
      }
  }

  // Process Relaxation
  if (COORDS_DATA.relaxation.length >= 3) {
      finalHotspots.push({
          id: "Relaxation_Area",
          title: "Zonă Relaxare",
          type: "relax",
          coords: COORDS_DATA.relaxation,
          shape: "poly",
      });
  }

  return finalHotspots;
};

const ALL_HOTSPOTS = generateFinalHotspots();
// --- END HOTSPOT GENERATION ---


// --- STYLING FUNCTIONS (Omitted for brevity, assumed unchanged) ---
const mockDeskSeats = (deskId: string): SeatType[] => [
  { seat_id: `${deskId}-S1`, is_available: true, coords: "50,50,150,100" },
  { seat_id: `${deskId}-S2`, is_available: false, coords: "50,120,150,170" },
  { seat_id: `${deskId}-S3`, is_available: true, coords: "50,190,150,240" },
  { seat_id: `${deskId}-S4`, is_available: true, coords: "350,50,450,100" },
  { seat_id: `${deskId}-S5`, is_available: false, coords: "350,120,450,170" },
  { seat_id: `${deskId}-S6`, is_available: true, coords: "350,190,450,240" },
];

const calculateHotspotStyle = (hotspot: HotspotType): React.CSSProperties => {
  const { coords, shape } = hotspot;
  
  if (shape === "rect" && coords.length >= 2) {
    const x1 = parseFloat(coords[0].x);
    const y1 = parseFloat(coords[0].y);
    const x2 = parseFloat(coords[1].x);
    const y2 = parseFloat(coords[1].y);
    
    const finalX1 = Math.min(x1, x2);
    const finalY1 = Math.min(y1, y2);
    
    let width = Math.abs(x2 - x1);
    let height = Math.abs(y2 - y1);
    
    const MIN_SIZE = 0.05; 
    width = Math.max(width, MIN_SIZE);
    height = Math.max(height, MIN_SIZE);
    
    return {
      left: `${finalX1}%`,
      top: `${finalY1}%`,
      width: `${width}%`,
      height: `${height}%`,
      clipPath: 'none', 
    };
  }

  if (shape === "poly" && coords.length >= 3) {
    const polyString = coords.map(p => `${p.x}% ${p.y}%`).join(', ');
    
    const minX = Math.min(...coords.map(p => parseFloat(p.x)));
    const minY = Math.min(...coords.map(p => parseFloat(p.y)));
    const maxX = Math.max(...coords.map(p => parseFloat(p.x)));
    const maxY = Math.max(...coords.map(p => parseFloat(p.y)));

    return {
      left: `${minX}%`,
      top: `${minY}%`,
      width: `${maxX - minX}%`,
      height: `${maxY - minY}%`,
      clipPath: `polygon(${polyString})`,
    };
  }
  
  return { display: 'none' };
};

const calculateSeatStyle = (coords: string): React.CSSProperties => {
  const SEAT_REF_WIDTH = 500; 
  const [x1, y1, x2, y2] = coords.split(",").map(Number);
  const width = x2 - x1;
  const height = y2 - y1;
  return {
    left: `${(x1 / SEAT_REF_WIDTH) * 100}%`,
    top: `${(y1 / SEAT_REF_WIDTH) * 100}%`,
    width: `${(width / SEAT_REF_WIDTH) * 100}%`,
    height: `${(height / SEAT_REF_WIDTH) * 100}%`,
  };
};

const handleRezerve = () => {
  console.log("Reserve button clicked!");
}


interface MapCompProps{
  rooms: roomType[],
  selectedFilter: string,
  onlyAvailable: boolean,
}

// --- MAIN COMPONENT ---
const MapComp: React.FC<MapCompProps> = ({ rooms, selectedFilter, onlyAvailable }: MapCompProps) => {
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
  const [zoomData, setZoomData] = useState<{ deskId: string; seats: SeatType[]; type: string } | null>(null);
  
  const [coordinateeeeees, setCoordinateeeeees] = useState<{x: string, y: string}[]>([]); 

  // 1. Create Lookup Map from the rooms prop (Now works because IDs match)
  const roomStatusMap = useMemo(() => {
    return rooms.reduce((acc, room) => {
      acc[room.id] = room;
      return acc;
    }, {} as Record<string, roomType>);
  }, [rooms]);

  // 2. Filter Hotspots based on filter state and room availability
  const ALL_HOTSPOTS = useMemo(() => {
  const generated = generateFinalHotspots();

  if (!rooms || rooms.length === 0) return generated; // fallback for testing

  const typeBuckets = {
    office: rooms.filter(r => r.type === "office"),
    meeting: rooms.filter(r => r.type === "meeting"),
    relax: rooms.filter(r => r.type === "relaxation"),
  };

  const result: HotspotType[] = [];
  const typeCounter: Record<string, number> = { office: 0, meeting: 0, relax: 0 };

  for (const spot of generated) {
    const idx = typeCounter[spot.type];
    const match = typeBuckets[spot.type][idx];
    typeCounter[spot.type]++;

    if (match) {
      result.push({
        ...spot,
        id: match.id.toString(),
        title: match.name,
        type: match.type as "office" | "meeting" | "relax",
      });
    }
  }

  return result;
}, [rooms]);
 

  const handleHotspotClick = (hotspot: HotspotType) => {
    setSelectedHotspotId(hotspot.id);
    if (hotspot.type) {
      setZoomData({ deskId: hotspot.id, seats: mockDeskSeats(hotspot.id), type: hotspot.type });
    } else {
        setZoomData(null); 
    }
  };
  
  const handleMapClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const rect = img.getBoundingClientRect(); 
    
    const x = Math.round(e.clientX - rect.left); 
    const y = Math.round(e.clientY - rect.top); 
    
    const xPercent = ((x / rect.width) * 100).toFixed(4);
    const yPercent = ((y / rect.height) * 100).toFixed(4);

    const newCoords = {x: xPercent, y: yPercent};
    
    setCoordinateeeeees(prev => [...prev, newCoords]);
  }

  const showedHotspots = useMemo(() => {
  return ALL_HOTSPOTS.filter((hotspot) => {
    const matchType = selectedFilter === "all" || selectedFilter === hotspot.type;

    if (onlyAvailable) {
      const roomData = roomStatusMap[hotspot.id];
      return matchType && roomData?.isAvailable;
    }
    return matchType;
  });
}, [ALL_HOTSPOTS, selectedFilter, onlyAvailable, roomStatusMap]);


  console.log(showedHotspots)
  return (
    <div className="map-wrapper">
      <div className="office-map-container">
        <img 
          src={MapImage} 
          alt="Office Floor Plan" 
          className="office-floor-plan-image" 
          onClick={handleMapClick}
        />
        {showedHotspots.map((hotspot) => {
          console.log(hotspot)
          const roomData = roomStatusMap[hotspot.id];
          
          // 3. Determine Status Class based on roomData lookup
          const statusClass = roomData
            ? roomData.isAvailable
              ? "available"
              : "reserved"
            : "unknown"; // "unknown" if the ID exists in ALL_HOTSPOTS but not in the rooms prop

          return (
            <div
              key={hotspot.id}
              // 4. INCLUDE statusClass in the className list
              className={`hotspot-area ${hotspot.type} ${statusClass} ${
                selectedHotspotId === hotspot.id ? "selected" : ""
              }`}
              style={calculateHotspotStyle(hotspot)} 
              onClick={(e) => {
                  e.stopPropagation(); 
                  handleHotspotClick(hotspot);
              }}
              title={hotspot.title}
            >
                {/* Hotspot content */}
            </div>
          );
        })}
      </div>

      {zoomData && (
        <div className="desk-zoom-container">
          <h3>{zoomData.deskId.replace(/_/g, ' ')} Seats</h3>
          <div className="seat-map">
            { zoomData.type === "office" && (<img src={OfficeImage} alt="Office Layout" />)}
            { zoomData.type === "meeting" && (<img src={MeetingImage} alt="Meeting Room Layout" />)}
            { zoomData.type === "relax" && (<img src={RelaxImage} alt="Relaxation Area Layout" />)}
            
            {/* Render mock seats only for the office zoom type */}
            { zoomData.type === "office" && zoomData.seats.map((seat) => (
              <div
                key={seat.seat_id}
                className={`seat ${seat.is_available ? "available" : "reserved"}`}
                style={calculateSeatStyle(seat.coords)}
                title={seat.seat_id}
              />
            ))}
          </div>
          <div className="btns">
                <button onClick={() => {setZoomData(null); setSelectedHotspotId(null)}}>Back to Map</button>
                <button onClick={handleRezerve}>Reserve</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComp;