const PaymentTable = ({ payments }) => (
    <div className="card">
        <h4>Payment History</h4>
        <table>
            <thead>
            <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Txn ID</th>
            </tr>
            </thead>
            <tbody>
            {payments.map(p => (
                <tr key={p.id}>
                    <td>{new Date(p.payment_date).toLocaleDateString()}</td>
                    <td>₹{p.amount_paid}</td>
                    <td>{p.payment_method}</td>
                    <td>{p.transaction_id}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
);
