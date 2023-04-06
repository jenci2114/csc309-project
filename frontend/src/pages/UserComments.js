import React, { useState, useEffect } from "react";
import UserComment from "../components/UserComment";
import { useParams } from "react-router-dom";

const UserComments = () => {
    const { id } = useParams();
    const [userComments, setUserComments] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [firstFetch, setFirstFetch] = useState(true);
    const [userValid, setUserValid] = useState(true);
    const [username, setUsername] = useState("");

    const fetchUser = async (url) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/account/username/${id}/`);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const data = await response.json();
            setUsername(data);
        } catch {
            setUserValid(false);
        }
    };


    const fetchUserComments = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const data = await response.json();
            // if first time, fetch once only
            if (firstFetch) {
                setUserComments(data.results);
                setFirstFetch(false);
            } else {
                setUserComments((prevUserComments) => [
                    ...prevUserComments,
                    ...data.results,
                ]);
            }
            setNextPage(data.next);
        } catch {
            setUserValid(false);
        }
    };

    useEffect(() => {
        fetchUserComments(`http://127.0.0.1:8000/property/comments/user/${id}/`);
    }, []);

    const loadMoreUserComments = () => {
        fetchUserComments(nextPage);
    };

    fetchUser();

    if (!userValid) {
        return <h1 className="display-4 text-center">User does not exist</h1>;
    }


    return (
        <>
            <div className="container" style={{ paddingTop: "30px", paddingBottom: "30px" }}>
                <h1 className="display-4 text-center">User: {username}</h1>

                {userComments.map((userComment, index) => (
                    <UserComment
                        key={index}
                        host={userComment.host}
                        host_to_user_msg={userComment.host_to_user_msg}
                        host_to_user_rating={userComment.host_to_user_rating}
                        end_date={userComment.end_date}
                    />
                ))}
                <div style={{ textAlign: "center" }}>
                    {nextPage && <button className="btn btn-primary" onClick={loadMoreUserComments}>Load More</button>}
                    {!nextPage && <p><b>End of Page</b></p>}
                </div>
            </div>
        </>
    );
};

export default UserComments;