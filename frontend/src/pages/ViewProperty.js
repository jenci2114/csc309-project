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
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [totalPrice, setTotalPrice] = useState(null);

    const [currUser, setCurrUser] = useState(localStorage.getItem("id"));

    async function searchProperty() {
        setCurrUser(localStorage.getItem("id"));
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


    function validateDates() {
        if (startDate == null || endDate == null) {
            alert("Please select a date range.");
            return false;
        } else if (startDate > endDate) {
            alert("Please select a valid date range.");
            return false;
        }

        let tempDate = new Date(startDate);

        while (tempDate <= endDate) {
            let dateValid = false;
            for (let i = 0; i < dateAndPrice.length; i++) {
                const date1 = new Date(dateAndPrice[i]["date"]);
                // compensate for time zone time loss
                date1.setMinutes(date1.getMinutes() + date1.getTimezoneOffset())
                if (date1.getFullYear() === tempDate.getFullYear() &&
                    date1.getMonth() === tempDate.getMonth() &&
                    date1.getDate() === tempDate.getDate()) {
                    dateValid = true;
                    break;
                }
            }
            if (!dateValid) {
                return false;
            }
            tempDate.setDate(tempDate.getDate() + 1);
        }
        return true;
    }


    function calculateTotalPrice() {
        if (startDate == null || endDate == null) {
            setTotalPrice(null);
        } else if (startDate > endDate) {
            setTotalPrice(-1);
        } else if (!validateDates()) {
            setTotalPrice(-2);
        } else {
            let total = 0;
            let tempDate = new Date(startDate);
            while (tempDate <= endDate) {
                for (let i = 0; i < dateAndPrice.length; i++) {
                    const date1 = new Date(dateAndPrice[i]["date"]);
                    // compensate for time zone time loss
                    date1.setMinutes(date1.getMinutes() + date1.getTimezoneOffset())
                    if (date1.getFullYear() === tempDate.getFullYear() &&
                        date1.getMonth() === tempDate.getMonth() &&
                        date1.getDate() === tempDate.getDate()) {
                        total += parseInt(dateAndPrice[i]["price"]);
                        break;
                    }
                }
                tempDate.setDate(tempDate.getDate() + 1);
            }
            setTotalPrice(total);
        }
    }

    useEffect(() => {
        calculateTotalPrice();
    }, [startDate, endDate]);

    function validateBook() {
        if (totalPrice == null) {
            alert("Please select a date range.");
            return false;
        } else if (totalPrice === -1) {
            alert("Please select a valid date range.");
            return false;
        } else if (totalPrice === -2) {
            alert("All dates in the selected range must be available.");
            return false;
        } else {
            return true;
        }
    }

    async function handleBook() {
        if (validateBook()) {
            try {
                await axios({
                    method: "post",
                    url: "http://localhost:8000/property/reserve/",
                    data: {
                        start_date: startDate.toISOString().split('T')[0],
                        end_date: endDate.toISOString().split('T')[0],
                        property_id: id,
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.token}`,
                    }
                })
                document.getElementById("closeBook").click();
                alert("Property booked successfully!");
                await searchProperty();
                setStartDate(null);
                setEndDate(null);
            } catch (err) {
                alert(err);
            }
        }
    }

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
                <a href={`/comments/property/${property.id}/`}>
                    <button type="button" className="btn btn-success" style={{marginRight: "10px"}}>View Comments</button>
                </a>
                {currUser == null ? (
                    <button type="button" className="btn btn-primary" data-bs-toggle="modal"
                        data-bs-target="#book" disabled>Must Login To Book
                    </button>
                ) : currUser == property.user ? (
                    <button type="button" className="btn btn-primary" data-bs-toggle="modal"
                        data-bs-target="#book" disabled>Cannot Book Your Own Property
                    </button>
                ) : (
                    <button type="button" className="btn btn-primary" data-bs-toggle="modal"
                        data-bs-target="#book">Book
                    </button>
                )}
            </div>

            <div className="modal fade" id="book" data-bs-backdrop="static" data-bs-keyboard="false"
             tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content" style={{minHeight: '70vh'}}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="book-title">Book</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close" id="closeBook"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                Choose a start date:
                                <PricedDatePicker dateAndPrice={dateAndPrice}
                                                  selectedDate={startDate}
                                                  changeSelectedDate={setStartDate}/>
                            </div>
                            <div className="mb-3">
                                Choose an end date:
                                <PricedDatePicker dateAndPrice={dateAndPrice}
                                                  selectedDate={endDate}
                                                  changeSelectedDate={setEndDate}/>
                            </div>
                            {totalPrice == null ? (
                                <div className="mb-3">
                                    Total price will be calculated once dates are selected
                                </div>
                            ) : totalPrice === -1 ? (
                                <div className="mb-3">
                                    Start date cannot be after end date
                                </div>
                            ) : totalPrice === -2 ? (
                                <div className="mb-3">
                                    All dates between start date and end date must be available
                                </div>
                            ) : (
                                <div className="mb-3">
                                    Total Price: ${totalPrice}
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary"
                                    data-bs-dismiss="modal">Close
                            </button>
                            {currUser == null ? (
                                <button type="button" className="btn btn-primary" disabled>Must Login To Book</button>
                            ) : currUser == property.user ? (
                                <button type="button" className="btn btn-primary" disabled>Cannot Book Your Own Property</button>
                            ) : (
                                <button type="button" className="btn btn-primary" onClick={handleBook}>Book</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
