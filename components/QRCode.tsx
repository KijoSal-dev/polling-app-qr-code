// components/QRCode.tsx
'use client'
import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

export default function QRCodeGenerator({ pollId }: { pollId: string }) {
  const [qrUrl, setQrUrl] = useState('')

  useEffect(() => {
    const pollUrl = `${window.location.origin}/poll/${pollId}`
    QRCode.toDataURL(pollUrl).then(setQrUrl)
  }, [pollId])

  return qrUrl ? (
    <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
  ) : (
    <div>Generating QR...</div>
  )
}