import express from 'express';

import {sendSMS} from '../controllers/smsController.js';
const router = express.Router();

// POST route to send SMS
router.post('/send-sms', sendSMS);

export default router;