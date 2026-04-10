import express from 'express'
import protect from '../middleware/protect.js'
import { stkPush, mpesaCallback, querySTK } from '../controllers/mpesaController.js'

const router = express.Router()

router.post('/stkpush', protect, stkPush)
router.post('/callback', mpesaCallback)
router.post('/query', protect, querySTK)

export default router