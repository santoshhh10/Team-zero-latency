export default function QRModal({ qr, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 grid place-items-center p-4">
      <div className="bg-white rounded-lg w-full max-w-sm p-4 text-center">
        <h3 className="font-semibold text-lg">Your Reservation QR</h3>
        <img src={qr.image} alt="QR Code" className="mx-auto my-4 w-56 h-56" />
        <p className="text-sm text-gray-600">Show this code at pickup. Order #{qr.order?._id}</p>
        <button onClick={onClose} className="mt-4 w-full border py-2 rounded">Close</button>
      </div>
    </div>
  )
}