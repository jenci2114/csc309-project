import { useState, useEffect } from 'react';
import { Navigate, useParams, Link} from 'react-router-dom';
import useAuth from "../hooks/useAuth";


export default function EditProperty() {
    const { id } = useParams();
    const [propertyValid, setPropertyValid] = useState(true);
    const [propertyMine, setPropertyMine] = useState(true);
    const { isLoggedin, login } = useAuth();
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [province, setProvince] = useState("");
    const [zip, setZip] = useState("");
    const [beds, setBeds] = useState(0);
    const [baths, setBaths] = useState(0);
    const [guests, setGuests] = useState(0);
    const [description, setDescription] = useState("");
    const [edited, setEdited] = useState(false);
    const [deleted, setDeleted] = useState(false);


    function fetchPropertyData() {
        fetch(`http://127.0.0.1:8000/property/my/${id}/get/`, {
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
                setAddress(queryResult.address);
                setCity(queryResult.city);
                setProvince(queryResult.province);
                setZip(queryResult.zip);
                setBeds(queryResult.beds);
                setBaths(queryResult.bathrooms);
                setGuests(queryResult.max_guests);
                setDescription(queryResult.description);
            })
            .catch((error) => {
                console.error("Error:", error);
                if (error === 403){
                    setPropertyMine(false);
                } else{
                    setPropertyValid(false);
                }
            });
    }
    useEffect(() => {
        fetchPropertyData();
    }, []);


    if (!isLoggedin) {
        return <Navigate to="/login" />;
    }

    if (!propertyValid) {
        return <h1 className="display-4 text-center">Property does not exist</h1>;
    }

    if (!propertyMine) {
        return <h1 className="display-4 text-center">Property is not yours</h1>;
    }

    const editProperty = () => {
        if (address === "" || city === "" || province === "" || zip === "" || beds === 0 || baths === 0 || guests === 0 || description === "") {
            alert("Please fill out all fields");
            return;
        }

        fetch(`http://127.0.0.1:8000/property/update/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify({ address: address, city: city, province: province, zip: zip, beds: beds, bathrooms: baths, max_guests: guests, description: description }),
            headers: {
                Authorization: `Bearer ${localStorage.token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error));

        setEdited(true);
    };

    const deleteProperty = async () => {
        const headers = { Authorization: `Bearer ${localStorage.token}` };
        await fetch(`http://127.0.0.1:8000/property/delete/${id}/`, { headers, method: "DELETE" });
        setDeleted(true);
    }

    if (deleted) {
        return <Navigate to="/my_properties/" />;
    }


    return (
        <>
            <div className="container">

                <h1 className="fs-1 fw-semibold text-center">Edit property # {id}</h1>

                <div style={{ textAlign: 'right', paddingBottom: "30px"}}>
                    <Link to={`/property/${id}/availabilities/`} className="btn btn-primary">Add/Edit Availabilities</Link>
                </div>

                <div style={{ textAlign: 'right', paddingBottom: "30px" }}>
                    <Link to={`/property/${id}/images/`} className="btn btn-primary">Add/Edit Property Images</Link>
                </div>

                {edited && <div className="alert alert-success" style={{ paddingBottom: "0px" }} role="alert"><p className="text-center">Successfully Updated Property</p></div>}

                <div className="row g-3">
                    <div className="col-12">
                        <label htmlFor="inputAddress" className="form-label">Address</label>
                        <input type="text" className="form-control" id="inputAddress" placeholder="Apartment, studio, or floor" required onChange={(event) => setAddress(event.target.value)} value={address}></input>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="inputCity" className="form-label">City</label>
                        <input type="text" className="form-control" id="inputCity" required onChange={(event) => setCity(event.target.value)} value={city}></input>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="inputState" className="form-label">State/Province</label>
                        <select id="inputState" className="form-select" required onChange={(event) => setProvince(event.target.value)} value={province}>
                            <option value="">Choose...</option>
                            <option value="British Columbia">British Columbia</option>
                            <option value="California">California</option>
                            <option value="Ontario">Ontario</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <label htmlFor="inputZip" className="form-label">Zip</label>
                        <input type="text" className="form-control" id="inputZip" required onChange={(event) => setZip(event.target.value)} value={zip}></input>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="num_guests" className="form-label">Max # of Guests</label>
                        <input type="number" className="form-control" id="num_guests" min="0" max="100" required onChange={(event) => setGuests(event.target.value)} value={guests}></input>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="num_beds" className="form-label"># of Beds</label>
                        <input type="number" className="form-control" id="num_beds" min="0" max="100" required onChange={(event) => setBeds(event.target.value)} value={beds}></input>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="num_baths" className="form-label"># of Bathrooms</label>
                        <input type="number" className="form-control" id="num_baths" min="0" max="100" required onChange={(event) => setBaths(event.target.value)} value={baths}></input>
                    </div>
                    <div className="col-md-12">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea rows="3" className="form-control" id="description" required onChange={(event) => setDescription(event.target.value)} value={description}></textarea>
                    </div>
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary" onClick={editProperty}>Update property</button>
                    </div>
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary" style={{ backgroundColor: "red", borderColor: "red" }}
                            onMouseOver={(e) => e.target.style.backgroundColor = "orangered"}
                            onMouseOut={(e) => e.target.style.backgroundColor = "red"}
                            data-bs-toggle="modal" data-bs-target="#delete" >Remove property</button>
                    </div>
                </div>

                <div className="modal fade" id="delete" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
                    aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <h5 className="modal-title" id="staticBackdropLabel">Are you sure you want to delete this property?</h5>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={deleteProperty} data-bs-dismiss="modal">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}