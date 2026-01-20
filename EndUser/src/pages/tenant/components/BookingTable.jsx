import React from 'react';

const BookingTable = ({ bookings }) => (
    <div className="card">
       <div className="card-header">
           <h3>Booking</h3>
       </div>
        <div className="card-body">
            <table className="table">
                <thead>
                <tr>
                    <th>PG</th>
                    {/*<th>Room</th>*/}
                    <th>Type</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Status</th>
                    <th>Invoice</th>
                </tr>
                </thead>
                <tbody>
                {bookings.map(b => (
                    <tr key={b.id}>
                        <td>{b.order.pg.pg_name}</td>
                        {/*<td>{b.room}</td>*/}
                        <td>{b.booking_type}</td>
                        <td>{b.checkin_date}</td>
                        <td>{b.checkout_date || "-"}</td>
                        <td>{b.status}</td>
                        <td>
                            {b.status == 'confirmed' ?
                                <a
                                    href={`/print/invoice/${b.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    🖨️
                                </a>:
                                <></>

                            }

                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
);


export default BookingTable;