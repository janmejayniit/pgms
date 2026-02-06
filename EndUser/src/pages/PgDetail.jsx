import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import ImageCarousel from "../Components/ImageCarousel.jsx";
import {toast} from "react-toastify";

const PgDetail = ( ) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [rooms, setRooms] = useState([]);
    const [ratings, setRatings] = useState({
        average_rating: 0,
        total_reviews: 0,
        ratings_breakdown: {1:0,2:0,3:0,4:0,5:0},
        reviews: []
    });
    const [startRating, setStartRating] = useState({average_rating: 0, total_reviews: 0, reviews: []});
    const [comment, setComment] = useState(null);
    const [properties, setProperties]= useState("");
    const {pg_id} = useParams();
    const fetchRooms = async () => {
        try{
            const response = await fetch(`${API_URL}/properties/pg/${pg_id}/rooms/`);
            const data = await response.json();
            if(response.status === 200){
                setRooms(data.rooms);
                setProperties(data.pg);
            }
        }catch (e) {
            console.error(e);
        }
    }
    const fetchRatings = async () => {
        try {
            const response = await fetch(`${API_URL}/properties/ratings/?pg=${pg_id}`);
            const data = await response.json();
            if (response.status === 200) {
                const total = data.length;
                const avg =
                    total > 0
                        ? (data.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
                        : 0;
                setRatings({
                    average_rating: avg,
                    total_reviews: total,
                    reviews: data
                });
            }
        } catch (e) {
            console.error(e);
        }
    };
    useEffect(() => {
        fetchRooms();
        fetchRatings();
    },[pg_id]);
    const timeAgo = (dateString)=> {
        const createdAt = new Date(dateString);
        const now = new Date();
        const diffMs = now - createdAt;
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (days === 0) return "Today";
        if (days === 1) return "1 day ago";
        return `${days} days ago`;
    }
    const ratingBreakdown = [1, 2, 3, 4, 5].reduce((acc, star) => {
        acc[star] =
            startRating?.reviews?.filter(r => r.rating === star).length || 0;
        return acc;
    }, {});

    const getAccessToken = () => localStorage.getItem("access");
    const getRefreshToken = () => localStorage.getItem("refresh_token");

    const refreshAccessToken = async () => {
        const response = await fetch(`${API_URL}/auth/token/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                refresh: getRefreshToken()
            })
        });

        if (!response.ok) {
            throw new Error("Refresh failed");
        }

        const data = await response.json();
        localStorage.setItem("access", data.access);
        return data.access;
    };

    const submitReview = async () => {
        try {
            let accessToken = getAccessToken();

            let response = await fetch(`${API_URL}/properties/ratings/create/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    pg: pg_id,
                    rating: startRating,
                    review: comment
                })
            });

            if (response.status === 401) {
                // Access token expired → refresh
                accessToken = await refreshAccessToken();

                // Retry request
                response = await fetch(`${API_URL}/properties/ratings/create/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({
                        pg: pg_id,
                        rating: startRating,
                        review: comment
                    })
                });
            }
            if (response.status === 400) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Invalid request");
            }


            if (!response.ok) {
                throw new Error("Failed to submit review");
            }

            // Success
            setStartRating(0);
            setComment("");
            toast.success("Review submitted!");

        } catch (err) {
            console.log(err);
            toast.error(err.message || "Something went wrong");
        }
    };



    return (
        <div className="container mt-3">
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold">{properties.pg_name}</h2>
                        <p className="text-muted mb-0">{properties.address}</p>
                    </div>
                </div>
                <div className="row g-3 mb-4">
                    <div className="col-12">
                        <ImageCarousel
                            images={[
                                "/pg/11.jpg",
                                "/pg/22.jpg",
                                "/pg/33.jpg",
                                "/pg/44.jpg",
                                "/pg/55.jpg",
                                "/pg/66.jpg",
                                "/pg/77.jpg",
                                "/pg/88.jpg",
                            ]}
                            interval={2500}
                        />
                    </div>
                </div>
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h4 className="fw-bold mb-3">About This PG</h4>
                        <p className="text-muted">
                            {properties.description}
                        </p>
                        <h5 className="fw-semibold mt-4 mb-3">Amenities</h5>
                                <div className="d-flex flex-wrap gap-2">
                                    {properties.amenities
                                        ?.split(",")
                                        .map((amenity, index) => (
                                            <span
                                                key={index}
                                                className="badge bg-light text-dark border me-1"
                                            >
                                              {amenity.trim()}
                                            </span>
                                        ))}
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
                                                {/*<p className="text-muted small">Fully private room</p>*/}
                                                <h4 className="fw-bold text-primary">₹{room.monthly_rent}/month</h4>
                                                <div className="row">
                                                    <div className="col">
                                                        <a href={`/pg/${pg_id}/book/${room.id}`} className="btn btn-outline-primary w-100 mt-3">Book
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
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h4 className="fw-bold mb-3">Ratings & Reviews</h4>
                        <div className="d-flex align-items-center mb-3">
                            <div className="text-center me-4">
                                <h1 className="display-5 fw-bold text-warning mb-0">
                                    {ratings?.average_rating}
                                </h1>
                                <div className="text-warning">
                                    {Number(ratings.average_rating || 0).toFixed(1)}
                                </div>
                                <p className="text-muted small">
                                    {ratings?.total_reviews} reviews
                                </p>
                            </div>
                            <div className="flex-grow-1">
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const count = ratingBreakdown[star];
                                    const percent = ratings.total_reviews
                                        ? (count / ratings.total_reviews) * 100
                                        : 0;
                                    return (
                                        <div className="d-flex align-items-center mb-1" key={star}>
                                            <span className="small me-2">{star}</span>
                                            <div className="progress flex-grow-1" style={{ height: "8px" }}>
                                                <div
                                                    className="progress-bar bg-warning"
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                            <span className="small ms-2">{count}</span>
                                        </div>
                                    );
                                })}
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
                        <button className="btn btn-primary" onClick={submitReview}>
                            Submit Review
                        </button>
                        <hr className="my-4"/>
                        <h5 className="fw-semibold mb-3">Recent Reviews</h5>
                        {startRating.reviews?.map((review) => (
                            <div className="d-flex mb-3" key={review.id}>
                                <img
                                    src="/feed_user.jpg"
                                    width="8%"
                                    className="rounded-circle me-3"
                                    alt="user"
                                />
                                <div>
                                    <h6 className="mb-1">
                                        {review.tenant.first_name} {review.tenant.last_name}
                                        <small className="text-muted ms-2">
                                            {timeAgo(review.created_at)}
                                        </small>
                                    </h6>
                                    <div className="text-warning mb-1">
                                        {[...Array(5)].map((_, i) =>
                                            i < review.rating ? (
                                                <i key={i} className="bi bi-star-fill"></i>
                                            ) : (
                                                <i key={i} className="bi bi-star"></i>
                                            )
                                        )}
                                    </div>
                                    <p className="text-muted mb-0">
                                        {review.review}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PgDetail;