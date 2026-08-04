export const DEFAULT_QUOTATION_TEMPLATE = `# Quotation Template

> **Arjun Automation — Pricing Quotation**

---

## Quotation Details

| Field | Value |
|-------|-------|
| **Quotation No.** | AA-Q-[YYYY]-[###] |
| **Date** | [Date] |
| **Valid Until** | [Date + 30 days] |
| **Client** | [Client Name] |
| **Contact** | [Contact Name, Email] |
| **Prepared By** | [Sales Rep Name] |

---

## Line Items

| # | Description | Qty | Unit Price | Amount |
|---|-------------|-----|------------|--------|
| 1 | Platform Implementation — [Tier] | 1 | \$[Amount] | \$[Amount] |
| 2 | Industry Pack — [Pack Name] | 1 | \$[Amount] | \$[Amount] |
| 3 | Additional Location Setup (×[N]) | [N] | \$[Amount] | \$[Amount] |
| 4 | Integration — [System Name] | [N] | \$[Amount] | \$[Amount] |
| 5 | AI Worker Integration — [Package] | 1 | \$[Amount] | \$[Amount] |
| 6 | Data Migration | 1 | \$[Amount] | \$[Amount] |
| 7 | Training (additional hours) | [N] | \$[Amount]/hr | \$[Amount] |
| | | | **Subtotal** | **\$[Subtotal]** |
| | | | Discount ([X]%) | -\$[Discount] |
| | | | **Total** | **\$[Total]** |

---

## Platform Subscription (Annual, Separate)

| Plan | Users | Modules | Annual Fee |
|------|-------|---------|------------|
| [Plan Name] | [N] | [List] | \$[Amount]/year |

*Subscription begins at go-live. First year may be pro-rated.*

---

## Payment Schedule

| Milestone | % | Amount | Due |
|-----------|---|--------|-----|
| Contract Signing | 40% | \$[Amount] | Upon SOW execution |
| UAT Commencement | 30% | \$[Amount] | Upon UAT environment ready |
| Go-Live | 30% | \$[Amount] | Production cutover |

---

## Terms & Conditions

1. Prices valid for 30 days from quotation date
2. Scope changes subject to change order process
3. Travel and expenses billed at cost if on-site required
4. Platform subscription billed separately per commercial agreement
5. All fees exclusive of applicable taxes
6. Payment due within 15 days of invoice

---

## Acceptance

To accept this quotation, sign below and return to sales@arjunautomation.com

| Client Signature | Date |
|------------------|------|
| _________________ | _____ |

---

*© Arjun Automation. Template v2.0.*
`;
