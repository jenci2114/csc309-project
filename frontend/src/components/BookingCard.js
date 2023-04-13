import React from "react";
import axios from "axios";

export default function BookingCard( {booking, bookingType} ) {

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

    async function handleRate(e) {
        const rating = e.target.id.split('-star-')[0];
        const booking_id = e.target.id.split('-star-')[1];

        try {
            await axios({
                method: 'put',
                url: `http://localhost:8000/property/reservation/${booking_id}/user_to_property_rating/`,
                data: {
                    user_to_property_rating: rating,
                },
                headers: {
                    Authorization: `Bearer ${localStorage.token}`,
                }
            })
        } catch (err) {
            alert(err);
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

    return (
        <div className="card h-100" style={{textAlign: 'left'}}>
            <img src={booking.image} className="card-img-top" alt="..."/>
            <div className="card-body">
                <a href=""> {/* view booking page */}
                    <h5 className="card-title">{booking.city}</h5>
                </a>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <span className="fa fa-calendar"></span> {booking.start_date} -
                        <br/>
                        <span className="fa fa-calendar" style={{ visibility: 'hidden' }}></span> {booking.end_date}
                    </li>
                    <li className="list-group-item"><span
                        className="fa fa-money"></span> {booking.total_price}
                    </li>
                    {bookingType === 'pending' ? (
                        <li className="list-group-item">
                            <a href='#'>
                                <button type="button" className="btn btn-danger" onClick={handleCancel}>Cancel
                                </button>
                            </a>
                        </li>
                    ) : bookingType === 'approved' ? (
                        <li className="list-group-item">
                            <a href='#'>
                                <button type="button" className="btn btn-danger" onClick={handleRequestCancel}>Request Cancel
                                </button>
                            </a>
                        </li>
                    ) : bookingType === 'canceled' ? (
                        <li className="list-group-item" style={{color: "red"}}>
                            <b>Cancelled</b>
                        </li>
                    ) : bookingType === 'canceling' ? (
                        <li className="list-group-item" style={{color: "red"}}>
                            <b>Awaiting host's approval to cancel...</b>
                        </li>
                    ) : bookingType === 'denied' ? (
                        <li className="list-group-item" style={{color: "red"}}>
                            <b>Denied</b>
                        </li>
                    ) : (<></>)}
                </ul>
                {bookingType === 'terminated' ? (
                    <>
                    <div className="row">
                        <div className="col-md-12">
                            <form action="" onInput={handleRate}>
                                <div className="stars">
                                    <input className="star star-5" id={`5-star-${booking.id}`}
                                           type="radio" name="star"
                                           defaultChecked={booking.user_to_property_rating === 5}/>
                                    <label className="star star-5"
                                           htmlFor={`5-star-${booking.id}`}></label>
                                    <input className="star star-4" id={`4-star-${booking.id}`}
                                           type="radio" name="star"
                                           defaultChecked={booking.user_to_property_rating === 4}/>
                                    <label className="star star-4"
                                           htmlFor={`4-star-${booking.id}`}></label>
                                    <input className="star star-3" id={`3-star-${booking.id}`}
                                           type="radio" name="star"
                                           defaultChecked={booking.user_to_property_rating === 3}/>
                                    <label className="star star-3"
                                           htmlFor={`3-star-${booking.id}`}></label>
                                    <input className="star star-2" id={`2-star-${booking.id}`}
                                           type="radio" name="star"
                                           defaultChecked={booking.user_to_property_rating === 2}/>
                                    <label className="star star-2"
                                           htmlFor={`2-star-${booking.id}`}></label>
                                    <input className="star star-1" id={`1-star-${booking.id}`}
                                           type="radio" name="star"
                                           defaultChecked={booking.user_to_property_rating === 1}/>
                                    <label className="star star-1"
                                           htmlFor={`1-star-${booking.id}`}></label>
                                </div>
                            </form>
                        </div>
                    </div>
                    <br/>
                    <a href="#">
                        <button type="button" className="btn btn-primary">Comment
                        </button>
                    </a>
                    </>
                ) : (<></>)}
            </div>
        </div>
    )
}
