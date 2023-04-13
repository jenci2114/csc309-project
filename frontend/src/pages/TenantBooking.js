import React, {useEffect, useState} from "react";
import axios from "axios";
import BookingCard from "../components/BookingCard";

export default function TenantBooking() {
    const [bookingType, setBookingType] = useState('pending');
    const [bookingList, setBookingList] = useState([]);

    const [nextPage, setNextPage] = useState(null);

    const handleBookingTypeChange = (e) => {
        setBookingType(e.target.value);
    }

    async function getImage(id) {
        try {
            const response = await axios({
                method: 'get',
                url: `http://127.0.0.1:8000/property/image/get/${id}/`,
            })
            if (response.data.results == []) {
                return null;
            } else {
                return response.data[0].image;
            }
        } catch (err) {
            alert(err);
        }
    }


    async function getCity(id) {
        try {
            const response = await axios({
                method: 'get',
                url: `http://127.0.0.1:8000/property/${id}/get/`,
            })
            return response.data.city;
        } catch (err) {
            alert(err);
        }
    }

    async function getHasComment(id) {
        try {
            const response = await axios({
                method: 'get',
                url: `http://localhost:8000/property/comments/reservation/${id}/`,
                headers: {
                    Authorization: `Bearer ${localStorage.token}`,
                }
            })
            return response.data.length > 0;
        } catch (err) {
            alert(err);
        }
    }

    async function handleSearch() {
        try {
            const response = await axios({
                method: 'post',
                url: 'http://localhost:8000/property/reservation_search/',
                data: {
                    user_type: 'guest',
                    state: bookingType,
                },
                headers: {
                    Authorization: `Bearer ${localStorage.token}`,
                }
            });

            for (let i = 0; i < response.data.results.length; i++) {
                // get image
                const id = response.data.results[i].property;
                response.data.results[i].image = await getImage(id);

                // get city
                response.data.results[i].city = await getCity(id);

                // get has comment
                response.data.results[i].has_comment = await getHasComment(response.data.results[i].id);
            }

            setBookingList(response.data.results);
            setNextPage(response.data.next)
        } catch (e) {
            alert(e);
        }
    }

    useEffect(() => {
        handleSearch();
    }, [bookingType])

    async function loadNextPage() {
        try {
            const response = await axios({
                method: 'post',
                url: nextPage,
                data: {
                    user_type: 'guest',
                    state: bookingType,
                },
                headers: {
                    Authorization: `Bearer ${localStorage.token}`,
                }
            });

            for (let i = 0; i < response.data.results.length; i++) {
                // get image
                const id = response.data.results[i].property;
                response.data.results[i].image = await getImage(id);

                // get city
                response.data.results[i].city = await getCity(id);

                // get has comment
                response.data.results[i].has_comment = await getHasComment(response.data.results[i].id);
            }
            setBookingList(bookingList.concat(response.data.results));
            setNextPage(response.data.next);
        } catch (err) {
            alert(err);
        }
    }

    return (<>
        <div className="container" style={{textAlign: 'center'}}>
            <h1 className="fs-1 fw-semibold text-center">Booking</h1>
            <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                <input type="radio" data-bs-toggle="collapse" data-bs-target=".pending"
                       aria-expanded="false" aria-controls="pending" className="btn-check"
                       name="btnradio" id="btnradio1" autoComplete="off" value="pending"
                       checked={bookingType === "pending"} onChange={handleBookingTypeChange}/>
                <label className="btn btn-outline-primary" htmlFor="btnradio1">Pending</label>

                <input type="radio" data-bs-toggle="collapse" data-bs-target=".approved"
                       aria-expanded="false" aria-controls="approved" className="btn-check"
                       name="btnradio" id="btnradio2" autoComplete="off" value="approved"
                       checked={bookingType === "approved"} onChange={handleBookingTypeChange}/>
                <label className="btn btn-outline-primary" htmlFor="btnradio2" >Approved</label>

                <input type="radio" data-bs-toggle="collapse" data-bs-target=".canceled"
                       aria-expanded="false" aria-controls="canceled" className="btn-check"
                       name="btnradio" id="btnradio3" autoComplete="off" value="canceled"
                       checked={bookingType === "canceled"} onChange={handleBookingTypeChange}/>
                <label className="btn btn-outline-primary"
                       htmlFor="btnradio3">Cancelled</label>

                <input type="radio" data-bs-toggle="collapse" data-bs-target=".canceling"
                       aria-expanded="false" aria-controls="canceling" className="btn-check"
                       name="btnradio" id="btnradio4" autoComplete="off" value="canceling"
                       checked={bookingType === "canceling"} onChange={handleBookingTypeChange}/>
                <label className="btn btn-outline-primary"
                       htmlFor="btnradio4">Cancelling</label>

                <input type="radio" data-bs-toggle="collapse" data-bs-target=".denied"
                       aria-expanded="false" aria-controls="denied" className="btn-check"
                       name="btnradio" id="btnradio5" autoComplete="off" value="denied"
                       checked={bookingType === "denied"} onChange={handleBookingTypeChange}/>
                <label className="btn btn-outline-primary"
                       htmlFor="btnradio5">Denied</label>

                <input type="radio" data-bs-toggle="collapse" data-bs-target=".terminated"
                       aria-expanded="false" aria-controls="terminated" className="btn-check"
                       name="btnradio" id="btnradio6" autoComplete="off" value="terminated"
                       checked={bookingType === "terminated"} onChange={handleBookingTypeChange}/>
                <label className="btn btn-outline-primary"
                       htmlFor="btnradio6">Terminated</label>
            </div>
            <br/>
            <br/>
            <div className="row row-cols-1 g-4 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
                {bookingList.map(booking => (
                    <div className="col" key={booking.id}>
                        <BookingCard booking={booking} bookingType={bookingType}/>
                    </div>
                ))}
                </div>
                {nextPage != null ? (
                    <div style={{ textAlign: "center", margin: '30px' }}>
                      <button className="btn btn-primary" onClick={loadNextPage}>Load More</button>
                    </div>
                ) : (
                    <div style={{ textAlign: "center", margin: '30px' }}>
                      <p><b>End of Page</b></p>
                    </div>
                )}
        </div>
    </>)
}
