import axios from 'axios'

const getAccessToken = async () => {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64')

  const { data } = await axios.get(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    { headers: { Authorization: `Basic ${auth}` } }
  )
  return data.access_token
}

const getTimestamp = () => {
  const now = new Date()
  return (
    now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0')
  )
}

// @desc    Initiate STK Push
// @route   POST /api/mpesa/stkpush
// @access  Private
export const stkPush = async (req, res) => {
  try {
    const { phone, amount, orderId } = req.body

    if (!phone || !amount || !orderId) {
      return res.status(400).json({ message: 'Phone, amount and orderId are required' })
    }

    // Format phone number — convert 07XX to 2547XX
    const formattedPhone = phone.startsWith('0')
      ? `254${phone.slice(1)}`
      : phone.startsWith('+')
      ? phone.slice(1)
      : phone

    const token = await getAccessToken()
    const timestamp = getTimestamp()
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64')

    const { data } = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.ceil(amount),
        PartyA: formattedPhone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: `PerfectPick-${orderId}`,
        TransactionDesc: 'Payment for Perfect Pick order',
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    res.json({
      success: true,
      message: 'STK push sent successfully',
      checkoutRequestId: data.CheckoutRequestID,
    })
  } catch (error) {
    console.error('STK Push error:', error.response?.data || error.message)
    res.status(500).json({ message: 'Failed to initiate M-Pesa payment' })
  }
}

// @desc    M-Pesa callback
// @route   POST /api/mpesa/callback
// @access  Public (called by Safaricom)
export const mpesaCallback = async (req, res) => {
  try {
    const { Body } = req.body
    const { stkCallback } = Body

    if (stkCallback.ResultCode === 0) {
      // Payment successful
      const metadata = stkCallback.CallbackMetadata.Item
      const amount = metadata.find(i => i.Name === 'Amount')?.Value
      const mpesaCode = metadata.find(i => i.Name === 'MpesaReceiptNumber')?.Value
      const phone = metadata.find(i => i.Name === 'PhoneNumber')?.Value

      console.log('Payment successful:', { amount, mpesaCode, phone })
      // Here you can update the order payment status in DB if needed
    } else {
      console.log('Payment failed:', stkCallback.ResultDesc)
    }

    res.json({ ResultCode: 0, ResultDesc: 'Success' })
  } catch (error) {
    console.error('Callback error:', error)
    res.json({ ResultCode: 0, ResultDesc: 'Success' })
  }
}

// @desc    Query STK Push status
// @route   POST /api/mpesa/query
// @access  Private
export const querySTK = async (req, res) => {
  try {
    const { checkoutRequestId } = req.body
    const token = await getAccessToken()
    const timestamp = getTimestamp()
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64')

    const { data } = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    res.json({
      success: true,
      resultCode: data.ResultCode,
      resultDesc: data.ResultDesc,
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to query payment status' })
  }
}