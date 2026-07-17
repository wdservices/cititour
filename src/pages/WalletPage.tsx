import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus, Minus, CreditCard, Smartphone, Building, History, TrendingUp, Megaphone, Ticket, Loader2 } from "lucide-react";
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
  const [showFundDialog, setShowFundDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [recipientCode, setRecipientCode] = useState("");
  const [showRecipientDialog, setShowRecipientDialog] = useState(false);

  // Bank resolution state
  const [banks, setBanks] = useState<{ name: string; code: string }[]>([]);
  const [selectedBankCode, setSelectedBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [resolvedAccountName, setResolvedAccountName] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);
  const [recipientLoading, setRecipientLoading] = useState(false);

  // Withdrawal fee preview
  const [feePreview, setFeePreview] = useState<{ fee: number; net_amount: number } | null>(null);

  // Load bank list when withdraw dialog opens
  useEffect(() => {
    if (showRecipientDialog && banks.length === 0) {
      fetch(`${serverBase}/api/wallet/banks`)
        .then((res) => res.json())
        .then((result) => {
          if (result.status && result.data) {
            const seen = new Set<string>();
            const unique = result.data.filter((b: any) => {
              if (seen.has(b.code)) return false;
              seen.add(b.code);
              return true;
            });
            setBanks(unique.map((b: any) => ({ name: b.name, code: b.code })));
          }
        })
        .catch(() => {});
    }
  }, [showRecipientDialog, banks.length, serverBase]);

  // Auto-resolve account name when bank + account number are filled
  useEffect(() => {
    if (accountNumber.length === 10 && selectedBankCode) {
      setResolving(true);
      setResolvedAccountName(null);
      fetch(`${serverBase}/api/wallet/resolve-account?account_number=${accountNumber}&bank_code=${selectedBankCode}`)
        .then((res) => res.json())
        .then((result) => {
          if (result.status && result.data?.account_name) {
            setResolvedAccountName(result.data.account_name);
          } else {
            setResolvedAccountName(null);
            toast({ title: 'Could not verify account', description: 'Check the number and bank.', variant: 'destructive' });
          }
        })
        .catch(() => setResolvedAccountName(null))
        .finally(() => setResolving(false));
    } else {
      setResolvedAccountName(null);
    }
  }, [accountNumber, selectedBankCode, serverBase]);

  // Live fee preview as user types withdrawal amount
  useEffect(() => {
    const numericAmount = Number(withdrawAmount);
    if (!numericAmount || numericAmount <= 0) {
      setFeePreview(null);
      return;
    }
    const controller = new AbortController();
    fetch(`${serverBase}/api/wallet/withdraw/preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: numericAmount }),
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status) setFeePreview({ fee: result.fee, net_amount: result.net_amount });
      })
      .catch(() => {});
    return () => controller.abort();
  }, [withdrawAmount, serverBase]);

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

    const amount = parseFloat(withdrawAmount);
    const defaultMethod: PaymentMethod = { id: "bank", name: "Bank Transfer", type: "bank", description: "Withdraw to bank account" };
    const success = await withdrawFunds(amount, defaultMethod, recipientCode);
    
    if (success) {
      setWithdrawAmount("");
      setRecipientCode("");
    }
  };

  const handleCreateRecipient = async () => {
    if (!user) {
      toast({ title: "Login required", description: "Please sign in to create a recipient.", variant: "destructive" });
      return;
    }
    if (!resolvedAccountName || !selectedBankCode || !accountNumber) {
      toast({ title: "Missing Details", description: "Provide bank, account number (auto-verified).", variant: "destructive" });
      return;
    }
    try {
      setRecipientLoading(true);
      const resp = await fetch(`${serverBase}/api/wallet/recipient`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: resolvedAccountName,
          email: user.email,
          bank_code: selectedBankCode,
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
        // Reset form
        setSelectedBankCode("");
        setAccountNumber("");
        setResolvedAccountName(null);
        toast({ title: 'Bank Account Saved', description: 'You can now withdraw to this account.' });
      } else {
        throw new Error('No recipient_code returned');
      }
    } catch (error) {
      toast({ title: 'Error', description: (error as any)?.message || 'Unable to save bank account.', variant: 'destructive' });
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
              Enter an amount to withdraw from your wallet to your bank account.
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
            {!recipientCode && (
              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <p className="text-muted-foreground">No bank account linked yet.</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => { setShowWithdrawDialog(false); setShowRecipientDialog(true); }}>
                  Add Bank Account
                </Button>
              </div>
            )}
            {feePreview && (
              <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm space-y-1">
                <div className="flex justify-between text-muted-foreground">
                  <span>Withdrawal amount</span>
                  <span>₦{Number(withdrawAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Service fee (1.5%)</span>
                  <span>-₦{feePreview.fee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold text-foreground pt-1 border-t border-border">
                  <span>You'll receive</span>
                  <span>₦{feePreview.net_amount.toLocaleString()}</span>
                </div>
              </div>
            )}
            <Button
              onClick={handleWithdrawFunds}
              className="w-full"
              disabled={isLoading || !recipientCode || !withdrawAmount}
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
            <DialogTitle>Add Bank Account</DialogTitle>
            <DialogDescription>
              Select your bank and enter account number. We'll verify the name automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Bank</Label>
              <Select value={selectedBankCode} onValueChange={setSelectedBankCode}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your bank" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={bank.code} value={bank.code}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                type="text"
                maxLength={10}
                placeholder="10-digit account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            {resolving && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying account...
              </div>
            )}
            {resolvedAccountName && (
              <div className="rounded-lg border border-green-300 bg-green-50 p-3 text-sm">
                <span className="text-muted-foreground">Account name: </span>
                <span className="font-semibold text-foreground">{resolvedAccountName}</span>
              </div>
            )}
            <Button
              onClick={handleCreateRecipient}
              className="w-full"
              disabled={!resolvedAccountName || recipientLoading}
            >
              {recipientLoading ? 'Saving...' : 'Save Bank Account'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletPage;