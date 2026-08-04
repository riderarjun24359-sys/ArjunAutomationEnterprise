export const DEFAULT_INVOICE_TEMPLATE = `# Invoice

> **Arjun Automation — Invoice Template**

---

## Invoice Details

| Field | Value |
|-------|-------|
| **Invoice No.** | AA-INV-[YYYY]-[###] |
| **Invoice Date** | [Date] |
| **Due Date** | [Date + 15 days] |
| **Client** | [Client Name] |
| **Billing Contact** | [Contact Name] |
| **Project Reference** | AA-P-[YYYY]-[###] |
| **Milestone** | [Milestone Name] |

---

## Bill To

[Client Company Name]  
[Address Line 1]  
[Address Line 2]  
[City, State, ZIP]  
[Tax ID / GSTIN if applicable]

---

## Line Items

| # | Description | Amount |
|---|-------------|--------|
| 1 | [Milestone description — e.g., Platform Implementation — Kickoff (40%)] | \$[Amount] |
| 2 | [Additional line item if applicable] | \$[Amount] |
| | **Subtotal** | **\$[Subtotal]** |
| | Tax ([X]%) | \$[Tax] |
| | **Total Due** | **\$[Total]** |

---

## Payment Instructions

**Bank Transfer:**  
Account Name: Arjun Automation  
Bank: [Bank Name]  
Account No.: [Account Number]  
IFSC/SWIFT: [Code]  
Reference: AA-INV-[YYYY]-[###]

**Online Payment:** [Payment portal link if applicable]

---

## Notes

- Payment due within 15 days of invoice date
- Late payments subject to 1.5% monthly interest
- Questions: finance@arjunautomation.com

---

*© Arjun Automation. Official Invoice.*
`;
