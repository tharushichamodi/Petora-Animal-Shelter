import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GroomingReservations from './grooming_reservation';
import axios from 'axios';
import Header from './header';
function GroomingServices (){
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const packagesOnly = params.get('packagesOnly') === '1' || params.get('packagesOnly') === 'true';
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        const fetchPackages = async () => {
            try {
                const res = await axios.get('http://localhost:3001/groomingPackage/api/groomingPackages');
                if (!cancelled) {
                    setPackages(res.data || []);
                }
            } catch (e) {
                if (!cancelled) setError('Failed to load grooming packages.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetchPackages();
        return () => { cancelled = true; };
    }, []);

    const handleSelectPackage = (pkg) => {
        const mapped = {
            id: pkg._id,
            name: pkg.packageName,
            duration: '',
            price: pkg.price,
            description: pkg.description
        };
        try {
            localStorage.setItem('grooming.selectedPackage', JSON.stringify(mapped));
        } catch {}
        const el = document.getElementById('grooming-reservation-section');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return(
        <div className="CD_dashboard_layout">

            {packagesOnly && <Header />}

            <div className="CD_main_content_area">
                <h1>Grooming Services</h1>
                
                <section style={{ margin: '20px 0 32px 0' }}>
                    <h2 style={{ marginBottom: 12 }}>Grooming Packages</h2>
                    {loading && <div>Loading packages…</div>}
                    {error && <div style={{ color: 'crimson' }}>{error}</div>}
                    {!loading && !error && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 300px)',
                            justifyContent: 'center',
                            gap: '24px'
                        }}>
                            {packages.map((pkg) => (
                                <div key={pkg._id} style={{
                                    border: '1px solid #e5e7eb',
                                    borderRadius: 8,
                                    overflow: 'hidden',
                                    background: '#fff',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.06)'
                                }}>
                                    {pkg.photo ? (
                                        <img
                                            src={`http://localhost:3001/uploads/${pkg.photo}`}
                                            alt={pkg.packageName}
                                            style={{ width: '100%', height: 200, objectFit: 'contain', background: '#f3f4f6' }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: '100%', height: 200, background: '#f3f4f6',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280'
                                        }}>No image</div>
                                    )}
                                    <div style={{ padding: 12 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                            <h3 style={{ margin: 0, fontSize: 16 }}>{pkg.packageName}</h3>
                                            <div style={{ fontWeight: 600 }}>Rs. {pkg.price}</div>
                                        </div>
                                        {Array.isArray(pkg.species) && pkg.species.length > 0 && (
                                            <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>
                                                For: {pkg.species.join(', ')}
                                            </div>
                                        )}
                                        <p style={{ fontSize: 12, color: '#374151', marginTop: 8 }}>
                                            {pkg.description}
                                        </p>
                                        {pkg.servicesIncluded && (
                                            <div style={{ fontSize: 11, color: '#6b7280', marginTop: 6 }}>
                                                Services: {pkg.servicesIncluded}
                                            </div>
                                        )}
                                        <button
                                            onClick={() => handleSelectPackage(pkg)}
                                            style={{
                                                marginTop: 8,
                                                width: '100%',
                                                background: 'rgb(255, 160, 72)',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: 8,
                                                padding: '8px 10px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Select Package & Book
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {!packagesOnly && (
                    <div id="grooming-reservation-section">
                        <GroomingReservations />
                    </div>
                )}
            </div>
        </div>
    )
}

export default GroomingServices;

