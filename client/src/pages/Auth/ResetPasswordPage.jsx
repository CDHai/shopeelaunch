import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.password !== passwords.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: passwords.password }),
      });

      if (!response.ok) {
        throw new Error('Reset password failed');
      }

      toast.success('Password reset successful');
      navigate('/login');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-3xl font-bold text-center">Reset Your Password</h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Input
            label="New Password"
            type="password"
            value={passwords.password}
            onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
            required
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;