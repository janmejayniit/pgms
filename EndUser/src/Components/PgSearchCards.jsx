import React from 'react';
import { NavLink } from 'react-router-dom'

const PgSearchCards = ({pg}) => {
    return (
        <>
            <div className="card shadow-sm border-0 mb-2 p-2">
                <div className="d-flex">
                    <img src="pg_default.png" className="rounded me-3" width="150" alt="PG"/>

                    <div className="flex-grow-1">
                        <h6 className="mb-1 fw-bold">{pg.pg_name}</h6>

                        <p className="text-muted mb-1 small">
                            <i className="bi bi-geo-alt"></i> Koramangala, Bengaluru
                        </p>

                        <p className="small mb-1">
                            {/*<span className="badge bg-light text-dark border me-1">Double Sharing</span>*/}
                            {/*<span className="badge bg-light text-dark border me-1">Meals</span>*/}
                            {pg.amenities?.split(',').map((a, i) => (
                                <span key={i} className="badge bg-light text-dark border me-1">
                                    {a.trim()}
                                </span>
                            ))}
                        </p>

                        <strong className="text-primary">₹ {pg.maximum_charges} / mo</strong>
                    </div>

                    <div>
                        <a href={`/pg/${pg.id}`} className="btn btn-outline-primary btn-sm">View Details</a>
                    </div>
                </div>
            </div>
        </>

    );
};

export default PgSearchCards;