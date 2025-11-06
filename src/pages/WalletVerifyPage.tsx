import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, updateDoc, increment, serverTimestamp, collection, addDoc } from 'firebase/firestore';

const WalletVerifyPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'failed'>('idle');
  const [message, setMessage] = useState<string>('');
  const serverBase = (import.meta as any)?.env?.VITE_SERVER_URL || 'http://localhost:4000';

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reference = params.get('reference');
    if (!reference) {
      setStatus('failed');
      setMessage('Missing payment reference.');
      return;
    }
    if (!user) {
      setStatus('failed');
      setMessage('You must be logged in to complete funding.');
      return;
    }
    const verify = async () => {
      try {
        setStatus('verifying');
        const resp = await fetch(`${serverBase}/api/wallet/verify/${reference}`);
        const data = await resp.json();
        if (!data?.status) {
          throw new Error(data?.message || 'Verification failed');
        }
        const amount = Number(data?.amount || 0);
        // Credit wallet in Firestore
        const walletRef = doc(db, 'wallets', user.id);
        await updateDoc(walletRef, { balance: increment(amount), updatedAt: serverTimestamp() });
        await addDoc(collection(db, 'wallets', user.id, 'transactions'), {
          userId: user.id,
          type: 'credit',
          amount,
          description: 'Wallet Top-up',
          date: serverTimestamp(),
          method: 'Paystack',
          status: 'completed',
          referenceNumber: reference,
          createdAt: serverTimestamp(),
        });
        setStatus('success');
        setMessage(`Wallet funded successfully with ₦${amount.toFixed(2)}.`);
        toast({ title: 'Wallet funded', description: `₦${amount.toFixed(2)} added to your wallet.` });
        setTimeout(() => navigate('/wallet'), 1500);
      } catch (e) {
        console.error('Verification error', e);
        setStatus('failed');
        setMessage((e as any)?.message || 'Verification error');
        toast({ title: 'Verification failed', description: (e as any)?.message || 'Unable to verify payment.', variant: 'destructive' });
      }
    };
    verify();
  }, [location.search, user]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Wallet Funding Verification</CardTitle>
          <CardDescription>Confirming your Paystack payment…</CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'verifying' && <p>Verifying payment, please wait…</p>}
          {status === 'success' && <p className="text-green-600 font-medium">{message}</p>}
          {status === 'failed' && (
            <div>
              <p className="text-red-600 font-medium mb-3">{message}</p>
              <Button onClick={() => navigate('/wallet')}>Back to Wallet</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletVerifyPage;