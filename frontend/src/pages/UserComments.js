import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import UserComment from "../components/UserComment";

const UserComments = () => {
  const [userComments, setUserComments] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [firstFetch, setFirstFetch] = useState(true);

  const fetchUserComments = async (url, headers) => {
    const response = await fetch(url, { headers });
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
  };

  useEffect(() => {
    const headers = { Authorization: `Bearer ${localStorage.token}` };
    fetchUserComments("http://127.0.0.1:8000/account/userComments/tenant/", headers);
  }, []);

  const loadMoreUserComments = () => {
    const headers = { Authorization: `Bearer ${localStorage.token}` };
    fetchUserComments(nextPage, headers);
  };

  return (
    <>
      <div className="container" style={{ paddingTop: "30px", paddingBottom: "30px" }}>
        <h1 className="display-4 text-center">Tenant UserComments</h1>

        {userComments.map((userComment, index) => (
          <UserComment
            key={index}
            msg={userComment.msg}
            time={userComment.time}
            userFrom={userComment.user_from}
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