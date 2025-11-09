import React, { useEffect, useState } from 'react';
import '../styles/Requests.css';

import { capitalizeFirstLetter } from '../assets/utils';


interface Booking {
  id: string;
  employeeName: string;
  roomName: string;
  startTime: string,
  endTime: string,
  nr_participants: number,
  status: string,
  created_at: string,
}

function Requests() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchPendingBookings = async () => {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        setError("Nu ești autentificat. Te rugăm să te conectezi.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8000/api/bookings/pending/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch bookings: ${response.status}`);
        }

        const data = await response.json();
        console.log("Pending bookings from API:", data);

        const transformedBookings: Booking[] = data.map((apiBooking: any) => {

          return {
            id: apiBooking.id.toString(),
            employeeName: `Employee ${apiBooking.employee.toString()}`,
            roomName: `Room ${apiBooking.room}`,
            startTime: apiBooking.start_time,
            endTime: apiBooking.end_time,
            nr_participants: data.number_of_participants,
            status: apiBooking.status,
          };
        });

        setBookings(transformedBookings);
        setError(null);
        
      } catch (err) {
        console.error("Error fetching pending bookings:", err);
        setError(err instanceof Error ? err.message : "A apărut o eroare la încărcarea cererilor.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingBookings();
  }, []);

  const updateBookingStatus = async (id: string, status: string): Promise<void> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    console.error("No access token found");
    return;
  }

  try {
    const response = await fetch(`http://localhost:8000/api/bookings/${id}/update-status/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
        });

        if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to update status:", errorData);
        } else {
        const data = await response.json();
        console.log("Status updated:", data);
        }
    } catch (error) {
        console.error("Error updating booking status:", error);
    }
    };


  return (
    <div className="requests-container">
      {loading && <div className="loading">Se încarcă cererile...</div>}
      {error && <div className="error-message">{error}</div>}

      {/* --- Modal for selected booking --- */}
      {selectedBooking && (
        <div className="clicked-room-cont">
          <button className="close-btn" onClick={() => setSelectedBooking(null)}>✕</button>
          <h2>{selectedBooking.roomName}</h2>
          <p className="room-detail-capacity">Booked by: {selectedBooking.employeeName}</p>
          <h4>Perioadă rezervare</h4>
          <p>
            {new Date(selectedBooking.startTime).toLocaleString()} — {new Date(selectedBooking.endTime).toLocaleString()}
          </p>
          <p className="room-detail-capacity">Nr. participanți: {selectedBooking.nr_participants}</p>
          <p className="room-detail-capacity">
            Creat la: {new Date(selectedBooking.created_at).toLocaleString()}
          </p>

          <div className="detail-status-section">
            <button className='accept-btn' onClick={() => updateBookingStatus(selectedBooking.id, "Approved")}>Accept</button>
            <button className='accept-btn' onClick={() => updateBookingStatus(selectedBooking.id, "Rejected")}>Close</button>
            <button className="book-btn" onClick={() => setSelectedBooking(null)}>Close</button>
          </div>
        </div>
      )}

      {/* --- Booking list --- */}
      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <div
            key={booking.id}
            className={`room-card request-card status-${booking.status}`}
            onClick={() => setSelectedBooking(booking)}
          >
            <div className="room-info">
              <h3>{booking.roomName}</h3>
              <div className="room-meta">
                <span className="room-type">👤 {booking.employeeName}</span>
                <span className="room-capacity">🕒 {new Date(booking.startTime).toLocaleString()} — {new Date(booking.endTime).toLocaleString()}</span>
              </div>
              <div className="room-facilities">
                <span className="facility-tag">Participanți: {booking.nr_participants}</span>
              </div>
            </div>

            <div className="room-status">
              <span className={`status-badge status-${booking.status}`}>
                {capitalizeFirstLetter(booking.status)}
              </span>
            </div>
          </div>
        ))
      ) : (
        !loading && <div className="no-results">Nu există cereri de afișat.</div>
      )}
    </div>
  );
}

export default Requests;
