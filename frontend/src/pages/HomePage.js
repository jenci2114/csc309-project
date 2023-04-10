import axios from "axios";
import {useState} from "react";

export default function HomePage() {
    const [propertySearch, setPropertySearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [guests, setGuests] = useState("");
    const [sortBy, setSortBy] = useState("name_asc")
    const [propertyList, setPropertyList] = useState([]);

    function resetFilter() {
        setPropertySearch("");
        setStartDate("");
        setEndDate("");
        setGuests("");
        setSortBy("name_asc");
    }

    async function handleSearch(e) {
        e.preventDefault();
        try {
            const response = await axios({
                method: 'get',
                url: 'http://127.0.0.1:8000/property/search/',
                params: {
                    search: propertySearch,
                    page: 1,
                    start_date: startDate,
                    end_date: endDate,
                    // num_beds: NOT IMPLEMENTED
                    num_guests: guests,
                    // num_bedrooms: NOT IMPLEMENTED
                    order_by: sortBy,
                }
            });

            for (let i = 0; i < response.data.results.length; i++) {
                // get image
                const id = response.data.results[i].id;
                response.data.results[i].image = await getImage(id);

                // get start date, end date, cheapest price, and priciest price
                const [startDate, endDate, cheapestPrice, priciestPrice] = await getDatesAndPrices(id);
                response.data.results[i].start_date = startDate;
                response.data.results[i].end_date = endDate;
                response.data.results[i].cheapest_price = cheapestPrice;
                response.data.results[i].priciest_price = priciestPrice;
            }

            setPropertyList(response.data.results);
        } catch (err) {
            alert(err);
        }
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

    async function getAvailability(id) {
        try {
            const response = await axios({
                method: 'get',
                url: `http://127.0.0.1:8000/property/availability/get/${id}/`,
            })
            return response.data;
        } catch (err) {
            alert(err);
        }
    }


    async function getDatesAndPrices(id) {
        return await getAvailability(id).then((data) => {
            if (data.length == 0) {
                return [null, null, null, null];
            } else {
                const earliestStart = data.reduce(
                    (prev, curr) => (prev.start_date < curr.start_date) ? prev : curr
                );
                const latestEnd = data.reduce(
                    (prev, curr) => (prev.end_date > curr.end_date) ? prev : curr
                );
                const cheapestPrice = data.reduce(
                    (prev, curr) => (prev.price_per_night < curr.price_per_night) ? prev : curr
                );
                const priciestPrice = data.reduce(
                    (prev, curr) => (prev.price_per_night > curr.price_per_night) ? prev : curr
                );
                return [earliestStart.start_date, latestEnd.end_date,
                    cheapestPrice.price_per_night, priciestPrice.price_per_night];
            }
        })
    }

    // async function getRating(id) {
    //     try {
    //         const response =
    //     }
    // }


    return (
        <div>
            <div className="container">
                <h1 className="fs-1 fw-semibold text-center">Search for properties</h1>

                <form className="row g-3" onSubmit={handleSearch}>
                    <div className="input-group col-md-12">
                        <span className="input-group-text"><i className="fa fa-search"></i></span>
                        <input type="text" className="form-control" placeholder="Search for properties"
                               id="search" value={propertySearch}
                               onChange={(e) => setPropertySearch(e.target.value)}/>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="startDate" className="form-label">Start Date</label>
                        <input type="date" id="startDate" className="form-control"
                               value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="endDate" className="form-label">End Date</label>
                        <input type="date" id="endDate" className="form-control" value={endDate}
                               onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="guests" className="form-label">Guests</label>
                        <input type="number" id="guests" className="form-control" value={guests}
                               onChange={(e) => setGuests(e.target.value)} />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="order" className="form-label">Sort by</label>
                        <select name="order" id="order" className="form-control" value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}>
                            <option value="name_asc">Name (A-Z)</option>
                            <option value="name_desc">Name (Z-A)</option>
                            <option value="price_desc">Price (High-Low)</option>
                            <option value="price_asc">Price (Low-High)</option>
                            <option value="rating_desc">Rating (High-Low)</option>
                        </select>
                    </div>
                    <div className="col-md-12 homeButtons">
                        <button type="button" className="btn btn-secondary"
                                onClick={resetFilter} style={{marginRight: "10px"}}>
                            Reset Filter
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Search
                        </button>
                    </div>
                </form>
                <br/>
                <div className="row row-cols-1 g-4 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
                    {propertyList.map(property => (
                        <div className="col" key={property.id}>
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
                                                className="fa fa-star"></span>{property.rating}
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
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
