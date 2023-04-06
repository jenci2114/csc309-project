import React, { useState, useEffect } from "react";
import PropertyComment from "../components/PropertyComment";
import { useParams } from "react-router-dom";

const PropertyComments = () => {
    const { id } = useParams();
    const [propertyComments, setPropertyComments] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [firstFetch, setFirstFetch] = useState(true);
    const [propertyValid, setPropertyValid] = useState(true);

    const fetchProperty = async (url) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/property/comments/property/${id}/`);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const data = await response.json();
        } catch {
            setPropertyValid(false);
        }
    };


    const fetchPropertyComments = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const data = await response.json();
            // if first time, fetch once only
            if (firstFetch) {
                setPropertyComments(data.results);
                setFirstFetch(false);
            } else {
                setPropertyComments((prevPropertyComments) => [
                    ...prevPropertyComments,
                    ...data.results,
                ]);
            }
            console.log(propertyComments);
            setNextPage(data.next);
        } catch {
            setPropertyValid(false);
        }
    };

    useEffect(() => {
        fetchPropertyComments(`http://127.0.0.1:8000/property/comments/property/${id}/`);
    }, []);

    const loadMorePropertyComments = () => {
        fetchPropertyComments(nextPage);
    };

    fetchProperty();

    if (!propertyValid) {
        return <h1 className="display-4 text-center">Property does not exist</h1>;
    }


    return (
        <>
            <div className="container" style={{ paddingTop: "30px", paddingBottom: "30px" }}>
                <h1 className="display-4 text-center">Property Comments</h1>

                {Object.keys(propertyComments.results).map((key) => (
                    propertyComments.results[key].map((comment, index) => (
                        <PropertyComment
                            key={index}
                            msg={comment.msg}
                            comment_number={comment.comment_number}
                            user_from={comment.user_from}
                        />
                    ))
                ))}
                <div style={{ textAlign: "center" }}>
                    {nextPage && <button className="btn btn-primary" onClick={loadMorePropertyComments}>Load More</button>}
                    {!nextPage && <p><b>End of Page</b></p>}
                </div>
            </div>
        </>
    );
};

export default PropertyComments;