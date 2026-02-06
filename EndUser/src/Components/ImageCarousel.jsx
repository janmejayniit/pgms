import { useEffect, useState } from "react";

const ImageCarousel = ({ images, interval = 3000 }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!images || images.length === 0) return;

        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, interval);

        return () => clearInterval(timer);
    }, [images, interval]);

    if (!images || images.length === 0) {
        return <p>No images available</p>;
    }

    return (
        <div style={containerStyle}>
            <img
                src={images[index]}
                alt="carousel"
                style={imageStyle}
            />
        </div>
    );
};

const containerStyle = {
    width: "100%",
    // maxWidth: "350px",
    margin: "auto",
    overflow: "hidden",
    borderRadius: "12px",
};

const imageStyle = {
    width: "100%",
    // height: "220px",
    objectFit: "cover",
    transition: "opacity 0.5s ease-in-out",
};

export default ImageCarousel;
