import React, { useEffect, useState } from 'react';
import '../styles/Bookings.css';

// Interface for a simple booking item
interface Booking {
    id: string;
    roomName: string,
    type: string,
    date: string,
    start_time: string,
    end_time: string,
    time: string,
    nr_participants: number,
    status: 'Confirmed' | 'Pending' | 'Canceled';
}

interface APIBooking {
    id: number;
    employee: any;
    employee_id: number;
    room: {
        id: number;
        name: string;
        type: string;
        capacity: number;
        facilities: string[];
    };
    room_id: number;
    start_time: string;
    end_time: string;
    number_of_participants: number;
    status: string;
}

// Mock function to simulate fetching a user's bookings from an API
// const fetchBookings = async (): Promise<Booking[]> => {
//     // In a real app, this would use fetch with an Authorization header
//     return new Promise(resolve => {
//         setTimeout(() => {
//             resolve([
//                 { id: 'b-001', roomName: 'Sala Alpha', type: 'Meeting Room', date: '2025-11-15', time: '10:00 - 11:00', status: 'Confirmed' },
//                 { id: 'b-002', roomName: 'Desk B-205', type: 'Desk', date: '2025-11-15', time: '14:30 - 15:00', status: 'Pending' },
//                 { id: 'b-003', roomName: 'Phone Booth 3', type: 'Phone Booth', date: '2025-11-14', time: '09:00 - 10:00', status: 'Canceled' },
//                 { id: 'b-004', roomName: 'Beta Huddle Space', type: 'Meeting Room', date: '2025-11-14', time: '16:00 - 17:30', status: 'Confirmed' },
//             ]);
//         }, 800);
//     });
// };

const BookingPage: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

useEffect(() => {
    const getBookingsByEmployee = async (employeeId: number) => {
        const token = localStorage.getItem("authToken");
        
        if (!token) {
            console.error("No auth token found");
            return;
        }
        
        try {
            const response = await fetch(
                `http://localhost:8000/api/bookings/by-employee/${employeeId}/`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            if (!response.ok) {
                throw new Error(`Failed to fetch bookings: ${response.status}`);
            }
            
            const data: APIBooking[] = await response.json();
            console.log("Employee bookings:", data);
            
            // Transform API data to match your Booking interface
            const transformedBookings: Booking[] = data.map(apiBooking => {
                const startDate = new Date(apiBooking.start_time);
                const endDate = new Date(apiBooking.end_time);
                
                // Format date as YYYY-MM-DD
                const date = startDate.toISOString().split('T')[0];
                
                // Format time as "HH:MM - HH:MM"
                const startTime = startDate.toLocaleTimeString('ro-RO', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
                const endTime = endDate.toLocaleTimeString('ro-RO', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
                const time = `${startTime} - ${endTime}`;
                
                // Map status to your interface
                let status: 'Confirmed' | 'Pending' | 'Canceled';
                if (apiBooking.status === 'approved') {
                    status = 'Confirmed';
                } else if (apiBooking.status === 'pending') {
                    status = 'Pending';
                } else if (apiBooking.status === 'cancelled' || apiBooking.status === 'rejected') {
                    status = 'Canceled';
                } else {
                    status = 'Pending'; // default
                }
                
                return {
                    id: apiBooking.id.toString(),
                    roomName: apiBooking.room.name,
                    type: apiBooking.room.type,
                    date: date,
                    start_time: apiBooking.start_time,
                    end_time: apiBooking.end_time,
                    time: time,
                    nr_participants: apiBooking.number_of_participants,
                    status: status
                };
            });
            
            setBookings(transformedBookings);
            
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    };
    
    const emp_id = localStorage.getItem("employee_id");
    
    if (!emp_id) {
        console.error("No employee_id found");
        return;
    }
    
    getBookingsByEmployee(parseInt(emp_id));
    setLoading(false);
}, []);

    const handleCancelBooking = async (id: string) => {
        const token = localStorage.getItem("authToken")

        if (!token){
            setError("Error autentification, Please relogin")
            return
        }

        try{
            const response = await fetch(`http://localhost:8000/api/bookings/${id}/`, {
                method: 'DELETE', // Use DELETE method for removal
                headers: {
                    'Content-Type': 'application/json', // 👈 Add this
                    Authorization: `Bearer ${token}`,
                },
            });

            if ( !response.ok ){
                const errorData = await response.json().catch(() => ({ message: "Unknown error." }));
                throw new Error(errorData.message || `Eroare la anulare (Statut: ${response.status})`);
            }

            setBookings(prev => prev.filter(b => b.id !== id))
            setError(null)
        } catch (err) {
            console.error(`Attempt to cancel booking ${id} failed:`, err);
            setError(err instanceof Error ? err.message : "A apărut o eroare la anularea rezervării.");
        }
    };

    const renderBookingsList = () => {
        if (loading) {
            return <div className="loading-message">Se încarcă rezervările...</div>;
        }

        if (error) {
            return <div className="error-message">{error}</div>;
        }

        if (bookings.length === 0) {
            return <div className="no-bookings">Nu aveți rezervări active.</div>;
        }
        
        console.log(bookings)
        return (
            <div className="bookings-list">
                {bookings.map(booking => (
                    <div key={booking.id} className={`booking-card status-${booking.status.toLowerCase()}`}>
                        <div className="booking-details">
                            <h3 className="room-name">{booking.roomName}</h3>
                            <p className="room-info">
                                Tip: {booking.type} | Data: {booking.date}
                            </p>
                            <p className="room-time">{booking.time}</p>
                        </div>
                        <div className="booking-actions">
                            <span className={`status-badge status-badge-${booking.status.toLowerCase()}`}>
                                {booking.status}
                            </span>
                            {booking.status === 'Confirmed' && (
                                <button 
                                    className="cancel-btn"
                                    onClick={() => handleCancelBooking(booking.id)}
                                >
                                    Anulează
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="booking-page">
            <header className="home-header">
                <div className="header-content">
                    <div className="logo-title">
                        <CalendarIcon className="header-icon" />
                        <h1>Rezervările Mele</h1>
                    </div>
                    <p className="header-subtitle">
                        Vizualizați și gestionați spațiile de lucru și sălile de ședință rezervate.
                    </p>
                </div>
            </header>

            <main className="booking-content-area">
                {renderBookingsList()}
            </main>
        </div>
    );
};

export default BookingPage;

// --- Local Icon Component ---
const CalendarIcon = ({ className }: { className?: string }) => (
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
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);