import nodemailer from "nodemailer"

const sendEmail = async (email: string , token: string): Promise<void> => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.HOST,
			service: process.env.SERVICE,
			port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
			auth: {
				user: process.env.USER,
				pass: process.env.PASS,
			},
		});

		await transporter.sendMail({
			from: process.env.USER,
			to: email,
			subject: 'Email Verification',
			text: `Please verify your email by clicking the following link: http://localhost:3000/user/verify?token=${token}}`,
		});
		console.log("Email sent successfully");
	} catch (error) {
		console.log("Email not sent!");
		console.log(error);
		throw error; // Rethrow the error to ensure the caller knows that the email was not sent
	}
};

export { sendEmail }
