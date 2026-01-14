import { useEffect } from 'react';
import useStore from '../zustand/store';

const AuthDebug = () => {
    const { user, isAuthenticated } = useStore();

    useEffect(() => {
        console.log('=== AUTH DEBUG INFO ===');
        console.log('Is Authenticated:', isAuthenticated);
        console.log('User Object:', user);
        console.log('User Role:', user?.role);
        console.log('User Type:', user?.userType);
        console.log('User Role/Type (used for routing):', user?.role || user?.userType);

        // Check localStorage
        const authStorage = localStorage.getItem('auth-storage');
        console.log('LocalStorage auth-storage:', authStorage);

        // Check cookies
        const cookies = document.cookie;
        console.log('Cookies:', cookies);

        console.log('======================');
    }, [user, isAuthenticated]);

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: '#1a1a1a',
            color: '#fff',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '400px',
            fontSize: '12px',
            fontFamily: 'monospace',
            zIndex: 9999,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#4ade80' }}>🔍 Auth Debug</h3>

            <div style={{ marginBottom: '10px' }}>
                <strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}
            </div>

            <div style={{ marginBottom: '10px' }}>
                <strong>User Name:</strong> {user?.name || 'N/A'}
            </div>

            <div style={{ marginBottom: '10px' }}>
                <strong>User Role:</strong> {user?.role || 'undefined'}
            </div>

            <div style={{ marginBottom: '10px' }}>
                <strong>User Type:</strong> {user?.userType || 'undefined'}
            </div>

            <div style={{ marginBottom: '10px' }}>
                <strong>Effective Role:</strong> {user?.role || user?.userType || 'NONE'}
            </div>

            <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #333' }}>
                <button
                    onClick={() => {
                        localStorage.clear();
                        document.cookie.split(";").forEach(c => {
                            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                        });
                        window.location.reload();
                    }}
                    style={{
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: 'bold'
                    }}
                >
                    Clear Auth & Reload
                </button>
            </div>

            <div style={{ marginTop: '10px', fontSize: '10px', color: '#888' }}>
                Check browser console for detailed logs
            </div>
        </div>
    );
};

export default AuthDebug;
