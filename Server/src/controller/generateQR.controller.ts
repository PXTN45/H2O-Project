import express, { Request, Response } from 'express';
import QRCode from 'qrcode';
import generatePayload from 'promptpay-qr';
import _ from 'lodash';

interface QRRequestBody {
    amount: number;
}

// app.post('/generateQR', (req: Request<{}, {}, QRRequestBody>, res: Response) => {
    const generateQR = (req: Request<{}, {}, QRRequestBody>, res: Response) => {
        const amount: number = parseFloat(String(_.get(req, ["body", "amount"])));
        const mobileNumber: string = '0123456789';
        const payload: string = generatePayload(mobileNumber, { amount });
        const option = {
            color: {
                dark: '#000',
                light: '#fff'
            }
        };
    
        QRCode.toDataURL(payload, option, (err: Error | null, url: string | undefined) => {
            if (err) {
                console.log('generate fail');
                return res.status(400).json({
                    RespCode: 400,
                    RespMessage: 'bad: ' + err.message
                });
            } else {
                return res.status(200).json({
                    RespCode: 200,
                    RespMessage: 'good',
                    Result: url
                });
            }
        });
    };
    

export default generateQR;