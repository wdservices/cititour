import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocketItem {
  name: string;
  quantity: number;
  price: number;
  complimentary: boolean;
}

interface DocketData {
  orderNumber: string;
  unitName: string;
  items: DocketItem[];
  totalAmount: number;
  specialInstructions: string;
  createdAt?: any;
}

const DOCKET_CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body {
  background: #fff;
  color: #000;
  font-family: "Courier New", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 10px;
}
@page {
  size: 80mm auto;
  margin: 0;
}
.docket-card {
  width: 74mm;
  margin: 0 auto;
  padding: 3mm 2mm;
  border: 1px dashed #000;
  font-size: 10px;
  line-height: 1.35;
  color: #000;
}
.docket-card + .docket-card { margin-top: 8mm; }
.row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 2mm;
  padding: 1px 0;
}
.row span:first-child { overflow-wrap: break-word; word-break: break-word; }
.row .amt { white-space: nowrap; flex-shrink: 0; }
.dt-head {
  text-align: center;
  border-bottom: 1px dashed #000;
  padding-bottom: 2mm;
  margin-bottom: 2.5mm;
}
.dt-lbl {
  font-size: 9px;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-top: 1px;
}
.dt-title { font-weight: bold; font-size: 12px; letter-spacing: 1px; }
.dt-sec {
  border-top: 1px dashed #000;
  padding-top: 2mm;
  margin-top: 2.5mm;
}
.dt-items-title {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  padding-bottom: 1.5mm;
}
.dt-total {
  font-weight: bold;
  font-size: 12px;
}
.dt-foot {
  text-align: center;
  margin-top: 2.5mm;
  padding-top: 2mm;
  border-top: 1px dashed #000;
  font-size: 9px;
}
@media print {
  body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  .docket-card { break-inside: avoid; page-break-inside: avoid; }
}`;

function buildDocketHTML(data: DocketData, label: string): string {
  const date = data.createdAt?.toDate?.()
    ? data.createdAt.toDate().toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" })
    : new Date().toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" });
  const time = data.createdAt?.toDate?.()
    ? data.createdAt.toDate().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", hour12: false })
    : new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", hour12: false });

  const itemsHTML = data.items.map((item) => `
    <div class="row">
      <span>${item.name} × ${item.quantity}</span>
      <span class="amt">${item.complimentary ? "Comp." : `₦${item.subtotal.toLocaleString()}`}</span>
    </div>`).join("");

  const instrHTML = data.specialInstructions ? `
    <div class="dt-sec">
      <div style="font-weight:bold; margin-bottom:1mm;">Special Instructions:</div>
      <div style="white-space:pre-wrap;">${data.specialInstructions}</div>
    </div>` : "";

  return `
    <div class="docket-card">
      <div class="dt-head">
        <div class="dt-title">CITIVAS HOSPITALITY</div>
        <div class="dt-lbl">${label}</div>
      </div>
      <div class="row"><span>Order #:</span><span class="amt" style="font-weight:bold">${data.orderNumber}</span></div>
      <div class="row"><span>Date:</span><span class="amt">${date}</span></div>
      <div class="row"><span>Time:</span><span class="amt">${time}</span></div>
      <div class="row"><span>Unit:</span><span class="amt" style="font-weight:bold">${data.unitName}</span></div>
      <div class="dt-sec">
        <div class="dt-items-title"><span>ITEMS</span><span>AMOUNT</span></div>
        ${itemsHTML}
      </div>
      <div class="dt-sec">
        <div class="row"><span class="dt-total">TOTAL</span><span class="dt-total">₦${data.totalAmount.toLocaleString()}</span></div>
        <div style="font-size:8px; margin-top:1mm;">Payment: Manual Collection</div>
      </div>
      ${instrHTML}
      <div class="dt-foot">Thank you for choosing Citivas!</div>
    </div>`;
}

interface DocketPrintProps {
  data: DocketData;
}

export default function DocketPrint({ data }: DocketPrintProps) {
  const handlePrint = () => {
    const labels = ["CHEF COPY", "RECEPTIONIST COPY", "GUEST COPY"];
    const dockets = labels.map((l) => buildDocketHTML(data, l)).join("");
    const html = `<!DOCTYPE html><html><head><style>${DOCKET_CSS}</style></head><body>${dockets}</body></html>`;

    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0";
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
      setTimeout(() => {
        iframe.contentWindow?.print();
        setTimeout(() => document.body.removeChild(iframe), 500);
      }, 300);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" /> Print Dockets
        </Button>
      </div>

      {/* Screen Preview */}
      <div className="bg-white border rounded-lg p-6 font-mono text-sm space-y-6 max-w-md mx-auto">
        {["CHEF COPY", "RECEPTIONIST COPY", "GUEST COPY"].map((label) => (
          <div key={label} className="border border-dashed border-gray-400 p-4 rounded">
            <div className="text-center border-b border-dashed border-gray-400 pb-2 mb-2">
              <div className="font-bold text-xs tracking-widest">CITIVAS HOSPITALITY</div>
              <div className="text-[10px] tracking-widest uppercase mt-0.5">{label}</div>
            </div>
            <div className="flex justify-between py-0.5"><span>Order #:</span><span className="font-bold">{data.orderNumber}</span></div>
            <div className="flex justify-between py-0.5"><span>Unit:</span><span className="font-bold">{data.unitName}</span></div>
            <div className="border-t border-dashed border-gray-400 mt-2 pt-2">
              <div className="flex justify-between font-bold text-xs mb-1"><span>ITEMS</span><span>AMOUNT</span></div>
              {data.items.map((item, i) => (
                <div key={i} className="flex justify-between py-0.5">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{item.complimentary ? "Comp." : `₦${item.subtotal.toLocaleString()}`}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-dashed border-gray-400 mt-2 pt-2">
              <div className="flex justify-between font-bold"><span>TOTAL</span><span>₦{data.totalAmount.toLocaleString()}</span></div>
              <div className="text-[10px] mt-0.5">Payment: Manual Collection</div>
            </div>
            {data.specialInstructions && (
              <div className="border-t border-dashed border-gray-400 mt-2 pt-2">
                <div className="font-bold text-[10px] mb-0.5">Special Instructions:</div>
                <div className="text-[10px] whitespace-pre-wrap">{data.specialInstructions}</div>
              </div>
            )}
            <div className="text-center border-t border-dashed border-gray-400 mt-2 pt-2 text-[10px]">
              Thank you for choosing Citivas!
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
