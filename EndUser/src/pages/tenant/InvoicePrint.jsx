import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
// import QRCode from "react-qr-code";
import "./Invoice.css";

const InvoicePrint = () => {
    const { id } = useParams();
    const [invoice, setInvoice] = useState(null);
    const printRef = useRef();
    const API_URL = import.meta.env.VITE_API_URL;
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const res = await fetch(`${API_URL}/billing/invoice/${id}/`);
                if (!res.ok) {
                    // Handle HTTP errors
                    if (res.status === 404) {
                        setError("Invoice not found");
                    } else if (res.status === 401) {
                        setError("Unauthorized access");
                    } else {
                        setError("Something went wrong");
                    }
                    window.location.href = "/dashboard";
                    return;
                }
                const data = await res.json();
                setInvoice(data);
            } catch (err) {
                // Network / CORS / Server down
                console.error("Fetch failed:", err);
                setError("Network error. Please try again.");
                window.location.href = "/dashboard";
            }
        };
        fetchInvoice();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (!invoice) return <p>Loading...</p>;
    if(error) return <p>{error}</p>;
    return (
        <div className="invoice-container" ref={printRef}>
            <button onClick={handlePrint} className="print-btn">
                🖨️ Print Invoice
            </button>

            <div className="invoice-wrapper">
                <div className="invoice-watermark">
                    PAID
                </div>

                {/* Invoice Content */}
                <div className="invoice-content">
                    <div className="invoice-box">
                        <header className="invoice-header">
                            <img src="/logo2.png" className="logo"/>
                            <div>
                                <h2>INVOICE</h2>
                                <p>{invoice.invoice_no}</p>
                                <p>{new Date(invoice.date).toDateString()}</p>
                            </div>
                        </header>

                        <section>
                            <h4>Billed To</h4>
                            <p>{invoice.tenant.name}</p>
                            <p>{invoice.tenant.email}</p>
                        </section>

                        <section>
                            <h4>Property</h4>
                            <p>{invoice.property.name}</p>
                            <p>Room {invoice.property.room}</p>
                        </section>

                        <table>
                            <tbody>
                            <tr>
                                <td>{invoice.booking_type} booking</td>
                                <td>₹{invoice.amount}</td>
                            </tr>
                            <tr>
                                <td>Platform Fee</td>
                                <td>₹{invoice.platform_fee}</td>
                            </tr>
                            <tr className="total">
                                <td>Total Paid</td>
                                <td>₹{invoice.total}</td>
                            </tr>
                            </tbody>
                        </table>

                        <p><b>Transaction ID:</b> {invoice.payment.transaction_id}</p>

                        {/*<QRCode*/}
                        {/*    value={`${invoice.invoice_no}|${invoice.payment.transaction_id}`}*/}
                        {/*    size={120}*/}
                        {/*/>*/}

                        <p className="note">
                            This is a system generated invoice.
                        </p>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default InvoicePrint;
