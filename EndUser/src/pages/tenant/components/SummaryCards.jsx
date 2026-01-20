const SummaryCards = ({ bookings, payments }) => {
    const activeBookings = bookings.filter(b => b.status === "confirmed");
    const totalPaid = payments.reduce(
        (sum, p) => sum + Number(p.amount_paid),
        0
    );

    return (
        <div className="summary-grid">
            <div className="card">Active Bookings: {activeBookings.length}</div>
            <div className="card">Total Paid: ₹{totalPaid}</div>
            <div className="card">
                Upcoming Checkout: {activeBookings[0]?.checkout_date || "N/A"}
            </div>
        </div>
    );
};
