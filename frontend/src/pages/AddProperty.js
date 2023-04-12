import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from "../hooks/useAuth";


export default function AddProperty() {
    const {isLoggedin, login} = useAuth();
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [province, setProvince] = useState("");
    const [zip, setZip] = useState("");
    const [beds, setBeds] = useState(0);
    const [baths, setBaths] = useState(0);
    const [guests, setGuests] = useState(0);
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [property_id, setPropertyId] = useState(0);


    if (!isLoggedin) {
        return <Navigate to="/login"/>;
    }

    const addProperty = () => {
        if (address === "" || city === "" || province === "" || zip === "" || beds === 0 || baths === 0 || guests === 0 || description === "" || image === "") {
            alert("Please fill out all fields");
            return;
        }

        const imageFile = document.getElementById("image").files[0];

        fetch(`http://127.0.0.1:8000/property/create/`, {
            method: 'POST',
            body: JSON.stringify({ address: address, city: city, province: province, zip: zip, beds: beds, bathrooms: baths, max_guests: guests, description: description}),
            headers: {
                Authorization: `Bearer ${localStorage.token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setPropertyId(data.id);
            })
            .catch(error => console.error(error));

        
        if (property_id !== 0) {
            const formData = new FormData();
            formData.append("image", imageFile);
            fetch(`http://127.0.0.1:8000/property/image/create/${property_id}/`, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.token}`,
                }
            })
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(error => console.error(error));
        }   
    };

    return (
        <>
        <div className="container">
        <h1 className="fs-1 fw-semibold text-center">Add property</h1>

        <div className="row g-3">
            <div className="col-12">
              <label htmlFor="inputAddress" className="form-label">Address</label>
              <input type="text" className="form-control" id="inputAddress" placeholder="Apartment, studio, or floor" required onChange={(event) => setAddress(event.target.value)}></input>
            </div>
            <div className="col-md-6">
              <label htmlFor="inputCity" className="form-label">City</label>
              <input type="text" className="form-control" id="inputCity" required onChange={(event) => setCity(event.target.value)}></input>
            </div>
            <div className="col-md-4">
              <label htmlFor="inputState" className="form-label">State/Province</label>
              <select id="inputState" className="form-select" required defaultValue="" onChange={(event) => setProvince(event.target.value)}>
                <option value="">Choose...</option>
                <option value="British Columbia">British Columbia</option>
                <option value="California">California</option>
                <option value="Ontario">Ontario</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="col-md-2">
              <label htmlFor="inputZip" className="form-label">Zip</label>
              <input type="text" className="form-control" id="inputZip" required onChange={(event) => setZip(event.target.value)}></input>
            </div>
            <div className="col-md-4">
                <label htmlFor="num_guests" className="form-label">Max # of Guests</label>
                <input type="number" className="form-control" id="num_guests" min="0" max="100" required defaultValue="0" onChange={(event) => setGuests(event.target.value)}></input>
              </div>
              <div className="col-md-4">
                <label htmlFor="num_beds" className="form-label"># of Beds</label>
                <input type="number" className="form-control" id="num_beds" min="0" max="100" required defaultValue="0" onChange={(event) => setBeds(event.target.value)}></input>
              </div>
              <div className="col-md-4">
                <label htmlFor="num_baths" className="form-label"># of Bathrooms</label>
                <input type="number" className="form-control" id="num_baths" min="0" max="100" required defaultValue="0" onChange={(event) => setBaths(event.target.value)}></input>
              </div>
              <div className="col-md-12">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea rows="3" className="form-control" id="description" required onChange={(event) => setDescription(event.target.value)}></textarea>
              </div>
              <div className="col-md-12">
                <label htmlFor="image" className="form-label">Image</label>
                <input type="file" className="form-control" id="image" accept="image/*" required onChange={(event) => setImage(event.target.value)}></input>
              </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary" onClick={addProperty}>Add property</button>
            </div>

        </div>
    </div>
    </>
    );
}