# Auto-Quote (React Native Web via Expo)

An auto-quoting + invoicing starter app for 3D printing commissions.

## Features in this starter

- Client intake form (contact + project + STL links/files + preferences)
- Modular quote math with adjustable settings
- Job card pipeline:
  - pending -> approved -> quoted -> invoiced
- Generated quote + invoice message templates
- Email framework (mailto drafts for quote/invoice sends)
- PDF-ready document framework:
  - downloadable HTML quote/invoice files
  - print dialog workflow so users can save to PDF
- Basic finance/material tracking summary
- Local persistence in web localStorage for settings, jobs, finance records, docs, and communication history

## Run

```bash
npm install
npm run web
```

## Project structure

- `App.tsx` - app shell + workflow wiring.
- `src/types.ts` - domain models.
- `src/logic/pricing.ts` - quote engine.
- `src/logic/messages.ts` - quote/invoice text generation.
- `src/logic/documentTemplates.ts` - reusable HTML rendering for quote/invoice docs.
- `src/services/email.ts` - email channel abstraction (mailto drafting).
- `src/services/pdf.ts` - document export helpers (download + print/PDF).
- `src/config/defaultSettings.ts` - default pricing knobs.
- `src/state/usePersistentState.ts` - local storage hook.
- `src/components/FilePicker.web.tsx` - web STL uploader input.

## Suggested next upgrades

- Real SMTP/transactional email provider integration (SendGrid/SES/Postmark)
- Server-side PDF generation service for consistent rendering
- Auth + role-based access
- Client portal with quote acceptance and payments (e.g., Stripe)
- Inventory depletion by filament SKU/spool
