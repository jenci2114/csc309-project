// import React, { useState } from "react";

// const PropertyComment = ({ reservation_id, comments}) => {
//     const [is_host, setIsHost] = useState(false);
//     const [is_tenant, setIsTenant] = useState(false);
//     const [rating, setRating] = useState(0);

//     const handleRatingChange = (event) => {
//         setRating(parseInt(event.target.value));
//     }

//     // TODO: update the rating to backend at reservation/<int:pk>/user_to_property_rating/
//     const updateRating = async (url) => {
//         try {
//             const response = await fetch(url, {
//                 method: "PUT",
//                 headers: {
//                     Authorization: `Bearer ${localStorage.token}`
//                 },
//                 body: JSON.stringify({ user_to_property_rating: rating }),
//             });
//             if (!response.ok) {
//                 throw new Error(response.statusText);
//             }
//             const data = await response.json();
//             console.log(data);

//         } catch {
//             console.log("error");
//         }
//     };


//     const comment_count = comments.length;

//     for (let i = 0; i < comment_count; i++) {
//         if (comments[i].user_from === localStorage.username) {
//             setIsHost(true);
//             break;
//         } else if (comments[i].user_from === localStorage.username) {
//             setIsTenant(true);
//             break;
//         }
//     }

//     const host_wait = is_host && (comment_count % 2 === 0);
//     const tenant_wait = is_tenant && (comment_count % 2 === 1);

//     return (
//         <>
//             {comments.map((comment) => (
//                 <div className="card" style={{ marginBottom: "30px", textAlign: "center" }}>
//                     <div className="card-header">
//                         <h5>From user: {comment.user_from}</h5>
//                     </div>
//                     <div className="card-body">

//                         <p>{comment.msg}</p>
//                         <div class="row" style={{display: comment.comment_number === 1 && is_tenant ? "block": "none"}}>
//                             <div class="col-md-12">
//                                 <div class="stars">
//                                     <form action="">
//                                         <input class="star star-5" id="first-star-5" type="radio" name="star" onChange={handleRatingChange}/>
//                                         <label class="star star-5" for="first-star-5"></label>
//                                         <input class="star star-4" id="first-star-4" type="radio" name="star" onChange={handleRatingChange}/>
//                                         <label class="star star-4" for="first-star-4"></label>
//                                         <input class="star star-3" id="first-star-3" type="radio" name="star" onChange={handleRatingChange}/>
//                                         <label class="star star-3" for="first-star-3"></label>
//                                         <input class="star star-2" id="first-star-2" type="radio" name="star" onChange={handleRatingChange}/>
//                                         <label class="star star-2" for="first-star-2"></label>
//                                         <input class="star star-1" id="first-star-1" type="radio" name="star" onChange={handleRatingChange}/>
//                                         <label class="star star-1" for="first-star-1"></label>
//                                     </form>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="card-footer text-muted h-100">
//                         <p># {comment.comment_number}</p>
//                     </div>
//                 </div>
//             ))}

//             <div className="card" style={{ marginBottom: "30px", textAlign: "center", display: (is_host || is_tenant) ? "block" : "none" }}>
//                 <div class="card-header" style={{ display: (!host_wait && !tenant_wait) ? "block" : "none" }}>
//                     <form>
//                         <div class="form-group">
//                             <label for="comment">Response:</label>
//                             <textarea class="form-control" rows="3" id="comment" required></textarea>
//                         </div>
//                         <button type="submit" class="btn btn-primary">Reply</button>
//                     </form>
//                 </div>
//                 <div class="card-header" style={{ display: (host_wait) ? "block" : "none" }}>
//                     <p>You have to wait for the tenant to reply before you can add more reply</p>
//                 </div>
//                 <div class="card-header" style={{ display: (tenant_wait) ? "block" : "none" }}>
//                     <p>You have to wait for the host to reply before you can add more reply</p>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default PropertyComment;

const PropertyComment = ({msg, comment_number, user_from}) => {

    const is_tenant = localStorage.username === user_from && comment_number % 2 === 1;
    console.log(localStorage.username);
    console.log(is_tenant);
    return (
        <>
            <div className="card" style={{textAlign: "center" }}>
                    <div className="card-header">
                        <h5>From user: {user_from}</h5>
                    </div>
                    <div className="card-body">

                        <p>{msg}</p>
                        <div class="row" style={{display: comment_number === 1 && is_tenant ? "block": "none"}}>
                            <div class="col-md-12">
                                <div class="stars">
                                    <form action="">
                                        <input class="star star-5" id="first-star-5" type="radio" name="star" />
                                        <label class="star star-5" for="first-star-5"></label>
                                        <input class="star star-4" id="first-star-4" type="radio" name="star"/>
                                        <label class="star star-4" for="first-star-4"></label>
                                        <input class="star star-3" id="first-star-3" type="radio" name="star"/>
                                        <label class="star star-3" for="first-star-3"></label>
                                        <input class="star star-2" id="first-star-2" type="radio" name="star"/>
                                        <label class="star star-2" for="first-star-2"></label>
                                        <input class="star star-1" id="first-star-1" type="radio" name="star"/>
                                        <label class="star star-1" for="first-star-1"></label>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </>
    );
  };

export default PropertyComment;