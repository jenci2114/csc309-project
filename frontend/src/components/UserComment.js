const UserComment = ({ host, host_to_user_msg, host_to_user_rating, end_date }) => {;
    // if (!host_to_user_msg && !host_to_user_rating) {
    //     return null;
    // }
        
    return (
        <>
        <div className="card" style={{marginBottom: "30px", textAlign: "center"}}>
            <div className="card-header">
                <h5>From user: {host}</h5>
                </div>
                <div className="card-body" style={{ display: host_to_user_msg ? "block" : "none" }}>
                <p>{host_to_user_msg}</p>
                </div>
                <div className="card-body" style={{ display: host_to_user_msg ? "none" : "block" }}>
                <p>Waiting for the host to comment</p>
                </div>
                <div className="card-footer text-muted h-100">
                    <div  style={{ display: host_to_user_rating ? "block" : "none" }}><span className="fa fa-star"></span>{host_to_user_rating}</div>
                    <div><span>{end_date}</span></div>
                </div>
            </div>
        </>
    );
  };

export default UserComment;
