import React, { useEffect, useState } from "react";
import PgSearchCards from "../Components/PgSearchCards.jsx";
import {toast} from "react-toastify";

const Home = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState({
        lat: null,
        lng: null,
        error: null
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocation(prev => ({
                ...prev,
                error: "Geolocation is not supported by your browser"
            }));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    error: null
                });
            },
            (error) => {
                setLocation(prev => ({
                    ...prev,
                    error: error.message
                }));
            }
        );
        fetchPgs();
    }, []);

    const fetchPgs = async () => {
        try{
            setLoading(true);
            const response = await fetch(`${API_URL}/properties/properties/`);
            const data = await response.json();
            if(response.status === 200){
                setSearch(data);
            }
            toast.error(response.error);
        }catch (e) {
            console.error(e);
            toast.error(e);
        }finally {
            setLoading(false)
        }
    }

    return (
        <div className="container">
            {location.error && <p>Error: {location.error}</p>}
            {location.lat && (
                <p>
                    Latitude: {location.lat} <br/>
                    Longitude: {location.lng}
                </p>
            )}
            <div className="row mb-3">
                <div className="col-md-12">
                    <form className="container mt-5" id="locationForm">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <div className="mb-2 text-secondary small">Your Location</div>
                                <div className="d-flex align-items-center border rounded px-3 py-2">
                                    <i className="bi bi-geo-alt text-primary me-2"></i>
                                    <input
                                        type="text"
                                        className="form-control border-0 shadow-none"
                                        placeholder="Enter your address or auto-detect"
                                    />
                                    <button className="btn btn-outline-primary btn-sm ms-2">
                                        Detect
                                    </button>
                                </div>

                            </div>
                        </div>
                    </form>
                </div>

                <div className="col-md-12 mt-5">
                    {error && <p>Error: {error.message}</p>}
                    {search.length > 0 && search.map((pg)=>{
                        return <PgSearchCards  pg={pg}/>
                    })}
                </div>

            </div>

        </div>
    );
};
export default Home;