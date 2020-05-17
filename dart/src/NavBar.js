import React from 'react';
import { Link }  from 'react-router-dom';

// images
import logoImg from './images/logo.png'

const NavBar = () => (
    <nav className="navbar nav-pills navbar-expand-lg navbar-light bg-light">
        <span className="navbar-brand mb-0 h1"><img src={logoImg} width="50" /></span>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="navbar-nav mr-auto">
        <ul className="navbar-nav">
            <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/create-model">Create Model</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/retrieve-model">Retrieve Model</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/export-model">Export Model</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/find-model">Find</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/doco">Documentation</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/exported-models"><b><span className='text-primary'>Exported Models</span></b></Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/find"><b><span className='text-primary'>Recommendations</span></b></Link>
            </li>
        </ul>
        </div>
    </nav>
);

export default NavBar;