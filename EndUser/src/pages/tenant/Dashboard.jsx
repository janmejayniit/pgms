import {useEffect, useState} from 'react';
import axios from 'axios';
// import SummaryCards from "./components/SummaryCards";
import BookingTable from "./components/BookingTable";
// import PaymentTable from "./components/PaymentTable";

const Dashboard = () => {
    const [orderList, setOrderList] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;
    const [bookings, setBookings] = useState([]);
    const [payments, setPayments] = useState([]);

    const fetchOrderList = async () => {
        try {
            setLoading(true);
            const userId = localStorage.getItem("user_id");
            const response = await axios.get(
                `${API_URL}/tenant/booking-orders/${userId}/`
            );
            setOrderList(response.data);
            setBookings(response.data);
            console.log(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError("Unable to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(()=>{
        fetchOrderList()
    },[])


    return (
        <div className="container mt-3">
            <BookingTable bookings={bookings} />
        </div>
    )
}

export default Dashboard;