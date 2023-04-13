import React, { useEffect, useState } from "react";
import axios from "axios";
import {Link} from "react-router-dom";

const statusList = [
  "pending",
  "approved",
  "canceling",
  "canceled",
  "denied",
  "terminated",
];

const user_type = "host";

export default function Reservation() {
  const [reservations, setReservations] = useState({});

  useEffect(() => {
    const fetchReservations = async () => {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.token}`,
        },
      };

      const reservationsObj = {};

      for (const status of statusList) {
        const formData = new FormData();
        formData.append("user_type", user_type);
        formData.append("state", status);

        const res = await axios.post(
          "http://127.0.0.1:8000/property/reservation_search/",
          formData,
          config
        );
        reservationsObj[status] = res.data;
      }

      setReservations(reservationsObj);
    };

    fetchReservations();
  }, []);

  const handleShowMore = async (status) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.token}`,
      },
    };

    if (reservations[status].next) {
      const formData = new FormData();
      formData.append("user_type", user_type);
      formData.append("state", status);

      const res = await axios.post(reservations[status].next, formData, config);
      setReservations({
        ...reservations,
        [status]: {
          ...res.data,
          results: [...reservations[status].results, ...res.data.results],
        },
      });
    }
  };


  const handleProcessPending = async (reservation_id, decision) => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    };

    await axios.put(
      "http://127.0.0.1:8000/property/process_pending/",
      { reservation_id, decision },
      config
    );
    // Refresh reservations to reflect the updated status
    window.location.reload();
  };

  const handleProcessCancel = async (reservation_id, decision) => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    };

    await axios.put(
      "http://127.0.0.1:8000/property/process_cancel/",
      { reservation_id, decision },
      config
    );
    window.location.reload();
  };

  const handleTerminate = async (reservation_id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    };

    await axios.put(
      "http://127.0.0.1:8000/property/terminate/",
      { reservation_id },
      config
    );
    window.location.reload();
  };


  const renderActionButtons = (status, reservation_id) => {
    if (status === "pending") {
      return (
        <>
          <button
            className="btn btn-success"
            onClick={() => handleProcessPending(reservation_id, true)}
          >
            Approve
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handleProcessPending(reservation_id, false)}
          >
            Deny
          </button>
        </>
      );
    } else if (status === "approved") {
      return ( <button
          className="btn btn-warning"
          onClick={() => handleTerminate(reservation_id)}
        >
          Terminate
        </button>
      );
    } else if (status === "canceling") {
      return (
        <>
          <button
            className="btn btn-success"
            onClick={() => handleProcessCancel(reservation_id, true)}
          >
            Approve
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handleProcessCancel(reservation_id, false)}
          >
            Deny
          </button>
        </>
      );
    }
    return null;
  };


  return (
      <>
  <center>
    <h1 style={{ margin: "50px" }}>Reservations to Your Properties</h1>
  </center>
  <div className="container-lg">
    <center>
      <div className="btn-group">
        {statusList.map((status, index) => (
          <button
            key={index}
            className="btn btn btn-outline-primary"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#collapse${index}`}
            aria-expanded={index === 0 ? "true" : "false"} // Set the first button to be expanded
            aria-controls={`collapse${index}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>
    </center>
    <div className="accordion" id="reservationAccordion" style={{ marginTop: "20px" }}>
      {statusList.map((status, index) => (
        <div key={index}>
          <div
            className={`collapse${index === 0 ? " show" : ""}`} // Add 'show' class to the first collapse element
            id={`collapse${index}`}
            data-bs-parent="#reservationAccordion"
          >
              <div className="row">
                {reservations[status] &&
                  reservations[status].results &&
                  reservations[status].results.map((reservation) => (
                    <div key={reservation.id} className="col-md-4 mb-3">
                      <div className="card">
                        <Link to={`/comments/user/${reservation.guest_id}/`}>
                        <div className="card-body">
                          <h5 className="card-title">Reservation #{reservation.id}</h5>
                          <p className="card-text">Status: {reservation.status}</p>
                          <p className="card-text">Guest: {reservation.guest}</p>
                          <p className="card-text">Host: {reservation.host}</p>
                          {/*<p className="card-text">Property: {reservation.property}</p>*/}
                          <p className="card-text">
                            Start Date: {reservation.start_date}
                          </p>
                      <p className="card-text">End Date: {reservation.end_date}</p>
                          <p className="card-text">Total Price: ${reservation.total_price}</p>

                        </div>
                        </Link>
                        {renderActionButtons(reservation.status, reservation.id)}
                        <Link to={`/comments/user/${reservation.guest_id}/`}>
                <div className="card-footer h-100">
                    <span className="fa fa-user-circle-o"></span> Tenant Info
                </div>
            </Link>
                      </div>
                    </div>
                  ))}
              </div>
              {reservations[status] && reservations[status].next ? (
                <button
                  className="btn btn-secondary mb-3"
                  onClick={() => handleShowMore(status)}
                >
                  Show more
                </button>
              ) : (
                <p className="mb-3">End of the list</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
        </>
  );
}

