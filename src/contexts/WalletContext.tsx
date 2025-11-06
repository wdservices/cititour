import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
  increment
} from "firebase/firestore";

export interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
  method: string;
  status: "completed" | "pending" | "failed";
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: "gcash" | "paymaya" | "credit" | "bank";
  description: string;
}

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  addFunds: (amount: number) => Promise<boolean>;
  withdrawFunds: (amount: number, withdrawalMethod: PaymentMethod, recipientCode?: string) => Promise<boolean>;
  deductFunds: (amount: number, description: string) => Promise<boolean>;
  getTransactionHistory: () => Transaction[];
  refreshBalance: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const serverBase = (import.meta as any)?.env?.VITE_SERVER_URL || "http://localhost:4000";

  // Load wallet data from Firestore when user changes
  useEffect(() => {
    const loadWallet = async () => {
      if (!user) return;
      const walletRef = doc(db, "wallets", user.id);
      const walletSnap = await getDoc(walletRef);
      if (walletSnap.exists()) {
        const data: any = walletSnap.data();
        setBalance(Number(data.balance || 0));
      } else {
        // Initialize wallet doc with zero balance
        await setDoc(walletRef, {
          userId: user.id,
          balance: 0,
          currency: "NGN",
          status: "active",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }, { merge: true });
        setBalance(0);
      }
      // Transactions list (optional display) can be fetched on demand; keep local-only sorted copy
    };
    loadWallet().catch((e) => console.error("Load wallet error", e));
  }, [user]);

  // Keep local copy of transactions sorted (for UI)
  useEffect(() => {
    setTransactions((prev) => prev.slice());
  }, [balance]);

  const addFunds = async (amount: number): Promise<boolean> => {
    if (!user) {
      toast({ title: "Login required", description: "Please sign in to fund your wallet.", variant: "destructive" });
      return false;
    }
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to fund your wallet.",
        variant: "destructive",
      });
      return false;
    }

    const loadPaystackScript = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        if ((window as any).PaystackPop) return resolve();
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Paystack script'));
        document.body.appendChild(script);
      });
    };

    try {
      const publicKey = (import.meta as any)?.env?.VITE_PAYSTACK_PUBLIC_KEY;
      if (!publicKey) {
        toast({ title: 'Configuration Error', description: 'Missing VITE_PAYSTACK_PUBLIC_KEY in .env', variant: 'destructive' });
        return false;
      }

      await loadPaystackScript();
      setIsLoading(true);

      const handler = (window as any).PaystackPop.setup({
        key: publicKey,
        email: user.email,
        amount: Math.round(Number(amount) * 100),
        currency: 'NGN',
        ref: `WALLET_${Date.now()}`,
        callback: async (response: any) => {
          try {
            const resp = await fetch(`${serverBase}/api/wallet/verify/${response.reference}`);
            const data = await resp.json();

            if (data?.status) {
              const credited = Number(data?.amount ?? amount);
              const walletRef = doc(db, 'wallets', user.id);
              await updateDoc(walletRef, { balance: increment(credited), updatedAt: serverTimestamp() });
              await addDoc(collection(db, 'wallets', user.id, 'transactions'), {
                userId: user.id,
                type: 'credit',
                amount: credited,
                description: 'Wallet Top-up',
                date: serverTimestamp(),
                method: 'Paystack',
                status: 'completed',
                referenceNumber: response.reference,
                createdAt: serverTimestamp(),
              });

              setBalance(prev => prev + credited);
              toast({ title: 'Wallet Funded', description: `₦${credited.toFixed(2)} has been added to your wallet.` });
            } else {
              toast({ title: 'Payment Failed', description: data?.message || 'Payment was not successful.', variant: 'destructive' });
            }
          } catch (error) {
            toast({ title: 'Verification Error', description: (error as any)?.message || 'Could not verify payment.', variant: 'destructive' });
          } finally {
            setIsLoading(false);
          }
        },
        onClose: () => {
          setIsLoading(false);
          toast({ title: 'Payment Cancelled', description: 'You closed the payment window.', variant: 'destructive' });
        },
      });

      handler.openIframe();
      return true;
    } catch (error) {
      toast({ title: 'Payment Error', description: (error as any)?.message || 'An unexpected error occurred.', variant: 'destructive' });
      return false;
    }
  };

  const withdrawFunds = async (amount: number, withdrawalMethod: PaymentMethod, recipientCode?: string): Promise<boolean> => {
    if (!user) {
      toast({ title: "Login required", description: "Please sign in to withdraw.", variant: "destructive" });
      return false;
    }
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to withdraw.",
        variant: "destructive",
      });
      return false;
    }

    if (balance < amount) {
      toast({
        title: "Insufficient Balance",
        description: `You need ₦${amount.toFixed(2)} but only have ₦${balance.toFixed(2)} in your wallet.`,
        variant: "destructive",
      });
      return false;
    }
    if (!recipientCode) {
      toast({ title: "Recipient Required", description: "Please provide a valid recipient code.", variant: "destructive" });
      return false;
    }

    setIsLoading(true);

    try {
      const resp = await fetch(`${serverBase}/api/wallet/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, recipient_code: recipientCode, reason: `Wallet withdrawal to ${withdrawalMethod.name}` }),
      });
      const data = await resp.json();
      if (!data?.status) {
        throw new Error(data?.message || 'Withdrawal failed');
      }

      // Update Firestore wallet and log transaction
      const walletRef = doc(db, 'wallets', user.id);
      await updateDoc(walletRef, { balance: increment(-amount), updatedAt: serverTimestamp() });
      await addDoc(collection(db, 'wallets', user.id, 'transactions'), {
        userId: user.id,
        type: 'debit',
        amount,
        description: 'Wallet Withdrawal',
        date: serverTimestamp(),
        method: withdrawalMethod.name,
        status: 'completed',
        referenceNumber: data?.data?.transfer_code || data?.data?.reference || 'N/A',
        createdAt: serverTimestamp(),
      });

      setBalance(prev => prev - amount);

      toast({
        title: "Withdrawal Successful",
        description: `₦${amount.toFixed(2)} has been withdrawn to ${withdrawalMethod.name}.`,
      });

      return true;
    } catch (error) {
      toast({
        title: "Withdrawal Error",
        description: (error as any)?.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deductFunds = async (amount: number, description: string): Promise<boolean> => {
    if (!user) {
      toast({ title: "Login required", description: "Please sign in to proceed.", variant: "destructive" });
      return false;
    }
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Invalid transaction amount.",
        variant: "destructive",
      });
      return false;
    }

    if (balance < amount) {
      toast({
        title: "Insufficient Balance",
        description: `You need ₦${amount.toFixed(2)} but only have ₦${balance.toFixed(2)} in your wallet.`,
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);

    try {
      const walletRef = doc(db, 'wallets', user.id);
      await updateDoc(walletRef, { balance: increment(-amount), updatedAt: serverTimestamp() });
      await addDoc(collection(db, 'wallets', user.id, 'transactions'), {
        userId: user.id,
        type: 'debit',
        amount,
        description,
        date: serverTimestamp(),
        method: 'Wallet',
        status: 'completed',
        createdAt: serverTimestamp(),
      });
      setBalance(prev => prev - amount);
      toast({ title: "Payment Successful", description: `₦${amount.toFixed(2)} has been deducted from your wallet.` });
      return true;
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: "An error occurred while processing the transaction.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionHistory = (): Transaction[] => {
    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const refreshBalance = () => {
    // Fetch latest balance from Firestore
    (async () => {
      try {
        if (!user) return;
        const walletRef = doc(db, 'wallets', user.id);
        const snap = await getDoc(walletRef);
        if (snap.exists()) {
          const data: any = snap.data();
          setBalance(Number(data.balance || 0));
        }
      } catch (e) {
        console.error('refreshBalance error', e);
      }
    })();
  };

  const value: WalletContextType = {
    balance,
    transactions,
    isLoading,
    addFunds,
    withdrawFunds,
    deductFunds,
    getTransactionHistory,
    refreshBalance,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};