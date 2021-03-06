import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users } from '../../../types';
import { apiService } from '../utils/api-service';

const Profile = () => {
    const [user, setUser] = useState<Users['id']>();
    useEffect(() => {
        apiService('/api/users')
            .then(data => setUser(data));
    }, []);
    return (
        <div className="card bg-light border border-3 shadow-lg rounded mt-2">
            <h1 className="card-title p-3">{user}</h1>
            <div className="card-body d-flex justify-content-center">
                <Link to="/" className="btn btn-light btn-lg">
                    <i className="bi bi-arrow-right-circle-fill"></i>
                </Link>
            </div>
        </div>
    )
}

export default Profile;
