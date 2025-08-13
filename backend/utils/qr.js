import crypto from 'crypto';
import QRCode from 'qrcode';

export function generateQrToken(payloadObj) {
	const base = JSON.stringify({ ...payloadObj, ts: Date.now(), nonce: crypto.randomBytes(8).toString('hex') });
	return Buffer.from(base).toString('base64url');
}

export async function generateQrDataURL(qrToken) {
	return QRCode.toDataURL(qrToken, { margin: 1, width: 256 });
}