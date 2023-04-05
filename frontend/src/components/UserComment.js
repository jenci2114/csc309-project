const UserComment = ({ msg, time, userFrom }) => {;
    const dateTime = new Date(time);
    const date = dateTime.toLocaleDateString();
    const hour = dateTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const trimmedDateTime = `${date} at ${hour}`; 
    return (
        <>
        <div className="card" style={{marginBottom: "30px"}}>
            <div className="card-header">
                <h5>From user: {userFrom}</h5>
                </div>
                <div className="card-body">
                <p>{msg}</p>
                </div>
                <div className="card-footer text-muted h-100">
                    {trimmedDateTime}
                </div>
            </div>
        </>
    );
  };

export default UserComment;

// http://127.0.0.1:8000/property/comments/user/1/

// {
//     "count": 1,
//     "next": null,
//     "previous": null,
//     "results": [
//         {
//             "host": "b",
//             "property": 4,
//             "start_date": "2023-03-20",
//             "end_date": "2023-03-30",
//             "host_to_user_rating": null,
//             "host_to_user_msg": ""
//         }
//     ]
// }