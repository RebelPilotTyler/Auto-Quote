# Auto-Quote (React Native Web via Expo)

An auto-quoting + invoicing starter app for 3D printing commissions.

## Features in this starter

- Client intake form (contact + project + STL links/files + preferences)
- Modular quote math with adjustable settings
- Job card pipeline:
  - pending -> approved -> quoted -> invoiced
- Generated quote + invoice message templates
- Basic finance/material tracking summary
- Local persistence in web localStorage for settings, jobs, and finance records

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
- `src/config/defaultSettings.ts` - default pricing knobs.
- `src/state/usePersistentState.ts` - local storage hook.
- `src/components/FilePicker.web.tsx` - web STL uploader input.

## Suggested next upgrades

- Auth + role-based access
- Client portal with quote acceptance and payments (e.g., Stripe)
- Real print-time estimation from sliced model metadata
- Inventory depletion by filament SKU/spool
- Exportable PDFs for formal quotes/invoices
- Email sending automation (SendGrid/SES)
