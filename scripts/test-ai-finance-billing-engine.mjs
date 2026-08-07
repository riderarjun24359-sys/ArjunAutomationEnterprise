/**
 * AI Finance & Billing Engine — pure helper checks.
 */
import assert from "node:assert/strict";

function normalizeInvoiceStatus(status, dueDate, amountPaid = 0, total = 0) {
    const s = String(status).toLowerCase().trim();
    if (s.includes("cancel") || s.includes("void")) return "cancelled";
    if (s.includes("paid") || (total > 0 && amountPaid >= total)) return "paid";
    if (s.includes("overdue") || s.includes("past_due")) return "overdue";
    if (s.includes("sent") || s.includes("issued") || s.includes("open") || s.includes("unpaid")) {
        if (dueDate) {
            const t = new Date(dueDate).getTime();
            if (Number.isFinite(t) && t < Date.now() && amountPaid < total) return "overdue";
        }
        return "sent";
    }
    if (s.includes("draft")) return "draft";
    return "draft";
}

function inferPaymentMethod(method, brand = "", reference = "") {
    const s = `${method} ${brand} ${reference}`.toLowerCase();
    if (s.includes("stripe")) return "stripe";
    if (s.includes("razorpay") || s.includes("razor")) return "razorpay";
    if (s.includes("upi") || s.includes("gpay") || s.includes("phonepe") || s.includes("paytm")) return "upi";
    if (s.includes("bank") || s.includes("wire") || s.includes("ach") || s.includes("neft") || s.includes("rtgs")) {
        return "bank_transfer";
    }
    return "other";
}

function classifySubscriptionBucket(status, prorationType = "", renewsAt = null) {
    const s = `${status} ${prorationType}`.toLowerCase();
    if (s.includes("cancel") || s.includes("churn")) return "cancellations";
    if (s.includes("upgrade") || s.includes("expand")) return "upgrades";
    if (s.includes("downgrade") || s.includes("contract")) return "downgrades";
    if (s.includes("trial")) return "trial";
    if (s.includes("plan") && !s.includes("active")) return "plans";
    if (renewsAt) {
        const t = new Date(renewsAt).getTime();
        if (Number.isFinite(t) && t - Date.now() <= 86_400_000 * 30) return "renewals";
    }
    if (s.includes("renew")) return "renewals";
    if (s.includes("active") || s.includes("current")) return "active";
    return "plans";
}

function classifyAutomationKind(type, channel = "") {
    const s = `${type} ${channel}`.toLowerCase();
    if (s.includes("recurring") || s.includes("invoice schedule")) return "recurring_invoice";
    if (s.includes("overdue")) return "overdue_notice";
    if (s.includes("renew")) return "subscription_renewal";
    if (s.includes("remind") || s.includes("payment")) return "payment_reminder";
    return "finance_notification";
}

function isFounderOrAdminAccess(input) {
    const adminRoles = new Set(["super_admin", "admin", "founder", "owner"]);
    if (input.authRole === "super_admin" || input.authRole === "admin") return true;
    if (input.membershipRole && adminRoles.has(String(input.membershipRole).toLowerCase())) return true;
    return false;
}

assert.equal(normalizeInvoiceStatus("Paid", null, 100, 100), "paid");
assert.equal(normalizeInvoiceStatus("sent", "2020-01-01", 0, 100), "overdue");
assert.equal(normalizeInvoiceStatus("draft", null, 0, 0), "draft");
assert.equal(normalizeInvoiceStatus("cancelled", null, 0, 0), "cancelled");
assert.equal(inferPaymentMethod("stripe_card"), "stripe");
assert.equal(inferPaymentMethod("razorpay_upi"), "razorpay");
assert.equal(inferPaymentMethod("UPI QR"), "upi");
assert.equal(inferPaymentMethod("Bank NEFT"), "bank_transfer");
assert.equal(classifySubscriptionBucket("trialing"), "trial");
assert.equal(classifySubscriptionBucket("active"), "active");
assert.equal(classifySubscriptionBucket("cancelled"), "cancellations");
assert.equal(classifySubscriptionBucket("active", "upgrade"), "upgrades");
assert.equal(classifyAutomationKind("payment reminder", "email"), "payment_reminder");
assert.equal(classifyAutomationKind("overdue notice"), "overdue_notice");
assert.equal(isFounderOrAdminAccess({ authRole: "member", membershipRole: "member" }), false);
assert.equal(isFounderOrAdminAccess({ authRole: "member", membershipRole: "founder" }), true);

console.log("test-ai-finance-billing-engine: ok");
