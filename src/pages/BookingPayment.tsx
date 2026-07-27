import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { User, Lock, CreditCard, Wallet, ShieldCheck, Check, CalendarPlus, MapPin, Users } from "lucide-react";

interface BookingState {
  roomName: string;
  roomImage: string;
  pricePerNight: number;
  nights: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  deposit: number;
  propertyTitle: string;
  propertyLocation: string;
}

export default function BookingPayment() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const state = location.state as BookingState | null;

  const [firstName, setFirstName] = useState(user?.name?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(user?.name?.split(" ").slice(1).join(" ") || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!state) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-sm">No booking data found. Please start from the property page.</p>
        <button onClick={() => navigate("/explore")} className="text-[#005ea4] text-sm font-semibold hover:underline">Browse Properties &rarr;</button>
      </div>
    );
  }

  const roomRate = state.pricePerNight * state.nights;
  const taxes = Math.round(roomRate * 0.15);
  const totalWithTax = roomRate + taxes;

  const generateRef = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let ref = "CH-";
    for (let i = 0; i < 4; i++) ref += chars[Math.floor(Math.random() * chars.length)];
    ref += "-";
    for (let i = 0; i < 2; i++) ref += chars[Math.floor(Math.random() * chars.length)];
    return ref;
  };

  const [bookingRef] = useState(generateRef);

  const handlePay = async () => {
    if (!firstName || !lastName || !email || !phone) return;
    setIsProcessing(true);
    // Simulate Paystack redirect
    setTimeout(() => {
      setIsPaid(true);
      setIsProcessing(false);
    }, 2000);
  };

  if (isPaid) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] flex flex-col">
        {/* Nav */}
        <header className="bg-white w-full border-b border-gray-200 shadow-sm z-50">
          <div className="flex justify-between items-center w-full max-w-[1440px] mx-auto px-10 h-20">
            <span className="text-[20px] font-bold text-[#005ea4] tracking-tight">Citivas Hospitality</span>
            <button onClick={() => navigate("/explore")} className="text-[14px] text-[#005ea4] font-semibold hover:opacity-80">Sign In</button>
          </div>
        </header>

        <main className="flex-1 w-full max-w-[1440px] mx-auto px-10 py-16">
          {/* Success State */}
          <div className="max-w-lg mx-auto">
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, #10B981 2px, transparent 2px), radial-gradient(circle at 80% 40%, #005ea4 2px, transparent 2px), radial-gradient(circle at 40% 80%, #ffb86a 2px, transparent 2px)", backgroundSize: "50px 50px" }} />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-[#10B981]/30">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-[20px] font-bold text-gray-800 mb-2">Booking Confirmed!</h3>
                <p className="text-[14px] text-gray-500 mb-6">Your reservation has been successfully placed.</p>
                <div className="bg-white rounded-lg border border-gray-200 px-6 py-4 mb-6 shadow-sm inline-block">
                  <span className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase block mb-1">Booking Reference</span>
                  <span className="text-[20px] font-bold text-[#005ea4] font-mono tracking-wider">{bookingRef}</span>
                </div>
                <div>
                  <button className="bg-white text-[#005ea4] border border-[#005ea4] text-[14px] font-medium rounded-lg py-2.5 px-6 hover:bg-[#d3e4ff] transition-colors flex items-center gap-2 mx-auto">
                    <CalendarPlus className="w-5 h-5" /> Add to Calendar
                  </button>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h4 className="text-[16px] font-bold text-gray-800 mb-4">Booking Details</h4>
              <div className="space-y-3 text-[13px]">
                <div className="flex justify-between"><span className="text-gray-500">Property</span><span className="font-semibold text-gray-800">{state.propertyTitle}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Room</span><span className="font-semibold text-gray-800">{state.roomName}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Check-in</span><span className="font-semibold text-gray-800">{state.checkIn}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Check-out</span><span className="font-semibold text-gray-800">{state.checkOut}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Nights</span><span className="font-semibold text-gray-800">{state.nights}</span></div>
                <div className="flex justify-between border-t border-gray-200 pt-3"><span className="font-bold text-gray-800">Total Paid</span><span className="font-bold text-[#005ea4] text-[16px]">₦{totalWithTax.toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        </main>

        <footer className="bg-white w-full py-12 border-t border-gray-200 mt-auto">
          <div className="max-w-[1440px] mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[14px] text-gray-400">
            <div className="font-bold text-[#005ea4]">&copy; 2024 Citivas Hospitality. All rights reserved.</div>
            <div className="flex gap-6">
              <a href="/privacy" className="hover:text-[#005ea4] transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-[#005ea4] transition-colors">Terms of Service</a>
              <a href="/contact-support" className="hover:text-[#005ea4] transition-colors">Contact Support</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col">
      {/* Nav */}
      <header className="bg-white w-full border-b border-gray-200 shadow-sm z-50">
        <div className="flex justify-between items-center w-full max-w-[1440px] mx-auto px-10 h-20">
          <span className="text-[20px] font-bold text-[#005ea4] tracking-tight">Citivas Hospitality</span>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-[14px] text-[#005ea4] font-semibold hover:opacity-80">Sign In</button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-10 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-gray-800 mb-2">Complete your booking</h1>
          <p className="text-[16px] text-gray-500">Step 4 of 5: Guest Details &amp; Payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Guest Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-[20px] font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-500" /> Guest Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[14px] text-gray-500 block mb-2">First Name</label>
                  <input className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[16px] focus:outline-none focus:border-[#005ea4] focus:ring-1 focus:ring-[#005ea4] transition-all" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div>
                  <label className="text-[14px] text-gray-500 block mb-2">Last Name</label>
                  <input className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[16px] focus:outline-none focus:border-[#005ea4] focus:ring-1 focus:ring-[#005ea4] transition-all" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[14px] text-gray-500 block mb-2">Email Address</label>
                  <input className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[16px] focus:outline-none focus:border-[#005ea4] focus:ring-1 focus:ring-[#005ea4] transition-all" placeholder="john.doe@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[14px] text-gray-500 block mb-2">Phone Number</label>
                  <input className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[16px] focus:outline-none focus:border-[#005ea4] focus:ring-1 focus:ring-[#005ea4] transition-all" placeholder="+234 800 000 0000" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-[0_12px_24px_-12px_rgba(0,0,0,0.1)] relative overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[20px] font-bold text-gray-800 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-gray-500" /> Secure Payment
                </h2>
                <div className="flex gap-2 text-gray-400">
                  <CreditCard className="w-5 h-5" />
                  <Wallet className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6 text-center">
                <p className="text-[16px] text-gray-500 mb-4">You will be redirected to Paystack to complete your purchase securely.</p>
                <button onClick={handlePay} disabled={!firstName || !lastName || !email || !phone || isProcessing}
                  className="bg-[#005ea4] text-white text-[18px] font-bold rounded-xl py-3.5 px-8 hover:bg-[#004881] transition-colors shadow-md w-full md:w-auto disabled:opacity-40 disabled:cursor-not-allowed">
                  {isProcessing ? "Processing..." : "Pay with Paystack"}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-gray-500 text-[12px] font-semibold uppercase opacity-70">
                <ShieldCheck className="w-4 h-4" />
                <span>256-bit SSL Encrypted</span>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm sticky top-28 overflow-hidden">
              {/* Room Image */}
              <div className="h-48 w-full bg-gray-200">
                {state.roomImage ? (
                  <img src={state.roomImage} alt={state.roomName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-50" />
                )}
              </div>

              <div className="p-6">
                <h3 className="text-[20px] font-bold text-gray-800 mb-1">{state.roomName}</h3>
                <p className="text-[14px] text-gray-500 flex items-center gap-1 mb-6">
                  <MapPin className="w-4 h-4" /> {state.propertyLocation}
                </p>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase block mb-1">Check-in</span>
                      <span className="text-[14px] font-medium text-gray-800">{state.checkIn}</span>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase block mb-1">Check-out</span>
                      <span className="text-[14px] font-medium text-gray-800">{state.checkOut}</span>
                    </div>
                  </div>
                  <div className="text-[14px] text-gray-500 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {state.guests} Adult{state.guests !== 1 ? "s" : ""}, 1 Room &middot; {state.nights} Night{state.nights !== 1 ? "s" : ""}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[14px] text-gray-500">Room Rate (&#8358;{state.pricePerNight.toLocaleString()} x {state.nights} nights)</span>
                    <span className="text-[14px] font-medium text-gray-800">&#8358;{roomRate.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[14px] text-gray-500">Taxes &amp; Fees</span>
                    <span className="text-[14px] font-medium text-gray-800">&#8358;{taxes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <span className="text-[20px] font-bold text-gray-800">Total</span>
                    <span className="text-[28px] font-bold text-[#005ea4]">&#8358;{totalWithTax.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white w-full py-12 border-t border-gray-200 mt-auto">
        <div className="max-w-[1440px] mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[14px] text-gray-400">
          <div className="font-bold text-[#005ea4]">&copy; 2024 Citivas Hospitality. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-[#005ea4] transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-[#005ea4] transition-colors">Terms of Service</a>
            <a href="/contact-support" className="hover:text-[#005ea4] transition-colors">Contact Support</a>
            <a href="/hospitality-dashboard" className="hover:text-[#005ea4] transition-colors">Property Owner Portal</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
