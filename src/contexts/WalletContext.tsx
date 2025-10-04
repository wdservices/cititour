import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";

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
  addFunds: (amount: number, paymentMethod: PaymentMethod) => Promise<boolean>;
  withdrawFunds: (amount: number, withdrawalMethod: PaymentMethod) => Promise<boolean>;
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
  const [balance, setBalance] = useState(1250.75);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "credit",
      amount: 500,
      description: "Wallet Top-up",
      date: "2024-01-15",
      method: "Credit Card",
      status: "completed"
    },
    {
      id: "2",
      type: "debit",
      amount: 150,
      description: "Ad Campaign - Hotels",
      date: "2024-01-14",
      method: "Wallet",
      status: "completed"
    },
    {
      id: "3",
      type: "credit",
      amount: 1000,
      description: "Wallet Top-up",
      date: "2024-01-10",
      method: "GCash",
      status: "completed"
    },
    {
      id: "4",
      type: "debit",
      amount: 99.25,
      description: "Event Ticket Promotion",
      date: "2024-01-08",
      method: "Wallet",
      status: "completed"
    },
    {
      id: "5",
      type: "credit",
      amount: 250,
      description: "Wallet Top-up",
      date: "2024-01-05",
      method: "PayMaya",
      status: "completed"
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Load wallet data from localStorage on mount
  useEffect(() => {
    const savedBalance = localStorage.getItem("wallet_balance");
    const savedTransactions = localStorage.getItem("wallet_transactions");
    
    if (savedBalance) {
      setBalance(parseFloat(savedBalance));
    }
    
    if (savedTransactions) {
      try {
        setTransactions(JSON.parse(savedTransactions));
      } catch (error) {
        console.error("Error parsing saved transactions:", error);
      }
    }
  }, []);

  // Save wallet data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wallet_balance", balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem("wallet_transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addFunds = async (amount: number, paymentMethod: PaymentMethod): Promise<boolean> => {
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to fund your wallet.",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate payment success (90% success rate)
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          type: "credit",
          amount,
          description: "Wallet Top-up",
          date: new Date().toISOString().split('T')[0],
          method: paymentMethod.name,
          status: "completed"
        };

        setBalance(prev => prev + amount);
        setTransactions(prev => [newTransaction, ...prev]);

        toast({
          title: "Wallet Funded Successfully",
          description: `₦${amount.toFixed(2)} has been added to your wallet.`,
        });

        return true;
      } else {
        const failedTransaction: Transaction = {
          id: Date.now().toString(),
          type: "credit",
          amount,
          description: "Wallet Top-up (Failed)",
          date: new Date().toISOString().split('T')[0],
          method: paymentMethod.name,
          status: "failed"
        };

        setTransactions(prev => [failedTransaction, ...prev]);

        toast({
          title: "Payment Failed",
          description: "There was an issue processing your payment. Please try again.",
          variant: "destructive",
        });

        return false;
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const withdrawFunds = async (amount: number, withdrawalMethod: PaymentMethod): Promise<boolean> => {
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

    setIsLoading(true);

    try {
      // Simulate withdrawal processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate withdrawal success (95% success rate)
      const isSuccess = Math.random() > 0.05;

      if (isSuccess) {
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          type: "debit",
          amount,
          description: "Wallet Withdrawal",
          date: new Date().toISOString().split('T')[0],
          method: withdrawalMethod.name,
          status: "completed"
        };

        setBalance(prev => prev - amount);
        setTransactions(prev => [newTransaction, ...prev]);

        toast({
          title: "Withdrawal Successful",
          description: `₦${amount.toFixed(2)} has been withdrawn from your wallet to ${withdrawalMethod.name}.`,
        });

        return true;
      } else {
        const failedTransaction: Transaction = {
          id: Date.now().toString(),
          type: "debit",
          amount,
          description: "Wallet Withdrawal (Failed)",
          date: new Date().toISOString().split('T')[0],
          method: withdrawalMethod.name,
          status: "failed"
        };

        setTransactions(prev => [failedTransaction, ...prev]);

        toast({
          title: "Withdrawal Failed",
          description: "There was an issue processing your withdrawal. Please try again.",
          variant: "destructive",
        });

        return false;
      }
    } catch (error) {
      toast({
        title: "Withdrawal Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deductFunds = async (amount: number, description: string): Promise<boolean> => {
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
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "debit",
        amount,
        description,
        date: new Date().toISOString().split('T')[0],
        method: "Wallet",
        status: "completed"
      };

      setBalance(prev => prev - amount);
      setTransactions(prev => [newTransaction, ...prev]);

      toast({
        title: "Payment Successful",
        description: `₦${amount.toFixed(2)} has been deducted from your wallet.`,
      });

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
    // In a real app, this would fetch the latest balance from the server
    const savedBalance = localStorage.getItem("wallet_balance");
    if (savedBalance) {
      setBalance(parseFloat(savedBalance));
    }
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