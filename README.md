# Auto-Quote (React Native Web via Expo)

An auto-quoting + invoicing starter app for 3D printing commissions.

## Features in this starter

- Client intake form (contact + project + STL links/files + preferences)
- Modular quote math with adjustable settings
- Job card pipeline:
  - pending -> approved -> quoted -> invoiced
- Generated quote + invoice message templates
- Email provider interface:
  - `mailto` provider for draft-based sending
  - API provider for real transactional sends via your email backend
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

## API email provider contract

When API provider mode is enabled, the app sends a `POST` request to your configured endpoint with JSON:

```json
{
  "from": "quotes@yourshop.com",
  "to": "client@email.com",
  "subject": "3D Print Quote: Widget",
  "body": "..."
}
```

Use the `Authorization: Bearer <apiKey>` header by setting an API key in settings.

## Project structure

- `App.tsx` - app shell + workflow wiring.
- `src/types.ts` - domain models.
- `src/logic/pricing.ts` - quote engine.
- `src/logic/messages.ts` - quote/invoice text generation.
- `src/logic/documentTemplates.ts` - reusable HTML rendering for quote/invoice docs.
- `src/services/email.ts` - provider interface + mailto/api implementations.
- `src/services/pdf.ts` - document export helpers (download + print/PDF).
- `src/config/defaultSettings.ts` - default pricing knobs.
- `src/config/defaultEmailConfig.ts` - default email provider config.
- `src/state/usePersistentState.ts` - local storage hook.
- `src/components/FilePicker.web.tsx` - web STL uploader input.
