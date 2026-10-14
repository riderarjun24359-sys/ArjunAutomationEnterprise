# New website lead — owner alert (server-side only, never rendered to visitors)

Subject: New website lead from {{source}} ({{leadIdShort}})

A new enquiry was stored via the website lead form.

Lead ID: {{leadId}}
Name: {{leadName}}
Email: {{leadEmail}}
Company: {{company}}
Phone: {{phone}}
Source: {{source}}
Received at: {{receivedAt}}
Privacy consent: given (notice {{consentVersion}})

Message:
{{message}}

Next step: review in Supabase sales_leads + sales_audit_logs, then follow up within one business day. Consent proof is in sales_audit_logs.metadata; do not contact without it.
