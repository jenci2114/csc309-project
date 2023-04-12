import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PropertyImages = () => {
    const { id } = useParams();
    const [propertyImages, setPropertyImages] = useState([]);
    const [newImage, setNewImage] = useState("");
    const { isLoggedin, login } = useAuth();
    const [propertyImagesMine, setPropertyImagesMine] = useState(true);
    const [propertyImagesValid, setPropertyImagesValid] = useState(true);
    const [deleted, setDeleted] = useState(false);


    function fetchPropertyData() {
        fetch(`http://127.0.0.1:8000/property/my/image/get/${id}/`, {
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
                setPropertyImages(queryResult);
            })
            .catch((error) => {
                console.error("Error:", error);
                if (error === 403) {
                    setPropertyImagesMine(false);
                } else {
                    setPropertyImagesValid(false);
                }
            });
    }

    useEffect(() => {
        fetchPropertyData();
    }, []);

    const deleteImage = async (image_id) => {
        const headers = { Authorization: `Bearer ${localStorage.token}` };
        await fetch(`http://127.0.0.1:8000/property/image/delete/${image_id}/`, { headers, method: "DELETE" });
        setDeleted(true);
        setPropertyImages(propertyImages.filter((image) => image.id !== image_id));
    }

    const addImage = async () => {
        setDeleted(false);
        if ( newImage === "") {
            alert("Please upload an image");
            return;
        }

        const imageFile = document.getElementById("image").files[0];
        const formData = new FormData();
        formData.append("image", imageFile);
        await fetch(`http://127.0.0.1:8000/property/image/create/${id}/`, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${localStorage.token}`,
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setNewImage("");
                setPropertyImages([...propertyImages, newImage]);
                fetchPropertyData();
            })
            .catch(error => console.error(error));
        
    };

    if (!isLoggedin) {
        return <Navigate to="/login" />;
    }

    if (!propertyImagesValid) {
        return <h1 className="display-4 text-center">Property does not exist, cannot add/edit images</h1>;
    }

    if (!propertyImagesMine) {
        return <h1 className="display-4 text-center">Property is not yours, cannot add/edit images</h1>;
    }

    return (
        <>
            <div className="container" style={{ paddingTop: "30px", paddingBottom: "30px" }}>
                <div className="row g-3">
                    <h1>Add New Image</h1>
                    <div className="col-md-12">
                        <label htmlFor="image" className="form-label">New Image</label>
                        <input type="file" className="form-control" id="image" accept="image/*" required onChange={(event) => setNewImage(event.target.value)} value={newImage}></input>
                    </div>

                    <div className="col-12">
                        <button type="submit" className="btn btn-primary" onClick={addImage}>Add Image</button>
                    </div>

                    <h1>Current Images for Property # {id}</h1>
                    {deleted && <div className="alert alert-success" style={{ paddingBottom: "0px" }} role="alert"><p className="text-center">Successfully Deleted Image</p></div>}

                    {propertyImages.map((propertyImage, index) => (
                        <div key={index} style={{ textAlign: "center" }}>
                            <div className="col-md-12" style={{ paddingBottom: "10px" }}>
                                <img src={propertyImage.image} alt="propertyImage" />
                            </div>
                            <div className="col-md-12" style={{ paddingBottom: "20px" }}>
                                <button type="submit" className="btn btn-primary" style={{ backgroundColor: "red", borderColor: "red" }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = "orangered"}
                                    onMouseOut={(e) => e.target.style.backgroundColor = "red"}
                                    data-bs-toggle="modal" data-bs-target={`#delete-${propertyImage.id}`} >Remove Image</button>
                            </div>
                            <div className="modal fade" id={`delete-${propertyImage.id}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
                                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <h5 className="modal-title" id="staticBackdropLabel">Are you sure you want to delete image # {propertyImage.id}?</h5>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                            <button type="button" className="btn btn-primary" onClick={(event) => deleteImage(propertyImage.id)} data-bs-dismiss="modal">Delete</button>
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

export default PropertyImages;