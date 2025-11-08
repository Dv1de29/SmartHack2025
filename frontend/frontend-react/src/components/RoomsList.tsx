import React from 'react';
import '../styles/RoomsList.css';
import { roomType } from '../assets/types';

interface RoomsListProps {
    rooms: roomType[];
}

const RoomsList: React.FC<RoomsListProps> = ({ rooms }) => {
    return (
        <div className="room-list-container">
            {rooms.length > 0 ? (
                // 1. If rooms exist, map over them to render the cards.
                rooms.map(room => (
                    <div key={room.id} className={`room-card ${room.isAvailable ? 'available' : 'occupied'}`}>
                        <div className="room-info">
                            <h3>{room.name}</h3>
                            <div className="room-meta">
                                <span className="room-type">
                                    {/* Icon based on type */}
                                    {room.type === 'meeting' && <MeetingRoomIcon />}
                                    {room.type === 'office' && <DeskIcon />}
                                    {room.type === 'phone-booth' && <PhoneBoothIcon />}
                                    {capitalizeFirstLetter(room.type)}
                                </span>
                                <span className="room-capacity">
                                    <UsersIcon /> {room.capacity} Persoane
                                </span>
                            </div>
                            <div className="room-facilities">
                                {room.facilities.map((facility, index) => (
                                    <span key={index} className="facility-tag">{facility}</span>
                                ))}
                            </div>
                        </div>
                        <div className="room-status">
                            <span className={`status-badge ${room.isAvailable ? 'status-available' : 'status-occupied'}`}>
                                {room.isAvailable ? 'Disponibil' : 'Ocupat'}
                            </span>
                            <button className="book-btn" disabled={!room.isAvailable}>
                                Rezervă
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                // 2. If no rooms exist (length is 0), show the No Results message.
                <div className="no-results">
                    Nu s-au găsit spații conform filtrelor selectate.
                </div>
            )}
        </div>
    );
};

export default RoomsList;

// --- Helper Functions & Local Icons ---

function capitalizeFirstLetter(string: string) {
    // Handles standard strings and hyphenated strings like 'phone-booth' -> 'Phone booth'
    return string.charAt(0).toUpperCase() + string.slice(1).replace(/-/g, ' ');
}

const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const DeskIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="12" width="20" height="8" rx="2"></rect><path d="M6 12V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8"></path></svg>);
const MeetingRoomIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>);
const PhoneBoothIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>);