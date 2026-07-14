import React, { useState } from "react";
import { ArrowLeft, Plus, Minus, CreditCard, Smartphone, Building, History, TrendingUp, Megaphone, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useWallet, PaymentMethod } from "@/contexts/WalletContext";
import { useAuth } from "@/contexts/AuthContext";
import StampIcon from "@/components/StampIcon";

const WalletPage = () => {
  const navigate = useNavigate();
  const { balance, transactions, isLoading, addFunds, withdrawFunds, getTransactionHistory } = useWallet();
  const { user } = useAuth();
  const serverBase = (import.meta as any)?.env?.VITE_SERVER_URL || "http://localhost:4000";
  const [fundAmount, setFundAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  // Removed payment method selection for funding; Paystack modal handles payment method.
  const [selectedWithdrawalMethod, setSelectedWithdrawalMethod] = useState("");
  const [showFundDialog, setShowFundDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [recipientCode, setRecipientCode] = useState("");
  const [showRecipientDialog, setShowRecipientDialog] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [recipientLoading, setRecipientLoading] = useState(false);

  const paymentMethods: (PaymentMethod & { icon: any })[] = [
    { id: "gcash", name: "GCash", type: "gcash", icon: Smartphone, description: "Mobile wallet payment" },
    { id: "paymaya", name: "PayMaya", type: "paymaya", icon: Smartphone, description: "Digital wallet" },
    { id: "credit", name: "Credit Card", type: "credit", icon: CreditCard, description: "Visa, Mastercard" },
    { id: "bank", name: "Bank Transfer", type: "bank", icon: Building, description: "Online banking" },
  ];

  const stampActions = [
    { id: "add", title: "Add Money", icon: Plus, tone: "primary" as const, rotate: "-rotate-6" as const, onClick: () => setShowFundDialog(true) },
    { id: "send", title: "Withdraw", icon: Minus, tone: "accent" as const, rotate: "rotate-3" as const, onClick: () => setShowWithdrawDialog(true) },
    { id: "history", title: "History", icon: History, tone: "success" as const, rotate: "-rotate-3" as const, onClick: () => document.getElementById("wallet-history")?.scrollIntoView({ behavior: "smooth" }) },
    { id: "run-ads", title: "Run Ads", icon: Megaphone, tone: "primary-dark" as const, rotate: "rotate-6" as const, onClick: () => handleQuickAction({ id: "run-ads", title: "Run Ads", description: "Promote your business", icon: Megaphone, route: "/run-ads", minAmount: 50 }) },
    { id: "event-tickets", title: "Tickets", icon: Ticket, tone: "primary" as const, rotate: "-rotate-3" as const, onClick: () => handleQuickAction({ id: "event-tickets", title: "Event Tickets", description: "Promote events", icon: Ticket, route: "/event-tickets", minAmount: 25 }) },
  ];

  const handleFundWallet = async () => {
    if (!fundAmount || parseFloat(fundAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to fund your wallet.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(fundAmount);
    const success = await addFunds(amount);
    
    if (success) {
      setFundAmount("");
    }
  };

  const handleWithdrawFunds = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to withdraw.",
        variant: "destructive",
      });
      return;
    }

    if (!recipientCode) {
      toast({
        title: "Recipient Code Required",
        description: "Please enter your Paystack recipient code.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedWithdrawalMethod) {
      toast({
        title: "Withdrawal Method Required",
        description: "Please select a withdrawal method.",
        variant: "destructive",
      });
      return;
    }

    const selectedMethod = paymentMethods.find(method => method.id === selectedWithdrawalMethod);
    if (!selectedMethod) {
      toast({
        title: "Invalid Withdrawal Method",
        description: "Please select a valid withdrawal method.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(withdrawAmount);
    const success = await withdrawFunds(amount, selectedMethod, recipientCode);
    
    if (success) {
      setWithdrawAmount("");
      setSelectedWithdrawalMethod("");
      setRecipientCode("");
    }
  };

  const handleCreateRecipient = async () => {
    if (!user) {
      toast({ title: "Login required", description: "Please sign in to create a recipient.", variant: "destructive" });
      return;
    }
    if (!accountName || !bankCode || !accountNumber) {
      toast({ title: "Missing Details", description: "Provide account name, bank code and account number.", variant: "destructive" });
      return;
    }
    try {
      setRecipientLoading(true);
      const resp = await fetch(`${serverBase}/api/wallet/recipient`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: accountName,
          email: user.email,
          bank_code: bankCode,
          account_number: accountNumber,
          currency: 'NGN',
          type: 'nuban',
        })
      });
      const data = await resp.json();
      if (!data?.status) {
        throw new Error(data?.message || 'Failed to create recipient');
      }
      const code = data?.recipient_code || data?.data?.recipient_code;
      if (code) {
        setRecipientCode(code);
        setShowRecipientDialog(false);
        toast({ title: 'Recipient Created', description: 'Recipient code filled automatically.' });
      } else {
        throw new Error('No recipient_code returned');
      }
    } catch (error) {
      toast({ title: 'Error', description: (error as any)?.message || 'Unable to create recipient.', variant: 'destructive' });
    } finally {
      setRecipientLoading(false);
    }
  };

  const handleQuickAction = (action: { route: string; minAmount: number; title: string }) => {
    if (balance < action.minAmount) {
      toast({
        title: "Insufficient Balance",
        description: `You need at least ₦${action.minAmount} to use this feature. Please fund your wallet.`,
        variant: "destructive",
      });
      return;
    }
    navigate(action.route);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-background">
        <div className="flex items-center gap-4 p-4 max-w-3xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/explore')}
            className="text-foreground hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Money</span>
            <h1 className="font-display text-2xl font-extrabold text-foreground">Wallet</h1>
            <p className="text-sm text-muted-foreground">Manage your funds</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-8 max-w-3xl mx-auto">
        {/* Flat marigold balance hero */}
        <div className="rounded-2xl bg-primary text-primary-foreground border border-border p-6 md:p-8 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">Available balance</span>
            <TrendingUp className="h-5 w-5 opacity-80" />
          </div>
          <div className="font-display text-4xl md:text-5xl font-extrabold mb-6">
            ₦{balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowFundDialog(true)}
              className="flex-1 rounded-full bg-foreground text-background hover:bg-foreground/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Money
            </Button>
            <Button
              onClick={() => setShowWithdrawDialog(true)}
              variant="outline"
              className="flex-1 rounded-full border-foreground/30 text-primary-foreground bg-transparent hover:bg-foreground/10"
            >
              <Minus className="w-4 h-4 mr-2" />
              Withdraw
            </Button>
          </div>
        </div>

        {/* Stamp-motif quick actions */}
        <section>
          <h2 className="font-display text-xl font-bold mb-5">Quick actions</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
            {stampActions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={action.onClick}
                className="group flex flex-col items-center gap-3 p-3 rounded-2xl border border-transparent hover:border-border hover:bg-card transition-all"
              >
                <StampIcon icon={action.icon} tone={action.tone} size="md" rotate={action.rotate} />
                <span className="text-xs font-semibold text-foreground text-center">{action.title}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Transaction history — divided list */}
        <section id="wallet-history" className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Transaction history
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Your recent wallet activities</p>
          </div>
          <div className="divide-y divide-border">
            {getTransactionHistory().length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-muted-foreground">No transactions yet.</p>
            ) : (
              getTransactionHistory().map((transaction) => {
                const status = (transaction as { status?: string }).status;
                const isCredit = transaction.type === "credit";
                const pillClass =
                  status === "pending"
                    ? "bg-primary/15 text-primary"
                    : status === "failed"
                      ? "bg-destructive/15 text-destructive"
                      : isCredit
                        ? "bg-success/15 text-success"
                        : "bg-destructive/15 text-destructive";
                return (
                  <div key={transaction.id} className="px-5 py-4 flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-foreground truncate">{transaction.description}</div>
                      <div className="text-sm text-muted-foreground mt-0.5">
                        {transaction.method} · {transaction.date}
                      </div>
                    </div>
                    <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${pillClass}`}>
                      {isCredit ? "+" : "-"}₦{transaction.amount.toFixed(2)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      {/* Fund Wallet Dialog */}
      <Dialog open={showFundDialog} onOpenChange={setShowFundDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Funds to Wallet</DialogTitle>
            <DialogDescription>
              Enter an amount and continue to Paystack to pick a payment method.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                min="1"
                step="0.01"
              />
            </div>
            {/* Payment method dropdown removed; Paystack modal lets users choose */}
            <Button 
              onClick={handleFundWallet} 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Add Funds"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Withdraw Funds Dialog */}
      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              Choose your withdrawal method and amount to withdraw from your wallet.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="withdrawAmount">Amount (₦)</Label>
              <Input
                id="withdrawAmount"
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                min="1"
                step="0.01"
                max={balance}
              />
            </div>
            <div>
              <Label>Withdrawal Method</Label>
              <Select value={selectedWithdrawalMethod} onValueChange={setSelectedWithdrawalMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select withdrawal method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <SelectItem key={method.id} value={method.id}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{method.name}</div>
                            <div className="text-xs text-muted-foreground">{method.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="recipientCode">Paystack Recipient Code</Label>
              <Input
                id="recipientCode"
                type="text"
                placeholder="e.g., RCP_xxxxxxxxx"
                value={recipientCode}
                onChange={(e) => setRecipientCode(e.target.value)}
              />
              <div className="flex items-center gap-2 mt-2">
                <p className="text-xs text-muted-foreground">Don’t have a recipient code?</p>
                <Button variant="outline" size="sm" onClick={() => setShowRecipientDialog(true)}>Create Recipient</Button>
              </div>
            </div>
            <Button 
              onClick={handleWithdrawFunds} 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Withdraw Funds"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Recipient Dialog */}
      <Dialog open={showRecipientDialog} onOpenChange={setShowRecipientDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Paystack Transfer Recipient</DialogTitle>
            <DialogDescription>
              Enter bank details to generate a recipient code for withdrawals.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="accountName">Account Name</Label>
              <Input id="accountName" type="text" placeholder="e.g., John Doe" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="bankCode">Bank Code</Label>
              <Input id="bankCode" type="text" placeholder="e.g., 058 (GTBank), 044 (Access)" value={bankCode} onChange={(e) => setBankCode(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input id="accountNumber" type="text" placeholder="e.g., 0123456789" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
            </div>
            <Button onClick={handleCreateRecipient} className="w-full" disabled={recipientLoading}>
              {recipientLoading ? 'Creating...' : 'Create Recipient'}
            </Button>
            <p className="text-xs text-muted-foreground">We’ll use your account email: {user?.email || '—'}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletPage;