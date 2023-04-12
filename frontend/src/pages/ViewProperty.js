import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import PricedDatePicker from "../components/PricedDatePicker";

const BookModal = () => {
    return <BookModal />;
}

export default function ViewProperty() {
    const { id } = useParams();
    const [property, setProperty] = useState({});
    const [hostPhone, setHostPhone] = useState("");
    const [hostEmail, setHostEmail] = useState("");
    const [images, setImages] = useState([]);

    const [dateAndPrice, setDateAndPrice] = useState([]);

    async function searchProperty() {
        try {
            const response = await axios({
                method: "get",
                url: `http://localhost:8000/property/${id}/get/`,
            })
            setProperty(response.data);

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

            // get property date and price
            const propertyDateAndPrice = await axios({
                method: "get",
                url: `http://localhost:8000/property/${id}/available_dates/`,
            })
            setDateAndPrice(propertyDateAndPrice.data);
        } catch (err) {
            alert(err);
        }
    }

    useEffect(() => {
        searchProperty();
    }, [id]);

    return (
        <>
            <div className="container" style={{padding: "50px 0"}}>
                <h1 className="fs-1 fw-semibold text-center">View Property</h1>

                <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        {images.map((image, index) => (
                            index == 0 ? (
                                <button type="button" data-bs-target="#carouselExampleIndicators"
                                data-bs-slide-to={index} className="active" aria-current="true"
                                aria-label={`Slide ${index}`} key={image.id}></button>
                            ) : (
                                <button type="button" data-bs-target="#carouselExampleIndicators"
                                data-bs-slide-to={index} aria-label={`Slide ${index}`} key={image.id}></button>
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

            <div className="modal fade" id="book" data-bs-backdrop="static" data-bs-keyboard="false"
             tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content" style={{minHeight: '70vh'}}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="book-title">Book</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                Choose a start date:
                                <PricedDatePicker prices={dateAndPrice}/>
                            </div>
                            <div className="mb-3">
                                Choose an end date:
                                <PricedDatePicker prices={dateAndPrice}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="additional_comments" className="col-form-label">Additional
                                    Comments</label>
                                <textarea id="additional_comments"
                                          className="form-control"></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary"
                                    data-bs-dismiss="modal">Close
                            </button>
                            <button type="button" className="btn btn-primary">Book</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
