
 import React, { useState, useEffect } from "react";

const PropertyComment = ({ reservation_id, msg, comment_number, user_from, len }) => {
    const [reservation_users, setReservationUsers] = useState([]);

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
    console.log(reservation_users[0], reservation_users[1], is_tenant, is_host);
    const host_wait = is_host && (len % 2 === 0);
    const tenant_wait = is_tenant && (len % 2 === 1);
    const is_last = comment_number === len;

    return (
        <>
            <div className="card" style={{ textAlign: "center" }}>
                <div className="card-header">
                    <h5 style={{display: comment_number === 1 ? "block" : "none"}}>Host: {reservation_users[0]} ---- Tenant: {reservation_users[1]}</h5>
                    <h5>From user: {user_from}</h5>
                </div>
                <div className="card-body">

                    <p>{msg}</p>
                    <div className="row" style={{ display: comment_number === 1 && is_tenant ? "block" : "none" }}>
                        <div className="col-md-12">
                            <div className="stars">
                                <form action="">
                                    <input className="star star-5" id="first-star-5" type="radio" name="star" />
                                    <label className="star star-5" htmlFor="first-star-5"></label>
                                    <input className="star star-4" id="first-star-4" type="radio" name="star" />
                                    <label className="star star-4" htmlFor="first-star-4"></label>
                                    <input className="star star-3" id="first-star-3" type="radio" name="star" />
                                    <label className="star star-3" htmlFor="first-star-3"></label>
                                    <input className="star star-2" id="first-star-2" type="radio" name="star" />
                                    <label className="star star-2" htmlFor="first-star-2"></label>
                                    <input className="star star-1" id="first-star-1" type="radio" name="star" />
                                    <label className="star star-1" htmlFor="first-star-1"></label>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ textAlign: "center", display: ((is_host || is_tenant) && is_last) ? "block" : "none" }}>
                <div className="card-header" style={{ display: (!host_wait && !tenant_wait) || (is_host && is_tenant) ? "block" : "none" }}>
                    <form>
                        <div className="form-group">
                            <label htmlFor="comment">Response:</label>
                            <textarea className="form-control" rows="3" id="comment" required></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Reply</button>
                    </form>
                </div>
                <div className="card-header" style={{ display: host_wait && !(is_host && is_tenant)? "block" : "none" }}>
                    <p>You have to wait for the tenant to reply before you can add more reply</p>
                </div>
                <div className="card-header" style={{ display: tenant_wait && !(is_host && is_tenant) ? "block" : "none" }}>
                    <p>You have to wait for the host to reply before you can add more reply</p>
                </div>
            </div>
        </>
    );
};

export default PropertyComment;