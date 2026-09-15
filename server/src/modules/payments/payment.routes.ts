import { Router, Request, Response } from "express";
import {
  PaymentProvider,
  paymentWebhook,
} from "./payment.service";

const router = Router();

// Payment routes
router.post("/create", async (req: Request, res: Response) => {
  try {
    const { userId, orderId, provider, amount } = req.body;

    if (!userId || !orderId || !provider || !amount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId, orderId, provider, amount",
        error: { code: "MISSING_REQUIRED_FIELDS" },
      });
    }

    const result = await PaymentProvider.createPayment(
      userId,
      orderId,
      provider,
      amount
    );

    return res.json({
      success: true,
      message: "Payment created successfully",
      data: {
        payment: result.payment,
        paymentUrl: result.paymentUrl,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
});

router.post("/verify/:paymentId", async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;

    const result = await PaymentProvider.verifyPayment(paymentId);

    return res.json({
      success: result.success,
      message: result.success ? "Payment verified" : result.message,
      data: result.payment,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
});

router.post("/:paymentId/refund", async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    const { amount } = req.body;

    const result = await PaymentProvider.refundPayment(paymentId, amount);

    return res.json({
      success: result.success,
      message: result.success ? "Refund processed" : result.message,
      data: result.payment,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
});

router.get("/:paymentId/status", async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;

    const result = await PaymentProvider.getPaymentStatus(paymentId);

    return res.json({
      success: result.success,
      message: result.success ? "Payment status retrieved" : result.message,
      data: result.payment,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: { code: "INTERNAL_ERROR" },
    });
  }
});

// Payment webhook endpoint
router.post("/webhook", paymentWebhook);

export default router;