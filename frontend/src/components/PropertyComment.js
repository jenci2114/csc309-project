
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./booking.css";

const PropertyComment = ({ reservation_id, msg, comment_number, user_from, len }) => {
    const [reservation_users, setReservationUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [rating, setRating] = useState(0);
    const [replied, setReplied] = useState("");

    const fetchReservationUsers = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const data = await response.json();
            setReservationUsers([data.host, data.tenant]);
        } catch {
            console.log("Shouldn't be here");
        }
    };

    useEffect(() => {
        fetchReservationUsers(`http://127.0.0.1:8000/property/reservation/users/${reservation_id}/`);
    }, []);

    const is_host = localStorage.username === reservation_users[0];
    const is_tenant = localStorage.username === reservation_users[1];
    const host_wait = is_host && (len % 2 === 0);
    const tenant_wait = is_tenant && (len % 2 === 1);
    const is_last = comment_number === len;

    const replyComment = () => {
        fetch(`http://127.0.0.1:8000/property/comments/add/reservation/${reservation_id}/`, {
            method: 'POST',
            body: JSON.stringify({ msg: message }),
            headers: {
                Authorization: `Bearer ${localStorage.token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error));
        setReplied(message);
    };


    const handleRatingChange = (event) => {
        setRating(event.target.value);
        fetch(`http://127.0.0.1:8000/property/reservation/${reservation_id}/user_to_property_rating/`, {
            method: 'PUT',
            body: JSON.stringify({ user_to_property_rating: event.target.value }),
            headers: {
                Authorization: `Bearer ${localStorage.token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error));
    };

    return (
        <>
            <div className="card" style={{ textAlign: "center" }}>
                <div className="card-header">
                    <h5 style={{ display: comment_number === 1 ? "block" : "none" }}>Host: {reservation_users[0]} ---- Tenant: {reservation_users[1]}</h5>
                    <h5>From user: {user_from}</h5>
                </div>
                <div className="card-body">

                    <p>{msg}</p>
                    <div className="row" style={{ display: comment_number === 1 && is_tenant ? "block" : "none" }}>
                        <div className="col-md-12">
                            <div className="stars">
                                <form>
                                    <input className="star star-5" id={`first-star-5-${reservation_id}`} type="radio" name="star" value="5" onClick={handleRatingChange} />
                                    <label className="star star-5" htmlFor={`first-star-5-${reservation_id}`}></label>
                                    <input className="star star-4" id={`first-star-4-${reservation_id}`} type="radio" name="star" value="4" onClick={handleRatingChange} />
                                    <label className="star star-4" htmlFor={`first-star-4-${reservation_id}`}></label>
                                    <input className="star star-3" id={`first-star-3-${reservation_id}`} type="radio" name="star" value="3" onClick={handleRatingChange} />
                                    <label className="star star-3" htmlFor={`first-star-3-${reservation_id}`}></label>
                                    <input className="star star-2" id={`first-star-2-${reservation_id}`} type="radio" name="star" value="2" onClick={handleRatingChange} />
                                    <label className="star star-2" htmlFor={`first-star-2-${reservation_id}`}></label>
                                    <input className="star star-1" id={`first-star-1-${reservation_id}`} type="radio" name="star" value="1" onClick={handleRatingChange} />
                                    <label className="star star-1" htmlFor={`first-star-1-${reservation_id}`}></label>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ textAlign: "center", display: ((is_host || is_tenant) && is_last) && !replied ? "block" : "none" }}>
                <div className="card-header" style={{ display: (!host_wait && !tenant_wait) ? "block" : "none" }}>
                        <div className="form-group">
                            <label htmlFor="comment">Response:</label>
                            <textarea className="form-control" rows="3" id="comment" required onChange={(event) => setMessage(event.target.value)}></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary" onClick={(replyComment)}>Reply</button>
                </div>
                <div className="card-header" style={{ display: host_wait ? "block" : "none" }}>
                    <p>You have to wait for the tenant to reply before you can add more reply</p>
                </div>
                <div className="card-header" style={{ display: tenant_wait ? "block" : "none" }}>
                    <p>You have to wait for the host to reply before you can add more reply</p>
                </div>
            </div>
            <div className="card" style={{ textAlign: "center", display: replied ? "block": "none" }}>
                <div className="card-header">
                    {is_host && <h5>From user: {reservation_users[0]}</h5>}
                    {is_tenant && <h5>From user: {reservation_users[1]}</h5>}
                </div>
                <div className="card-body">
                    <p>{replied}</p>
                </div>
            </div>
            {replied && <div className="alert alert-success" style={{ paddingBottom: "0px" }} role="alert"><p className="text-center">Successfully replied</p></div>}
        </>
    );
};

export default PropertyComment;