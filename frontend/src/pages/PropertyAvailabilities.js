import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PropertyAvailabilities = () => {
    const { id } = useParams();
    const [propertyAvailabilities, setPropertyAvailabilities] = useState([]);
    const [newStartDate, setNewStartDate] = useState("");
    const [newEndDate, setNewEndDate] = useState("");
    const [newPrice, setNewPrice] = useState(0);
    const { isLoggedin, login } = useAuth();
    const [propertyAvailabilitiesMine, setPropertyAvailabilitiesMine] = useState(true);
    const [propertyAvailabilitiesValid, setPropertyAvailabilitiesValid] = useState(true);
    const [deleted, setDeleted] = useState(false);
    const [availabilityCount, setAvailabilityCount] = useState(0);


    function fetchPropertyData() {
        fetch(`http://127.0.0.1:8000/property/my/availability/get/${id}/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.token}`,
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw response.status;
                }
            })
            .then((queryResult) => {
                setPropertyAvailabilities(queryResult);
                setAvailabilityCount(queryResult.length);
            })
            .catch((error) => {
                console.error("Error:", error);
                if (error === 403) {
                    setPropertyAvailabilitiesMine(false);
                } else {
                    setPropertyAvailabilitiesValid(false);
                }
            });
    }

    useEffect(() => {
        fetchPropertyData();
    }, []);

    const deleteAvailability = async (availability_id) => {
        if (availabilityCount === 1) {
            alert("Cannot delete last availability");
            return;
        }
        const headers = { Authorization: `Bearer ${localStorage.token}` };
        await fetch(`http://127.0.0.1:8000/property/availability/delete/${availability_id}/`, { headers, method: "DELETE" });
        setDeleted(true);
        setPropertyAvailabilities(propertyAvailabilities.filter((availability) => availability.id !== availability_id));
        setAvailabilityCount(availabilityCount - 1);
    }

    const addAvailability = async () => {
        setDeleted(false);
        if (newStartDate === "" || newEndDate === "" || newPrice === 0) {
            alert("Choose start date, end date, and price per night");
            return;
        }

        await fetch(`http://127.0.0.1:8000/property/availability/create/${id}/`, {
            method: 'POST',
            body: JSON.stringify({start_date: newStartDate, end_date: newEndDate, price_per_night: newPrice}),
            headers: {
                Authorization: `Bearer ${localStorage.token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setNewStartDate("");
                setNewEndDate("");
                setNewPrice(0);
                fetchPropertyData();
            })
            .catch(error => console.error(error));

    };

    if (!isLoggedin) {
        return <Navigate to="/login" />;
    }

    if (!propertyAvailabilitiesValid) {
        return <h1 className="display-4 text-center">Property does not exist, cannot add/edit availabilies</h1>;
    }

    if (!propertyAvailabilitiesMine) {
        return <h1 className="display-4 text-center">Property is not yours, cannot add/edit availabilities</h1>;
    }

    return (
        <>
            <div className="container" style={{ paddingTop: "30px", paddingBottom: "30px" }} >
                <div className="row g-3">
                    <h1>Add New Availability</h1>
                    <div className="col-md-4">
                        <label htmlFor="availability_start" className="form-label">Start Date</label>
                        <input type="date" className="form-control" id="availability_end" required onChange={(event) => setNewStartDate(event.target.value)} value={newStartDate}></input>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="availability_start" className="form-label">End Date</label>
                        <input type="date" className="form-control" id="availability_end" required onChange={(event) => setNewEndDate(event.target.value)} value={newEndDate}></input>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="price" className="form-label">Price per night</label>
                        <input type="number" className="form-control" id="price" min="1" max="1000" required onChange={(event) => setNewPrice(event.target.value)} value={newPrice}></input>
                    </div>
                    <div className="col-md-12">
                        <button type="submit" className="btn btn-primary" onClick={addAvailability}>Add</button>
                    </div>

                    <h1>Current Availabilities for Property # {id}</h1>
                    {deleted && <div className="alert alert-success" style={{ paddingBottom: "0px" }} role="alert"><p className="text-center">Successfully Deleted Availability</p></div>}
                    {propertyAvailabilities.map((propertyAvailability, index) => (
                        <div className="row g-3" key={index}>
                            <div className="col-md-4">
                                <label htmlFor="availability_start" className="form-label">Start Date</label>
                                <input type="date" className="form-control" id="availability_end" value={propertyAvailability.start_date}></input>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="availability_start" className="form-label">End Date</label>
                                <input type="date" className="form-control" id="availability_end" value={propertyAvailability.end_date}></input>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="price" className="form-label">Price per night</label>
                                <input type="number" className="form-control" id="price" min="1" max="1000" value={propertyAvailability.price_per_night}></input>
                            </div>
                            <div className="col-md-10">
                                <button type="submit" className="btn btn-primary">Update</button>
                            </div>
                            <div className="col-md-2">
                                <button type="submit" className="btn btn-primary" style={{ backgroundColor: "red", borderColor: "red" }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = "orangered"}
                                    onMouseOut={(e) => e.target.style.backgroundColor = "red"}
                                    data-bs-toggle="modal" data-bs-target={`#delete-${propertyAvailability.id}`} >Delete</button>
                            </div>
                            <div className="modal fade" id={`delete-${propertyAvailability.id}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
                                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <h5 className="modal-title" id="staticBackdropLabel">Are you sure you want to delete availability # {propertyAvailability.id}?</h5>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                            <button type="button" className="btn btn-primary" onClick={(event) => deleteAvailability(propertyAvailability.id)} data-bs-dismiss="modal">Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </>
    );
};

export default PropertyAvailabilities;