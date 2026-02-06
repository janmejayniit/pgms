import { useSearchParams } from "react-router-dom";

const ThankYou = () => {
    const [params] = useSearchParams();
    const orderId = params.get("order");

    return (
        <div className="container text-center my-5">
            <h1 className="text-success">🎉 Thank You!</h1>
            <p>Your booking has been confirmed.</p>

            <div className="card mt-4 p-4">
                <h5>Order ID</h5>
                <strong>{orderId}</strong>
            </div>
            <a href="/my-bookings" className="btn btn-primary mt-4">
                View My Bookings
            </a>
        </div>
    );
};
export default ThankYou;
