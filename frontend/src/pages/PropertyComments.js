import React, { useState, useEffect } from "react";
import PropertyComment from "../components/PropertyComment";
import { useParams } from "react-router-dom";

const PropertyComments = () => {
    const { id } = useParams();
    const [propertyComments, setPropertyComments] = useState({});
    const [nextPage, setNextPage] = useState(null);
    const [firstFetch, setFirstFetch] = useState(true);
    const [propertyValid, setPropertyValid] = useState(true);


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
                setPropertyComments((prevPropertyComments) => ({
                    ...prevPropertyComments,
                    ...data.results
                }));
            }
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

    if (!propertyValid) {
        return <h1 className="display-4 text-center">Property does not exist</h1>;
    }

    return (
        <>
            <div className="container" style={{ paddingTop: "30px", paddingBottom: "30px" }}>
                <h1 className="display-4 text-center">Property Comments</h1>

                {Object.keys(propertyComments).map((key) => (
                    <div key={key} style={{ marginTop: "30px" }}>
                        <h5>Reservation #{key}</h5>
                        {propertyComments[key].map((comment, index) => (
                            <PropertyComment
                                key={index}
                                reservation_id={key}
                                msg={comment.msg}
                                comment_number={comment.comment_number}
                                user_from={comment.user_from}
                                len={propertyComments[key].length}
                            />
                        ))}
                    </div>
                ))}
                <div style={{ textAlign: "center", marginTop: "30px" }}>
                    {nextPage && <button className="btn btn-primary" onClick={loadMorePropertyComments}>Load More</button>}
                    {!nextPage && <p><b>End of Page</b></p>}
                </div>
            </div>
        </>
    );
};

export default PropertyComments;