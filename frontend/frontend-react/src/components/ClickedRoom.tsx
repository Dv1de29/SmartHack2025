import { roomType } from "../assets/types";
import { capitalizeFirstLetter } from "../assets/utils";
import { useState } from "react";

interface ClickedRoomProps {
  clicked: roomType;
  setClicked: (room: roomType | null) => void;
}

function ClickedRoom({ clicked, setClicked }: ClickedRoomProps) {
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const handleBookBtn = async (room: roomType) => {
    setBookingLoading(true);
    setBookingError(null);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setBookingError("Utilizatorul nu este autentificat.");
      setBookingLoading(false);
      return;
    }

    const apiUrl = "http://localhost:8000/api/bookings/";
    const payload = {
      employee: parseInt(localStorage.getItem("employee_id") || "0"),
      room: room.id,
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 60 * 60000).toISOString(),
      number_of_participants: 1,
      status: "pending",
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.detail || `Eroare la rezervare (Statut: ${response.status})`);
        } else {
          throw new Error(`Server error: ${response.status} — ${response.statusText}`);
        }
      }

      alert(`Camera ${room.name} a fost rezervată cu succes!`);
      setClicked(null);
    } catch (err) {
      console.error("Booking failed:", err);
      setBookingError(err instanceof Error ? err.message : "A apărut o eroare necunoscută la rezervare.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="clicked-room-cont">
      <button className="close-btn" onClick={() => setClicked(null)}>X</button>
      <h2>{clicked.name}</h2>
      <p className="room-detail-type">Tip: {capitalizeFirstLetter(clicked.type)}</p>
      <p className="room-detail-capacity">Capacitate: {clicked.capacity}</p>

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
          disabled={!clicked.isAvailable || bookingLoading}
          onClick={() => handleBookBtn(clicked)}
        >
          {bookingLoading ? "Se rezervă..." : "Rezervă Loc"}
        </button>
        {bookingError && <p className="error-text">{bookingError}</p>}
      </div>
    </div>
  );
}

export default ClickedRoom;
