import { useState } from 'react';

interface SubscriptionButtonProps {
  storeId: string;
  plan?: string;
  buttonText?: string;
  className?: string;
}

export default function SubscriptionButton({
  storeId,
  plan = 'launch',
  buttonText = 'Subscribe Now',
  className = 'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
}: SubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ storeId, plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create subscription');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-3 text-sm text-red-600">
          {error}
        </div>
      )}
      <button
        onClick={handleSubscribe}
        disabled={isLoading}
        className={`${className} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isLoading ? 'Processing...' : buttonText}
      </button>
    </div>
  );
}