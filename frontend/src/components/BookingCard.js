export default function BookingCard(booking) {
    booking = booking.booking;
    return (
        <div className="card h-100" style={{textAlign: 'left'}}>
            <a href=""> {/* view booking page */}
                <img src={booking.image} className="card-img-top" alt="..."/>
                <div className="card-body">
                    <h5 className="card-title">{booking.city}</h5>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                            <span className="fa fa-calendar"></span> {booking.start_date} -
                            <br/>
                            <span className="fa fa-calendar" style={{ visibility: 'hidden' }}></span> {booking.end_date}
                        </li>
                        <li className="list-group-item"><span
                            className="fa fa-money"></span> {booking.total_price}
                        </li>
                        <li className="list-group-item">
                            <button>Some sort of button</button>
                        </li>
                    </ul>
                </div>
            </a>
        </div>
    )
}
