// Two big payment buttons used on the Done view.
export default function PaymentRequest({ cashAppUrl, smsUrl }) {
  return (
    <div className="w-full space-y-3">
      <a
        href={cashAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center rounded-2xl bg-gradient-to-r from-pink to-deep-pink text-white font-display text-2xl py-4 shadow-lg active:scale-[0.99] transition"
      >
        💸 Request Payment via Cash App
      </a>
      <a
        href={smsUrl}
        className="block w-full text-center rounded-2xl bg-gradient-to-r from-teal to-lteal text-white font-display text-xl py-4 shadow-lg active:scale-[0.99] transition"
      >
        📱 Text for Payment
      </a>
    </div>
  )
}
