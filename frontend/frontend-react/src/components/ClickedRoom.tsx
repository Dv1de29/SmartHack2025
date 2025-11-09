
import { click } from "@testing-library/user-event/dist/click";
import { roomType } from "../assets/types";

import { capitalizeFirstLetter } from "../assets/utils";
import { useState } from "react";

interface ClickedRoomProps{
    clicked: roomType,
    setClicked: (room: roomType | null) => void,
}

function ClickedRoom({clicked, setClicked} : ClickedRoomProps){
    const [ bookingLoading, setBookingLoading ] = useState(false);
    const [ bookingError, setBookingError ] = useState<string | null>(null);

    const handleBookBtn = async (room: roomType) => {
        setBookingLoading(true);
        setBookingError(null);
        
        // 1. Get Authentication Token
        const token = localStorage.getItem('authToken');
        if (!token) {
            setBookingError("Utilizatorul nu este autentificat.");
            setBookingLoading(false);
            return;
        }

        // 2. Define the API endpoint and payload
        const apiUrl = '/api/book-room'; // Replace with your actual API endpoint
        const payload = {
            roomId: room.id,
            // You would typically add dates, times, and userId here
            startTime: new Date().toISOString(),
            durationMinutes: 60, 
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include the stored token
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                // Try to read a detailed error message from the response body if available
                const errorData = await response.json();
                throw new Error(errorData.message || `Eroare la rezervare (Statut: ${response.status})`);
            }

            // 3. Success handling: Close the detail view and potentially refresh the room list
            console.log(`Rezervare reușită pentru camera: ${room.name}`);
            
            // In a real app, you'd likely dispatch an action to refresh the parent component's room list
            alert(`Camera ${room.name} a fost rezervată cu succes!`); // Use a custom modal in a non-toy app
            setClicked(null); // Close the modal/detail view

        } catch (err) {
            console.error("Booking failed:", err);
            setBookingError(err instanceof Error ? err.message : "A apărut o eroare necunoscută la rezervare.");
        } finally {
            setBookingLoading(false);
        }
    }

    return (
        <>
            <div className="clicked-room-cont">
                <button className="close-btn" onClick={() => setClicked(null as any)}>X</button>
                <h2>{clicked.name}</h2>
                <p className="room-detail-type">
                    Tip: {capitalizeFirstLetter(clicked.type)}
                </p>
                <p className="room-detail-capacity">
                    Capacitate: {clicked.capacity}
                </p>
                    
                <h4>Facilități:</h4>
                <div className="room-facilities detail-facilities">
                    {clicked.facilities.map((facility, index) => (
                        <span key={index} className="facility-tag">{facility}</span>
                    ))}
                </div>
                    
                <div className="detail-status-section">
                     <span className={`status-badge ${clicked.isAvailable ? 'status-available' : 'status-occupied'}`}>
                        {clicked.isAvailable ? 'Disponibil' : 'Ocupat'}
                    </span>
                    <button
                        className="book-btn" 
                        disabled={!clicked.isAvailable}
                        onClick={() => handleBookBtn(clicked)}
                    >
                        Rezervă Loc
                    </button>
                </div>
            </div>
        </>
    )
}

export default ClickedRoom;