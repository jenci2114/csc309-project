export default function PropertyCard(property) {
    property = property.property;
    return (
        <div className="card h-100">
            <a href={`property/view/${property.id}/`}> {/* view property page */}
                <img src={property.image} className="card-img-top" alt="..."/>
                <div className="card-body">
                    <h5 className="card-title">{property.city}</h5>
                    <ul className="list-group list-group-flush">
                        {property.start_date == null ? (
                            <li className="list-group-item">
                                <span className="fa fa-calendar"></span> Not Available
                                <br/>
                                <span className="fa fa-calendar" style={{ visibility: 'hidden' }}></span>
                            </li>
                        ) : (
                            <li className="list-group-item">
                                <span className="fa fa-calendar"></span> {property.start_date} -
                                <br/>
                                <span className="fa fa-calendar" style={{ visibility: 'hidden' }}></span> {property.end_date}
                            </li>
                        )}
                        {property.cheapest_price == null ? (
                            <li className="list-group-item"><span
                                className="fa fa-money"></span> Not Available
                            </li>
                        ) : property.cheapest_price == property.priciest_price ? (
                            <li className="list-group-item"><span
                                className="fa fa-money"></span> ${property.cheapest_price}
                            </li>
                        ) : (
                            <li className="list-group-item"><span
                                className="fa fa-money"></span> ${property.cheapest_price}-{property.priciest_price}
                            </li>
                        )}
                        <li className="list-group-item"><span
                            className="fa fa-bed"></span> {property.beds}
                        </li>
                        <li className="list-group-item"><span
                            className="fa fa-star"></span> {property.rating}
                        </li>
                    </ul>
                </div>
            </a>
            <a href=""> {/* view comments page */}
                <div className="card-footer h-100">
                    <span className="fa fa-bell"></span> Comments
                </div>
            </a>
        </div>
    )
}
