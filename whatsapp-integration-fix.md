# Task: WhatsApp Integration and Chat Fix

## Objective
1. Fix automatic chat opening in `src/components/store/product-chat.tsx`.
2. Implement WhatsApp bot in `src/app/api/webhooks/whatsapp/route.ts`.
3. Provide Z-API configuration instructions.

## Proposed Changes

### 1. Frontend: Product Chat Fix
- File: `src/components/store/product-chat.tsx`
- Replace `useEffect` for automatic opening with the one provided in the prompt.
- Modify `handleOpen` to remove initial message logic (it should only open the chat).
- Ensure `sleep` and `runTypewriter` are available and correctly used.

### 2. Backend: WhatsApp Webhook
- File: `src/app/api/webhooks/whatsapp/route.ts`
- Implement the route using Groq SDK and Z-API for sending responses.
- Load knowledge base from `public/data/products-knowledge.json`.

### 3. Documentation
- Instructions for the user to configure the webhook in Z-API panel.

## Constraints
- Next.js 15.4.11
- Tailwind 4
- TypeScript (no 'as any')
- Use Server Components where possible (webhook is a Route Handler)

## Verification Plan
1. Manual code review for "as any" and type safety.
2. Verify file paths.
3. Check environment variables usage.
