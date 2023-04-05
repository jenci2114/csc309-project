import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Notification from "../components/Notification";

const HostNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const {isLoggedin} = useAuth();
  const [isDeleted, setIsDeleted] = useState(false);
  const [firstFetch, setFirstFetch] = useState(true);

  const fetchNotifications = async (url, headers) => {
    const response = await fetch(url, {headers});
    const data = await response.json();
    // if first time, fetch once only
    if (firstFetch) {
        setNotifications(data.results);
        setFirstFetch(false);
    } else {
        setNotifications((prevNotifications) => [
            ...prevNotifications,
            ...data.results,
        ]);
    }
    setNextPage(data.next);
  };

  useEffect(() => {
    const headers = {Authorization: `Bearer ${localStorage.token}`};
    fetchNotifications("http://127.0.0.1:8000/account/notifications/host/", headers);
  }, []);

  const loadMoreNotifications = () => {
    const headers = {Authorization: `Bearer ${localStorage.token}`};
    fetchNotifications(nextPage, headers);
  };

  const deleteViewedNotifications = async () => {
    const headers = {Authorization: `Bearer ${localStorage.token}`};
    await fetch("http://127.0.0.1:8000/account/notifications/host/delete/", {headers, method: "DELETE"});
    setNotifications([]);
    fetchNotifications("http://127.0.0.1:8000/account/notifications/host/", headers);
    setIsDeleted(true);
  }

  if (!isLoggedin) {
    return <Navigate to="/login/" />;
  }

  return (
    <>
    <div className="container" style={{paddingTop: "30px", paddingBottom: "30px"}}>
        <h1 className="display-4 text-center">Host Notifications</h1>

        <div style={{marginBottom: "30px", textAlign: 'right'}}>
            <button className="btn btn-primary" onClick={deleteViewedNotifications}>Delete Viewed Notifications</button>
        </div>

        {isDeleted && <div className="alert alert-success" style={{paddingBottom: "0px"}} role="alert"><p className="text-center">Successfully deleted viewed notifications</p></div>}

        {notifications.map((notification, index) => (
            <Notification
            key={index}
            msg={notification.msg}
            time={notification.time}
            userFrom={notification.user_from}
            />
        ))}
        <div style={{textAlign: "center"}}>
        {nextPage && <button className="btn btn-primary" onClick={loadMoreNotifications}>Load More</button>}
        {!nextPage && <p><b>End of Page</b></p>}
        </div>
      </div> 
    </>
  );
};

export default HostNotifications;