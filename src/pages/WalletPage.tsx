import React, { useState } from "react";
import { ArrowLeft, Plus, Minus, CreditCard, Smartphone, Building, History, TrendingUp, Megaphone, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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

  const quickActions = [
    { 
      id: "run-ads", 
      title: "Run Ads", 
      description: "Promote your business", 
      icon: Megaphone, 
      route: "/run-ads",
      minAmount: 50 
    },
    { 
      id: "event-tickets", 
      title: "Event Tickets", 
      description: "Promote events", 
      icon: Ticket, 
      route: "/event-tickets",
      minAmount: 25 
    },
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

  const handleQuickAction = (action: typeof quickActions[0]) => {
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
    <div className="min-h-screen bg-gradient-to-br from-[#1C1710] via-[#2A1D12] to-[#0B0E14]">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="flex items-center gap-4 p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/explore')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white">Wallet</h1>
            <p className="text-sm text-white/80">Manage your funds</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Wallet Balance Card */}
        <Card className="bg-success border-0 text-white">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Wallet Balance</span>
              <TrendingUp className="h-5 w-5" />
            </CardTitle>
            <CardDescription className="text-green-100">
              Available funds for app services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4">
              ₦{balance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowFundDialog(true)}
                variant="secondary"
                className="flex-1"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Funds
              </Button>
              <Button 
                onClick={() => setShowWithdrawDialog(true)}
                variant="outline"
                className="flex-1 bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <Minus className="w-4 h-4 mr-2" />
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Use your wallet for app services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                const canUse = balance >= action.minAmount;
                
                return (
                  <Button
                    key={action.id}
                    variant="outline"
                    className={`h-auto p-4 justify-start ${!canUse ? 'opacity-50' : ''}`}
                    onClick={() => handleQuickAction(action)}
                    disabled={!canUse}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-sm text-muted-foreground">{action.description}</div>
                        <div className="text-xs text-muted-foreground">
                          Min: ₦{action.minAmount}
                        </div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Transaction History
            </CardTitle>
            <CardDescription>Your recent wallet activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getTransactionHistory().map((transaction, index) => (
                <div key={transaction.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant={transaction.type === "credit" ? "default" : "secondary"}
                          className={transaction.type === "credit" ? "bg-green-500" : "bg-red-500"}
                        >
                          {transaction.type === "credit" ? "+" : "-"}₦{transaction.amount.toFixed(2)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{transaction.method}</span>
                      </div>
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-sm text-muted-foreground">{transaction.date}</div>
                    </div>
                  </div>
                  {index < getTransactionHistory().length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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