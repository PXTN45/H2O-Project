import express, { Request, Response } from 'express';
import QRCode from 'qrcode';
import generatePayload from 'promptpay-qr';
import _ from 'lodash';

interface QRRequestBody {
    amount: number;
}

const generateQR = (req: Request<{}, {}, QRRequestBody>, res: Response) => {
    const amount: number = parseFloat(String(_.get(req, ["body", "amount"])));
    const mobileNumber: string = '0928983405';
    const payload: string = generatePayload(mobileNumber, { amount });
    const option = {
        color: {
            dark: '#000',
            light: '#fff'
        }
    };

    QRCode.toDataURL(payload, (err, url) => {
        if (err) {
            console.error('การสร้าง QR Code ล้มเหลว:', err);
            return res.status(400).json({
                RespCode: 400,
                RespMessage: 'การสร้าง QR code ล้มเหลว: ' + err.message
            });
        } else {
            return res.status(200).json({
                RespCode: 200,
                RespMessage: 'สร้าง QR code สำเร็จ',
                Result: url
            });
        }
    });
};

export default generateQR;
