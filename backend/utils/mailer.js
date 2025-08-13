import nodemailer from 'nodemailer';

let transporter;

export function getTransporter() {
	if (transporter) return transporter;
	transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST || 'localhost',
		port: Number(process.env.SMTP_PORT || 1025),
		secure: false,
		auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
	});
	return transporter;
}

export async function sendEmail({ to, subject, html }) {
	try {
		const tx = getTransporter();
		await tx.sendMail({ from: 'no-reply@surplus.local', to, subject, html });
		return true;
	} catch (err) {
		console.log('Email stub:', { to, subject });
		return false;
	}
}