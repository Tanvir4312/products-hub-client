import React from 'react';
import ChangePasswordForm from './ChangePasswordForm';

const ChangePasswordPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-background to-background p-4">
            <div className="w-full max-w-6xl flex items-center justify-center">
                <ChangePasswordForm />
            </div>
        </div>
    );
};

export default ChangePasswordPage;