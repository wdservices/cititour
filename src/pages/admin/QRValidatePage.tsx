import { useEffect, useState } from 'react'
import { QrCode, CheckCircle2, XCircle, Ticket, Search, ArrowRight } from 'lucide-react'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

export default function AdminQRValidatePage() {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')
  const [ticketId, setTicketId] = useState<string>('')
  const [ticketInfo, setTicketInfo] = useState<any>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleValidate = async (rawId: string) => {
    const text = rawId.trim()
    if (!text) {
      setStatus('error')
      setMessage('Please enter a ticket ID or scan code.')
      return
    }
    setStatus('scanning')
    setMessage('Validating...')
    try {
      const ticketIdClean = text.startsWith('ticket:') ? text.replace('ticket:', '') : text
      const ref = doc(db, 'tickets', ticketIdClean)
      const snap = await getDoc(ref)
      if (!snap.exists()) {
        setStatus('error')
        setMessage(`Ticket not found: ${ticketIdClean}`)
        setTicketInfo(null)
        toast({ title: 'Ticket not found', variant: 'destructive' })
        return
      }
      const data = snap.data() as any
      setTicketInfo({ id: ticketIdClean, ...data })
      if (data.status === 'redeemed') {
        setStatus('error')
        setMessage(`Ticket was already redeemed at ${data.validatedAt?.toDate?.()?.toLocaleString() || 'unknown'}`)
        return
      }
      if (data.status !== 'valid') {
        setStatus('error')
        setMessage(`Ticket is not valid (current status: ${data.status})`)
        return
      }
      await updateDoc(ref, {
        status: 'redeemed',
        validatedAt: serverTimestamp(),
        validatedBy: user?.id || 'admin',
      })
      setStatus('success')
      setMessage('Ticket redeemed successfully!')
      toast({ title: 'Success', description: 'Ticket redeemed successfully.' })
    } catch (e) {
      console.error(e)
      setStatus('error')
      setMessage('Validation failed. Please try again.')
      toast({ title: 'Validation failed', variant: 'destructive' })
    }
  }

  const reset = () => {
    setStatus('idle')
    setMessage('')
    setTicketId('')
    setTicketInfo(null)
  }

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const pasted = e.clipboardData?.getData('text') || ''
      if (pasted && (pasted.startsWith('ticket:') || pasted.length > 3)) {
        setTicketId(pasted)
      }
    }
    window.addEventListener('paste', onPaste)
    return () => window.removeEventListener('paste', onPaste)
  }, [])

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <QrCode className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">Ticket Validation</CardTitle>
              <CardDescription>
                Enter the ticket ID below or paste a ticket code. Tickets can also be scanned from the printed QR code.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="ticketId">Ticket ID or Code</Label>
            <div className="flex gap-2">
              <Input
                id="ticketId"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleValidate(ticketId) }}
                placeholder="ticket:abc123 or abc123"
                className="h-12 text-base"
              />
              <Button
                onClick={() => handleValidate(ticketId)}
                disabled={status === 'scanning'}
                className="h-12 px-6"
              >
                {status === 'scanning' ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Validating
                  </span>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Validate
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Tip: Copy a ticket code and paste it into this field anywhere on this page to auto-fill it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'demo-ticket-001', label: 'Sample Valid Ticket' },
              { id: 'demo-ticket-002', label: 'Sample Ticket 2' },
              { id: 'demo-ticket-003', label: 'Sample Ticket 3' },
            ].map((sample) => (
              <Button
                key={sample.id}
                variant="outline"
                onClick={() => { setTicketId(sample.id) }}
                className="flex items-center justify-start h-auto py-4 px-4"
              >
                <Ticket className="w-4 h-4 mr-2 text-primary shrink-0" />
                <div className="text-left">
                  <div className="text-sm font-medium">{sample.label}</div>
                  <div className="text-xs text-muted-foreground truncate">{sample.id}</div>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto opacity-50" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {(status !== 'idle' || ticketInfo) && (
        <Card className={
          status === 'success'
            ? 'border-green-300 bg-green-50'
            : status === 'error'
              ? 'border-red-300 bg-red-50'
              : status === 'scanning'
                ? 'border-blue-300 bg-blue-50'
                : 'border-border'
        }>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {status === 'success' && (
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="h-6 w-6" />
                  <span className="font-semibold text-lg">{message}</span>
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-700">
                  <XCircle className="h-6 w-6" />
                  <span className="font-semibold text-lg">{message}</span>
                </div>
              )}
              {status === 'scanning' && (
                <div className="flex items-center gap-2 text-blue-700">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="font-semibold text-lg">{message}</span>
                </div>
              )}
              {ticketInfo && (
                <div className="mt-4 pt-4 border-t border-border/60 space-y-2">
                  <h4 className="font-semibold">Ticket Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground">ID:</span> <span className="font-mono">{ticketInfo.id}</span></div>
                    <div><span className="text-muted-foreground">Status:</span> <span className="font-medium">{ticketInfo.status}</span></div>
                    {ticketInfo.eventName && <div className="col-span-2"><span className="text-muted-foreground">Event:</span> {ticketInfo.eventName}</div>}
                    {ticketInfo.ownerEmail && <div className="col-span-2"><span className="text-muted-foreground">Owner:</span> {ticketInfo.ownerEmail}</div>}
                    {ticketInfo.purchasedAt && <div><span className="text-muted-foreground">Purchased:</span> {ticketInfo.purchasedAt.toDate?.()?.toLocaleString?.() || String(ticketInfo.purchasedAt)}</div>}
                    {ticketInfo.validatedAt && <div><span className="text-muted-foreground">Redeemed:</span> {ticketInfo.validatedAt.toDate?.()?.toLocaleString?.() || String(ticketInfo.validatedAt)}</div>}
                  </div>
                </div>
              )}
              {status !== 'idle' && status !== 'scanning' && (
                <div className="pt-4">
                  <Button onClick={reset} variant="secondary" size="sm">
                    Validate another ticket
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
