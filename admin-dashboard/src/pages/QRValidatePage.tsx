import { useEffect, useRef, useState } from 'react'
import { QrCode, CheckCircle2, XCircle } from 'lucide-react'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'

export default function QRValidatePage() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')
  const { user } = useAuth()

  useEffect(() => {
    let codeReader: BrowserMultiFormatReader | null = null
    let stopped = false

    async function startScanner() {
      setStatus('scanning')
      codeReader = new BrowserMultiFormatReader()
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }

        const controls = await codeReader.decodeFromVideoDevice(undefined, videoRef.current!, async (result, err) => {
          if (stopped) return
          if (result) {
            stopped = true
            controls.stop()
            await handlePayload(result.getText())
          }
        })
      } catch (e) {
        console.error(e)
        setStatus('error')
        setMessage('Camera access error. Please allow camera permissions.')
      }
    }

    startScanner()
    return () => {
      stopped = true
      if (codeReader) {
        try { codeReader.reset() } catch {}
      }
      const stream = videoRef.current?.srcObject as MediaStream | undefined
      stream?.getTracks().forEach(t => t.stop())
    }
  }, [])

  const handlePayload = async (text: string) => {
    try {
      if (!text.startsWith('ticket:')) {
        setStatus('error')
        setMessage('Invalid QR format')
        return
      }
      const ticketId = text.replace('ticket:', '')
      const ref = doc(db, 'tickets', ticketId)
      const snap = await getDoc(ref)
      if (!snap.exists()) {
        setStatus('error')
        setMessage('Ticket not found')
        return
      }
      const data = snap.data() as any
      if (data.status !== 'valid') {
        setStatus('error')
        setMessage(`Ticket is not valid (${data.status})`)
        return
      }
      await updateDoc(ref, {
        status: 'redeemed',
        validatedAt: serverTimestamp(),
        validatedBy: user?.uid || 'admin',
      })
      setStatus('success')
      setMessage('Ticket redeemed successfully')
    } catch (e) {
      console.error(e)
      setStatus('error')
      setMessage('Validation failed')
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <QrCode className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold">QR Ticket Validation</h2>
        </div>

        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
          <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
        </div>

        <div className="mt-4">
          {status === 'scanning' && (
            <p className="text-sm text-gray-600">Scanning... Point camera at a ticket QR.</p>
          )}
          {status === 'success' && (
            <div className="flex items-center gap-2 text-green-600"><CheckCircle2 className="h-5 w-5" /><span>{message}</span></div>
          )}
          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-600"><XCircle className="h-5 w-5" /><span>{message}</span></div>
          )}
        </div>
      </div>
    </div>
  )
}