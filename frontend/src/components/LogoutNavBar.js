export default function LogoutNavBar({handleLogin}) {
 return (<nav className="navbar navbar-expand-lg navbar-light bg-light">
 <div className="container-fluid">
<a className="navbar-brand" href="index">
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
    className="bi bi-r-square-fill" viewBox="0 0 16 16" style={{ marginRight: '10px' }}>
    <path d="M6.835 5.092v2.777h1.549c.995 0 1.573-.463 1.573-1.36 0-.913-.596-1.417-1.537-1.417H6.835Z" />
    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2Zm3.5 4.002h3.11c1.71 0 2.741.973 2.741 2.46 0 1.138-.667 1.94-1.495 2.24L11.5 12H9.98L8.52 8.924H6.836V12H5.5V4.002Z" />
  </svg>
  Restify
</a>
<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
  aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
  <span className="navbar-toggler-icon"></span>
</button>
<div className="collapse navbar-collapse" id="navbarSupportedContent">
  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
    <li className="nav-item">
      <a className="nav-link active" aria-current="page" href="index" id="home">Home</a>
    </li>
  </ul>

                <a href="register"><button type="button" className="btn btn-outline-primary" style={{ marginRight: '5px' }}>Sign up</button></a>
                <a href="/login"><button className="btn btn-outline-success" type="button">Login</button></a>

            </div>
        </div>
    </nav>);
}
