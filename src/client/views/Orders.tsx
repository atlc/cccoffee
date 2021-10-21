import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { Orders } from '../../../types';
import OrderCard from '../components/OrderCard';
import { apiService } from '../utils/api-service';

const Orders = () => {
    const history = useHistory();
    const [orders, setOrders] = useState<Orders[]>([]);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        apiService('/api/orders')
            .then(data => {
                setOrders(data),
                setHasLoaded(true)
            });
    }, []);
    const handleSignOut = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        localStorage.clear();
        history.push('/login');
    }
    
    if (hasLoaded && orders.length === 0) {
        return <div className="h1 display-3 text-light text-center">no current orders...</div>;
    }
    return (
        <div>
            <div className="d-flex justify-content-end">
                {hasLoaded && <Link to="/profile" className="btn btn-dark text-light bg-dark mt-2">profile</Link>}
                {hasLoaded && <button onClick={handleSignOut} className="btn btn-dark text-light bg-dark mt-2">sign out</button>}
            </div>
            {hasLoaded && <h1 className="text-light mt-3 text-center display-4"><i className="bi bi-cup-fill"></i> orders </h1>}
            {orders.map((order) => (
                <OrderCard key={order.id} {...order} in_progress />
            ))}
        </div>
    )
}

export default Orders;
