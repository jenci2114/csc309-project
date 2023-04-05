const Notification = ({ msg, time, userFrom }) => {;
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

export default Notification;