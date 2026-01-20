import { toast } from "react-toastify";

useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws/notifications/");

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        toast.info(data.message);
    };

    return () => socket.close();
}, []);




// // Success
// toast.success("Booking confirmed");
//
// // Error
// toast.error("Payment failed");
//
// // Warning
// toast.warn("Room already booked");
//
// // Info
// toast.info("Invoice generated");