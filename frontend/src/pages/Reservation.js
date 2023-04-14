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
      alert('Your have make your decision successfully');
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
    alert('Your have make your decision successfully');
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
    alert('Your have make your decision successfully');
    window.location.reload();
  };

    async function handleRate(e) {
        const rating = e.target.id.split('-star-')[0];
        const booking_id = e.target.id.split('-star-')[1];

        try {
            await axios({
                method: 'put',
                url: `http://localhost:8000/property/reservation/${booking_id}/host_to_user_rating/`,
                data: {
                    host_to_user_rating: rating,
                },
                headers: {
                    Authorization: `Bearer ${localStorage.token}`,
                }
            })
        } catch (err) {
            alert(err);
        }
    }


  const renderActionButtons = (reservation, status, reservation_id) => {
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
    } else if (status === "terminated") {
      return (
          <>
            <form action="" onInput={handleRate}>
                                <div className="stars">
                                    <input className="star star-5" id={`5-star-${reservation.id}`}
                                           type="radio" name="star"
                                           defaultChecked={reservation.host_to_user_rating === 5}/>
                                    <label className="star star-5"
                                           htmlFor={`5-star-${reservation.id}`}></label>
                                    <input className="star star-4" id={`4-star-${reservation.id}`}
                                           type="radio" name="star"
                                           defaultChecked={reservation.host_to_user_rating === 4}/>
                                    <label className="star star-4"
                                           htmlFor={`4-star-${reservation.id}`}></label>
                                    <input className="star star-3" id={`3-star-${reservation.id}`}
                                           type="radio" name="star"
                                           defaultChecked={reservation.host_to_user_rating === 3}/>
                                    <label className="star star-3"
                                           htmlFor={`3-star-${reservation.id}`}></label>
                                    <input className="star star-2" id={`2-star-${reservation.id}`}
                                           type="radio" name="star"
                                           defaultChecked={reservation.host_to_user_rating === 2}/>
                                    <label className="star star-2"
                                           htmlFor={`2-star-${reservation.id}`}></label>
                                    <input className="star star-1" id={`1-star-${reservation.id}`}
                                           type="radio" name="star"
                                           defaultChecked={reservation.host_to_user_rating === 1}/>
                                    <label className="star star-1"
                                           htmlFor={`1-star-${reservation.id}`}></label>
                                </div>
                            </form>
              {isComment(reservation)}
          </>
      )
    }
    return null;
  };

    async function submitComment(reservation_id) {
  const url = `http://127.0.0.1:8000/property/reservation/${reservation_id}/host_to_user_msg/`;
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.token}`,
    },
    body: JSON.stringify({ host_to_user_msg: document.getElementById(`comment${reservation_id}`).value }),
      // body: JSON.stringify({ host_to_user_msg: "test1" }),
  };

  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error('Failed to submit comment');
    }
  } catch (error) {
    console.error('Error:', error);
  }
  alert('Your have commented successfully');
  window.location.reload();
}

    const isComment = (reservation) => {
        if (!reservation.host_to_user_msg) {
            return (<>
    <input
      type="text"
      id={`comment${reservation.id}`}
      defaultValue=""
      placeholder="Enter your comment"
      // onChange={(e) => setCommentText(e.target.value)}
      className="form-control"
    />
    <button
      className="btn btn-dark"
      onClick={() => submitComment(reservation.id)}
    >
      Submit
    </button></>
            )
        }
        else return (
            <center>
                <p style={{ marginTop: "35px" }}>You have already commented</p></center>
        )
    }


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
                    <div key={reservation.id} className="col-md-3 mb-3">
                      <div className="card">
                        <Link to={`/reservation/view/${reservation.id}/`}>
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
                        {renderActionButtons(reservation, reservation.status, reservation.id)}
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

