import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";

export default function ViewProperty() {
    const { id } = useParams();
    const [property, setProperty] = useState({});
    const [host, setHost] = useState("");
    const [hostPhone, setHostPhone] = useState("");
    const [hostEmail, setHostEmail] = useState("");
    const [images, setImages] = useState([]);

    async function searchProperty() {
        try {
            const response = await axios({
                method: "get",
                url: `http://localhost:8000/property/${id}/get/`,
            })
            setProperty(response.data);
            setHost(response.data.user);

            // get host contact info
            const hostContact = await axios({
                method: "get",
                url: `http://localhost:8000/account/contact/${response.data.user}/`,
            })
            setHostPhone(hostContact.data.phone);
            setHostEmail(hostContact.data.email);

            // get property images
            const propertyImages = await axios({
                method: "get",
                url: `http://localhost:8000/property/image/get/${id}/`,
            })
            setImages(propertyImages.data);
            console.log(propertyImages.data)
        } catch (err) {
            alert(err);
        }
    }

    useEffect(() => {
        searchProperty();
    }, [id]);

    return (
        <div className="container" style={{padding: "50px 0"}}>
            <h1 className="fs-1 fw-semibold text-center">View Property</h1>

            <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    {images.map((image, index) => (
                        index == 0 ? (
                            <button type="button" data-bs-target="#carouselExampleIndicators"
                            data-bs-slide-to={index} className="active" aria-current="true"
                            aria-label={`Slide ${index}`}></button>
                        ) : (
                            <button type="button" data-bs-target="#carouselExampleIndicators"
                            data-bs-slide-to={index} aria-label={`Slide ${index}`}></button>
                        )
                    ))}
                </div>
                <div className="carousel-inner">
                    {images.map((image, index) => (
                        index == 0 ? (
                            <div className="active carousel-item" key={image.id}>
                                <img src={image.image} className="d-block w-100" alt="..."/>
                            </div>
                        ) : (
                            <div className="carousel-item" key={image.id}>
                                <img src={image.image} className="d-block w-100" alt="..."/>
                            </div>
                        )
                    ))}
                </div>
                <button className="carousel-control-prev" type="button"
                        data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button"
                        data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            <ul className="list-group">
                <li className="list-group-item"><strong>Address: </strong>{property.address}</li>
                <li className="list-group-item"><strong>City: </strong>{property.city}</li>
                <li className="list-group-item"><strong>State/Province: </strong>{property.province}</li>
                <li className="list-group-item"><strong>Zip: </strong>{property.zip}</li>
                <li className="list-group-item"><strong># of Guests: </strong>{property.max_guests}</li>
                <li className="list-group-item"><strong># of Beds: </strong>{property.beds}</li>
                <li className="list-group-item"><strong># of Baths: </strong>{property.bathrooms}</li>
                <li className="list-group-item"><strong>Description: </strong>{property.description}</li>
            </ul>

            <div className="accordion">
                <div className="accordion-item">
                    <h2 className="accordion-header" id="contact-header">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                data-bs-target="#contact" aria-expanded="true"
                                aria-controls="panelsStayOpen-collapseOne">
                            Host Contact Information
                        </button>
                    </h2>
                    <div id="contact" className="accordion-collapse collapse show"
                         aria-labelledby="panelsStayOpen-headingOne">
                        <div className="accordion-body">
                            {hostPhone == "" ? (
                                <div>
                                    <i className="fa fa-phone" aria-hidden="true"></i> Phone Number Not Available
                                </div>
                            ) : (
                                <div>
                                    <i className="fa fa-phone" aria-hidden="true"></i> {hostPhone}
                                </div>
                            )}

                            <div>
                                <i className="fa fa-envelope"
                                   aria-hidden="true"></i> {hostEmail}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br/>
                <a href="search_comments.html">
                    <button type="button" className="btn btn-success" style={{marginRight: "10px"}}>View Comments</button>
                </a>
                <button type="button" className="btn btn-primary" data-bs-toggle="modal"
                        data-bs-target="#book">Book
                </button>
        </div>
    )
}
