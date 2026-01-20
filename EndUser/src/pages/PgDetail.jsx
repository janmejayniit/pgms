import {useState, useEffect} from "react";

const PgDetail = ( ) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [rooms, setRooms] = useState([]);
    const [ratings, setRatings] = useState({
        average_rating: 0,
        total_reviews: 0,
        ratings_breakdown: {1:0,2:0,3:0,4:0,5:0},
        reviews: []
    });
    const [startRating, setStartRating] = useState(0);
    const [comment, setComment] = useState(null);

    const fetchRooms = async () => {
        try{
            const response = await fetch(`${API_URL}/properties/rooms/pg-summary?pg_id=15`);
            const data = await response.json();
            if(response.status === 200){
                setRooms(data.room_types);
            }

        }catch (e) {
            console.error(e);
        }
    }


    const fetchRatings = async () => {
        try{
            const response = await fetch(`${API_URL}/properties/rating/15/summary/`);
            const data = await response.json();
            if(response.status === 200){
                setRatings(data);
            }

        }catch (e) {
            console.error(e);
        }
    }
    useEffect(() => {
        fetchRooms();
        fetchRatings();
    },[]);

    const timeAgo = (dateString)=> {
        const createdAt = new Date(dateString);
        const now = new Date();

        const diffMs = now - createdAt;
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (days === 0) return "Today";
        if (days === 1) return "1 day ago";
        return `${days} days ago`;
    }

    function renderStars(rating = 0) {
        rating = Number(rating) || 0;          // handle undefined/null
        rating = Math.min(Math.max(rating, 0), 5); // clamp between 0–5

        const full = Math.floor(rating);
        const half = rating % 1 !== 0;
        const empty = 5 - full - (half ? 1 : 0);

        return (
            <>
                {[...Array(full)].map((_, i) => <i key={`f${i}`} className="bi bi-star-fill text-warning"></i>)}
                {half && <i className="bi bi-star-half text-warning"></i>}
                {[...Array(empty)].map((_, i) => <i key={`e${i}`} className="bi bi-star text-warning"></i>)}
            </>
        );
    }

    const handleSubmit = () => {
        console.log("Rating:", startRating);
        console.log("Comment:", comment);

        // Send POST request to your API
        fetch(`${API_URL}/properties/rating/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                pg: 15,
                tenant_id: 22,
                rating:startRating,
                review:comment
            })
        }).then(() => {
            // Reset
            setStartRating(0);
            setComment("");
        });
    };

    return (
        <div className="container mt-3">
            <div className="container py-4">


                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold">Royal Heights PG</h2>
                        <p className="text-muted mb-0">Baner, Pune • Near Zudio Mall</p>
                    </div>
                    {/*<button className="btn btn-primary btn-lg">*/}
                    {/*    Book Now*/}
                    {/*</button>*/}
                </div>


                <div className="row g-3 mb-4">
                    <div className="col-md-8">
                        <img src="/pg/1.png" className="img-fluid rounded shadow-sm"/>
                    </div>
                    <div className="col-md-4">
                        <img src="/pg/2.png" className="img-fluid rounded mb-3 shadow-sm"/>
                        <img src="/pg/3.png" className="img-fluid rounded shadow-sm"/>
                    </div>
                </div>


                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h4 className="fw-bold mb-3">About This PG</h4>
                        <p className="text-muted">
                            Royal Heights is a fully furnished PG with 24×7 security, housekeeping, RO water,
                            and high-speed Wi-Fi. It is ideal for students and working professionals.
                        </p>

                        <h5 className="fw-semibold mt-4 mb-3">Amenities</h5>

                                <div className="d-flex flex-wrap gap-2">
                                    <span className="badge bg-light text-dark border">
                                        <i className="bi bi-wifi"></i> High-speed Wi-Fi
                                    </span>
                                    <span className="badge bg-light text-dark border">
                                        <i className="bi bi-droplet"></i> RO Water
                                    </span>
                                    <span className="badge bg-light text-dark border">
                                        <i className="bi bi-cup-hot"></i> Breakfast Included
                                    </span>
                                    <span className="badge bg-light text-dark border">
                                        <i className="bi bi-camera-video"></i> CCTV Security
                                    </span>
                                    <span className="badge bg-light text-dark border">
                                        <i className="bi bi-snow"></i> AC Rooms
                                    </span>
                                    <span className="badge bg-light text-dark border">
                                        <i className="bi bi-lightbulb"></i> 24×7 Electricity
                                    </span>
                                </div>
                        </div>
                </div>


                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h4 className="fw-bold mb-3">Available Rooms</h4>
                        <div className="row g-3">
                            {
                                rooms.length>0 && rooms.map((room)=>{
                                    return (
                                        <div className="col-md-4">
                                            <div className="border rounded p-3 shadow-sm h-100">
                                                <h5 className="fw-semibold">{room.room_type}</h5>
                                                <p className="text-muted small">Fully private room</p>
                                                <h4 className="fw-bold text-primary">₹{room.avg_monthly_rent}/month</h4>
                                                <div className="row">
                                                    <div className="col">
                                                        <a href={`/pg/15/book/${room.room_type}`} className="btn btn-outline-primary w-100 mt-3">Book
                                                        </a>
                                                    </div>
                                                    <div className="col">
                                                        <button className="btn btn-outline-primary w-100 mt-3">View
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }


                            {/*<div className="col-md-4">*/}
                            {/*    <div className="border rounded p-3 shadow-sm h-100">*/}
                            {/*        <h5 className="fw-semibold">Triple Sharing</h5>*/}
                            {/*        <p className="text-muted small">Affordable & comfortable</p>*/}

                            {/*        <h4 className="fw-bold text-primary">₹4,000/mo</h4>*/}
                            {/*        <div className="row">*/}
                            {/*            <div className="col">*/}
                            {/*                <button className="btn btn-outline-primary w-100 mt-3">Book</button>*/}
                            {/*            </div>*/}
                            {/*            <div className="col">*/}
                            {/*                <button className="btn btn-outline-primary w-100 mt-3">View</button>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                        </div>
                    </div>
                </div>

                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h4 className="fw-bold mb-3">Location</h4>
                        <p className="text-muted">Baner Main Road, Opp. Zudio Mall, Pune</p>

                        <div style={{height: "300px", borderRadius: "10px", overflow: "hidden"}}>
                            <iframe
                                src="https://maps.google.com/maps?q=pune&t=&z=13&ie=UTF8&iwloc=&output=embed"
                                // src={`https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed`}
                                width="100%"
                                height="100%"
                                style={{border: "0"}}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>

                {/*<div className="card shadow-sm mb-4">*/}
                {/*    <div className="card-body">*/}
                {/*        <h4 className="fw-bold mb-3">Contact Owner</h4>*/}
                {/*        <p><strong>Rahul Sharma</strong></p>*/}
                {/*        <p className="mb-1"><i className="bi bi-telephone"></i> <a href="tel:+91 9876543210">+91*/}
                {/*            9876543210</a></p>*/}
                {/*        <p><i className="bi bi-envelope"></i> <a href="mailto:royalpg@gmail.com">royalpg@gmail.com</a>*/}
                {/*        </p>*/}
                {/*    </div>*/}
                {/*</div>*/}

                <div className="card shadow-sm mb-4">
                    <div className="card-body">

                        <h4 className="fw-bold mb-3">Ratings & Reviews</h4>

                        <div className="d-flex align-items-center mb-3">
                            {/*<div className="text-center me-4">*/}
                            {/*    <h1 className="display-5 fw-bold text-warning mb-0">*/}
                            {/*        {ratings.average_rating}*/}
                            {/*    </h1>*/}

                            {/*    <div className="text-warning">*/}
                            {/*        <i className="bi bi-star-fill"></i>*/}
                            {/*        <i className="bi bi-star-fill"></i>*/}
                            {/*        <i className="bi bi-star-fill"></i>*/}
                            {/*        <i className="bi bi-star-fill"></i>*/}
                            {/*        <i className="bi bi-star-half"></i>*/}
                            {/*    </div>*/}
                            {/*    <p className="text-muted small">120 reviews</p>*/}
                            {/*</div>*/}

                            <div className="text-center me-4">
                                <h1 className="display-5 fw-bold text-warning mb-0">
                                    {ratings?.average_rating}
                                </h1>

                                <div className="text-warning">
                                    {ratings?.average_rating?.toFixed(1) || "0.0"}
                                </div>

                                <p className="text-muted small">
                                    {ratings?.total_reviews} reviews
                                </p>
                            </div>

                            <div className="flex-grow-1">

                                {[5, 4, 3, 2, 1].map(star => {
                                    const count = ratings?.ratings_breakdown[star] || 0;
                                    const percent = (count / ratings?.total_reviews) * 100;

                                    return (
                                        <div className="d-flex align-items-center mb-1" key={star}>
                                            <span className="small me-2">{star}</span>
                                            <div className="progress flex-grow-1" style={{height: "8px"}}>
                                                <div
                                                    className="progress-bar bg-warning"
                                                    style={{width: `${percent}%`}}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/*<div className="d-flex align-items-center mb-1">*/}
                                {/*    <span className="small me-2">5</span>*/}
                                {/*    <div className="progress flex-grow-1" style={{height: "8px"}}>*/}
                                {/*        <div className="progress-bar bg-warning" style={{width: "70%"}}></div>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                {/*<div className="d-flex align-items-center mb-1">*/}
                                {/*    <span className="small me-2">4</span>*/}
                                {/*    <div className="progress flex-grow-1" style={{height: "8px"}}>*/}
                                {/*        <div className="progress-bar bg-warning" style={{width: "20%"}}></div>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                {/*<div className="d-flex align-items-center mb-1">*/}
                                {/*    <span className="small me-2">3</span>*/}
                                {/*    <div className="progress flex-grow-1" style={{height: "8px"}}>*/}
                                {/*        <div className="progress-bar bg-warning" style={{width: "6%"}}></div>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                {/*<div className="d-flex align-items-center mb-1">*/}
                                {/*    <span className="small me-2">2</span>*/}
                                {/*    <div className="progress flex-grow-1" style={{height: "8px"}}>*/}
                                {/*        <div className="progress-bar bg-warning" style={{width: "3%"}}></div>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                {/*<div className="d-flex align-items-center mb-1">*/}
                                {/*    <span className="small me-2">1</span>*/}
                                {/*    <div className="progress flex-grow-1" style={{height: "8px"}}>*/}
                                {/*        <div className="progress-bar bg-warning" style={{width: "1%"}}></div>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                            </div>
                        </div>

                        <hr/>

                        <h5 className="fw-semibold mb-3">Write a Review</h5>

                        <div className="mb-3">
                            <div className="text-warning fs-4 mb-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <i
                                        key={star}
                                        className={star <= startRating ? "bi bi-star-fill" : "bi bi-star"}
                                        role="button"
                                        onClick={() => setStartRating(star)}
                                    ></i>
                                ))}
                            </div>
                        </div>

                        <textarea
                            className="form-control mb-3"
                            rows="3"
                            placeholder="Share your experience..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                        <button className="btn btn-primary" onClick={handleSubmit}>
                            Submit Review
                        </button>

                        <hr className="my-4"/>

                        <h5 className="fw-semibold mb-3">Recent Reviews</h5>
                        {ratings.reviews && ratings.reviews.map((review) => {
                            return (
                                <div className="d-flex mb-3">
                                    <img src="/feed_user.jpg" width="8%" className="rounded-circle me-3"/>
                                    <div>
                                        <h6 className="mb-1">{review.first_name} {review.first_name}
                                            <small className="text-muted">
                                                {timeAgo(review.created_at)}
                                            </small>
                                        </h6>
                                        <div className="text-warning mb-1">
                                            {[...Array(5)].map((_, i) => (
                                                i < review.rating ? (
                                                    <i key={i} className="bi bi-star-fill"></i>   // Filled star
                                                ) : (
                                                    <i key={i} className="bi bi-star"></i>        // Empty star
                                                )
                                            ))}
                                        </div>
                                        <p className="text-muted mb-0">
                                            {review.review}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}


                    </div>
                </div>


            </div>

        </div>
    )
}
export default PgDetail;