import React, { useState, useEffect } from "react";

const Notification = ({ msg, time, userFrom }) => {
  return (
    <div>
      <p>{msg}</p>
      <p>{time}</p>
      <p>{userFrom}</p>
    </div>
  );
};

const HostNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [nextPage, setNextPage] = useState(null);

  const fetchNotifications = async (url, headers) => {
    const response = await fetch(url, {headers});
    const data = await response.json();
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      ...data.results,
    ]);
    setNextPage(data.next);
  };

  useEffect(() => {
    const isLoggedIn = true; // check if user is logged in
    if (!isLoggedIn) {
      window.location.href = "/login"; // redirect to login page
      return;
    }
    const headers = {Authorization: `Bearer ${localStorage.token}`};
    fetchNotifications("http://127.0.0.1:8000/account/notifications/host/", headers);
  }, []);

  const loadMoreNotifications = () => {
    fetchNotifications(nextPage);
  };

  return (
    <div>
      {notifications.map((notification, index) => (
        <Notification
          key={index}
          msg={notification.msg}
          time={notification.time}
          userFrom={notification.user_from}
        />
      ))}
      {nextPage && <button onClick={loadMoreNotifications}>Load More</button>}
    </div>
  );
};

export default HostNotifications;