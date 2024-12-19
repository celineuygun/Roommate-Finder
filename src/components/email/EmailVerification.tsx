import React, { useEffect, useState } from 'react';
import { Header } from '../layout/Header';
import { Button } from '../ui/Button';
import { useTranslation } from '../../translate/useTranslations';

export const EmailVerification: React.FC = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const { t } = useTranslation();
  const [verificationMessage, setVerificationMessage] = useState('Verifying email...');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      fetch(`${API_BASE_URL}/api/auth/verify-email?token=${token}`)
        .then((res) => res.json())
        .then((data) => {
          setVerificationMessage(data.message || 'Verifying email...');
          if (data.message === 'Email successfully verified.') {
            setIsVerified(true);
          }
        })
        .catch(() => {
          setVerificationMessage(t("email_error_message"));
        });
    } else {
      setVerificationMessage('Invalid verification token.');
    }
  }, []);

  const handleRedirect = () => {
    window.location.href = isVerified ? '/signin' : '/';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900  p-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">{t("email_welcome_back")}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            {verificationMessage === 'Email is successfully verified.'
                ? t("email_success_message")
                : verificationMessage}
        </p>
        <Button
          onClick={handleRedirect}
          className="bg-blue-600 dark:bg-slate-600 hover:bg-blue-700 dark:hover:bg-slate-800 text-white py-2 px-4 rounded hover:bg-slate-700"
        >
          {isVerified ? t("go_to_sign_in") : t("go_to_home")}
        </Button>
      </div>
    </div>
  );
};
