import { useParams } from "react-router-dom";
import PricedDatePicker from "../components/PricedDatePicker";
import React, { useState, useEffect } from "react";
import axios from "axios";


export default function BookingDetails() {
    const { id } = useParams();
    const [booking, setBooking] = useState({})
    const [property, setProperty] = useState({});
    const [hostPhone, setHostPhone] = useState("");
    const [hostEmail, setHostEmail] = useState("");
    const [images, setImages] = useState([]);

    const [currUser, setCurrUser] = useState(localStorage.getItem("id"));

    const [comment, setComment] = useState('');
    const [hasComment, setHasComment] = useState(false);

    async function searchBooking() {
        setCurrUser(localStorage.getItem("id"));
        try {
            // get booking
            const response = await axios({
                method: 'get',
                url: `http://localhost:8000/property/reservation/${id}/get/`,
                headers: {
                    Authorization: `Bearer ${localStorage.token}`,
                }
            })
            setBooking(response.data);

            // get property
            const propertyResponse = await axios({
                method: "get",
                url: `http://localhost:8000/property/${id}/get/`,
            })
            setProperty(propertyResponse.data);

            // get host contact info
            const hostContact = await axios({
                method: "get",
                url: `http://localhost:8000/account/contact/${propertyResponse.data.user}/`,
            })
            setHostPhone(hostContact.data.phone);
            setHostEmail(hostContact.data.email);

            // get property images
            const propertyImages = await axios({
                method: "get",
                url: `http://localhost:8000/property/image/get/${id}/`,
            })
            setImages(propertyImages.data);

            const hasCommentResponse = await axios({
                method: 'get',
                url: `http://localhost:8000/property/comments/reservation/${id}/`,
                headers: {
                    Authorization: `Bearer ${localStorage.token}`,
                }
            })
            setHasComment(hasCommentResponse.data.length > 0);
        } catch (err) {
            alert(err);
        }
    }

    useEffect(() => {
        searchBooking();
    }, [id]);

    async function handleCancel() {
        if (window.confirm('Are you sure to cancel this booking?')) {
            const res = await performCancel();
            if (res) {
                alert('Booking cancelled successfully!');
                window.location.reload();
            }
        }
    }

    async function handleRequestCancel() {
        if (window.confirm('Request host\'s approval to cancel?')) {
            const res = await performCancel();
            if (res) {
                alert('Request sent successfully!');
                window.location.reload();
            }
        }
    }

    async function performCancel() {
        try {
            await axios({
                method: 'put',
                url: `http://localhost:8000/property/cancel/`,
                data: {
                    reservation_id: booking.id,
                },
                headers: {
                    Authorization: `Bearer ${localStorage.token}`,
                }
            })
            return true;
        } catch (err) {
            alert(err);
            return false;
        }
    }

    async function handleComment() {
        try {
            await axios({
                method: 'post',
                url: `http://localhost:8000/property/comments/add/reservation/${booking.id}/`,
                data: {
                    msg: comment,
                },
                headers: {
                    Authorization: `Bearer ${localStorage.token}`,
                }
            })
            alert('Comment added successfully!');
            window.location.reload();
        } catch (err) {
            alert(err);
        }
    }

    return (
        <>
            <div className="container" style={{padding: "50px 0"}}>
                <h1 className="fs-1 fw-semibold text-center">Booking Details</h1>

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
                    <li className="list-group-item"><strong>Booking Status: </strong>{booking.status}</li>
                    <li className="list-group-item"><strong>Dates Booked: </strong>{booking.start_date} - {booking.end_date}</li>
                    <li className="list-group-item"><strong>Price Paid: </strong>${booking.total_price}</li>
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
                {booking.status === 'pending' ? (
                    <button type="button" className="btn btn-danger" onClick={handleCancel}>Cancel
                    </button>
                ) : booking.status === 'approved' ? (
                    <button type="button" className="btn btn-danger" onClick={handleRequestCancel}>Request Cancel
                    </button>
                ) : booking.status === 'terminated' && !hasComment ? (
                    <button type="button" className="btn btn-primary"
                            data-bs-toggle="modal" data-bs-target={`#comment_${booking.id}`}>Comment
                    </button>
                ) : booking.status === 'terminated' && hasComment ? (
                    <a href={`/comments/property/${booking.property}/`}>
                        <button type="button" className="btn btn-success">View Comment
                        </button>
                    </a>
                ) : (<></>)}
                <a href="/booking/">
                    <button className="btn btn-primary" style={{marginLeft: '10px'}}>Go Back</button>
                </a>
            </div>
            <div className="modal fade" id={`comment_${booking.id}`} data-bs-backdrop="static"
                 data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel"
                 aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id={`staticBackdropLabel_${booking.id}`}>Comment on {booking.city} (You may only comment ONCE)</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form action="">
                                <div className="mb-3">
                                    <label htmlFor={`comment_body_${booking.id}`}
                                           className="col-form-label">Comment:</label>
                                    <textarea className="form-control" id={`comment_body_${booking.id}`} value={comment}
                                              onInput={(e) => setComment(e.target.value)}></textarea>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary"
                                    data-bs-dismiss="modal">Close
                            </button>
                            <button type="button" className="btn btn-primary" onClick={handleComment}>Submit Comment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
