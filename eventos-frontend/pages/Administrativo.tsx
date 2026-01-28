import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Administrativo() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/admin/login');
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Redirigiendo...</p>
        </div>
    );
}
