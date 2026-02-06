import {useEffect, useState} from 'react';
import { useParams } from "react-router-dom";
import './BookRoom.css';
import axios from 'axios';
import { toast } from "react-toastify";

const BookRoom = (props) => {

    const API_URL = import.meta.env.VITE_API_URL;
    const RZPYTKYEID = import.meta.env.VITE_RZPYTKYEID;
    const { pg_id } = useParams();
    const {room_id} = useParams();
    const { room_type } = useParams();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [roomList, setRoomList] = useState([]);
    const [bookingType, setBookingType] = useState("monthly"); // default = monthly
    const [selectedRoom, setSelectedRoom] = useState("");
    const [price, setPrice] = useState({
        monthly_rent: 0,
        daily_rent: 0,
    });
    const [bookingData, setBookingData] = useState({
        checkin: "",
        checkout: "",
    });
    const fetchRoomList = async () =>{
        try{
            const response = await fetch(`${API_URL}/properties/rooms/?pg_id=${pg_id}&room_type=${room_type}`);
            const data = await response.json();
            if(response.status === 200){
                setRoomList(data);
            }
        }catch (e){
            console.log(e);
        }
    }
    useEffect(() => {
        fetchRoomList();
    },[pg_id,room_type])
    useEffect(() => {
        const room = roomList.find(r => r.id == selectedRoom);
        if (room) {
            let totalDailyPrice = room.daily_rent;
            // If both dates exist → calculate number of days
            if (bookingData.checkin && bookingData.checkout) {
                const start = new Date(bookingData.checkin);
                const end = new Date(bookingData.checkout);
                // Calculate difference in days
                const diffTime = end - start;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                // Total daily price (rent * days)
                totalDailyPrice = diffDays * room.daily_rent;
            }
            // Set price
            setPrice({
                monthly_rent: Number(room.monthly_rent ) ,
                daily_rent: room.daily_rent,
                total_daily: totalDailyPrice,
            });
        }
    }, [selectedRoom, bookingData.checkin, bookingData.checkout]);
    const handleBooking = (e) => {
        e.preventDefault();

        if (bookingType === "monthly") {
            console.log("Monthly Booking:", bookingData);
            toast.success("Monthly PG booking successful!");
        } else {
            console.log("Daily Booking:", bookingData);
            toast.success("Daily room booking successful!");
        }
    };
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };
    const handlePayment = async () => {
        try {
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                toast.error("Razorpay SDK failed to load");
                return;
            }
            if (!selectedRoom) {
                toast.info("Please select a room");
                return;
            }
            const room = roomList.find(r => r.id == selectedRoom);
            const name =
                localStorage.getItem("first_name") +
                " " +
                localStorage.getItem("last_name");
            const email = localStorage.getItem("email");
            const phone = localStorage.getItem("contact_number");
            //Create booking + Razorpay order (BACKEND)
            const bookingRes = await fetch(
                `${API_URL}/billing/create-booking-order/`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        tenant: localStorage.getItem("user_id"),
                        pg: room.pg,
                        room: room.id,
                        booking_type: bookingType,
                        checkin: bookingData.checkin,
                        checkout:
                            bookingType === "daily"
                                ? bookingData.checkout
                                : null,
                        amount:
                            bookingType === "monthly"
                                ? price.monthly_rent
                                : Number(price.total_daily) + 100
                    }),
                }
            );

            if (!bookingRes.ok) {
                toast.error("Failed to create a booking")
                throw new Error("Failed to create booking");
            }
            const orderData = await bookingRes.json();
            //Razorpay checkout
            const options = {
                key: RZPYTKYEID,
                amount: orderData.amount, // paise
                currency: "INR",
                order_id: orderData.order_id, // Razorpay order id
                handler: async function (response) {
                    //Verify payment
                    await axios.post(`${API_URL}/billing/verify-payment/`, {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        tenant: localStorage.getItem("user_id"),
                    });
                    // alert("Booking confirmed 🎉");
                    // window.location.href = "/";
                },
                modal: {
                    ondismiss: async function () {
                        // user closed payment popup
                        await axios.post(`${API_URL}/billing/payment-failed/`, {
                            razorpay_order_id: orderData.order_id
                        });
                        toast.info("Payment cancelled");
                    }
                },
                prefill: {
                    name: name,
                    email: email,
                    contact: phone,
                },
                theme: {
                    color: "#3399cc",
                },
            };
            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (err) {
            console.error(err);
            toast.error("Payment failed");
        }
    };
    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">

                    <div className="card shadow-lg rounded-4 border-0">
                        <div className="card-body p-4">

                            {/* Room Header */}
                            <div className="d-flex align-items-center mb-4">
                                <img
                                    src="https://via.placeholder.com/100"
                                    className="rounded-3 me-3"
                                    alt="Room"
                                />
                                <div>
                                    <h3 className="fw-bold mb-1">AC Deluxe Room</h3>
                                    <p className="text-muted mb-0">
                                        <i className="bi bi-geo-alt me-1"></i> MG Road, Bengaluru
                                    </p>
                                </div>
                            </div>

                            <hr/>

                            {/* Booking Type Selector */}
                            <div className="mb-4">
                                <label className="fw-semibold">Choose Booking Type</label>
                                <div className="btn-group w-100 mt-2">
                                    <button
                                        type="button"
                                        className={`btn ${bookingType === "monthly" ? "btn-primary" : "btn-outline-primary"}`}
                                        onClick={() => setBookingType("monthly")}
                                    >
                                        Monthly Stay
                                    </button>
                                    <button
                                        type="button"
                                        className={`btn ${bookingType === "daily" ? "btn-primary" : "btn-outline-primary"}`}
                                        onClick={() => setBookingType("daily")}
                                    >
                                        Daily Stay
                                    </button>
                                </div>
                            </div>
                            <form onSubmit={handleBooking}>
                                {/* ROOM DROPDOWN */}
                                <div className="mt-3">
                                    <label className="fw-semibold">Choose Room</label>
                                    <select
                                        className="form-control"
                                        value={selectedRoom}
                                        onChange={(e) => setSelectedRoom(e.target.value)}
                                    >
                                        <option value="">Choose Room</option>
                                        {roomList.map((room) => (
                                            <option key={room.id} value={room.id}>
                                                Room No {room.room_number} (Floor {room.floor})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {/* DAILY BOOKING FIELDS */}
                                {bookingType === "daily" && (
                                    <div className="row mt-3">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold">Check-in Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={bookingData.checkin}
                                                onChange={(e) =>
                                                    setBookingData({...bookingData, checkin: e.target.value})
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold">Check-out Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={bookingData.checkout}
                                                onChange={(e) =>
                                                    setBookingData({...bookingData, checkout: e.target.value})
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                )}
                                {/* PRICE SUMMARY */}
                                <div className="p-3 bg-light rounded-3 mt-4 mb-4">
                                    <h5 className="fw-bold mb-3">Price Summary</h5>
                                    {/* MONTHLY PRICE */}
                                    {bookingType === "monthly" && (
                                        <div className="d-flex justify-content-between">
                                            <span>Monthly Rent</span>
                                            <strong>₹ {price.monthly_rent || 0}</strong>
                                        </div>
                                    )}
                                    {/* DAILY PRICE */}
                                    {bookingType === "daily" && (
                                        <>
                                            <div className="d-flex justify-content-between">
                                                <span>Daily Rent</span>
                                                <strong>₹ {price.daily_rent}</strong>
                                            </div>

                                            <div className="d-flex justify-content-between">
                                                <span>No. of Days</span>
                                                <strong>
                                                    {bookingData.checkin && bookingData.checkout
                                                        ? Math.ceil((new Date(bookingData.checkout) - new Date(bookingData.checkin)) / (1000 * 3600 * 24))
                                                        : 1}
                                                </strong>
                                            </div>

                                            <div className="d-flex justify-content-between">
                                                <span>Total Daily Price</span>
                                                <strong>₹ {price.total_daily || price.daily_rent}</strong>
                                            </div>
                                        </>
                                    )}
                                    <div className="d-flex justify-content-between">
                                        <span>Plateform Charges</span>
                                        <strong>₹100</strong>
                                    </div>
                                    <hr/>
                                    {/* TOTAL */}
                                    <div className="d-flex justify-content-between fs-5 fw-bold">
                                        <span>Total</span>
                                        <span>
                                                ₹{" "}
                                            {bookingType === "monthly"
                                                ? price.monthly_rent || 0
                                                : (Number(price.total_daily || 0) + 100)}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-success btn-lg w-100 fw-bold mt-3"
                                    onClick={handlePayment}
                                >
                                    <i className="bi bi-cash-coin me-2"></i>
                                    Pay & Book Now
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
export default BookRoom;