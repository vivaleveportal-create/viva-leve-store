# Viva Leve Portal — Transformation Plan

This document outlines the engineering and design transformation of the `viva-leve-portal` project into a specialized physical product store for the Brazilian 60+ audience.

## 📅 Phase 1: Audit and Cleanup

### 1.1 Data Schema Cleanup
Remove all references to digital products and multi-seller logic.

- **File:** `c:\Users\totic\my_projects\nextjs\viva-leve-portal\src\lib\models\Product.ts`
  - **Remove:** `digitalFile`, `isDigital`, `demoUrl`.
  - **Add:** `logzzProductId` (String, indexed), `logzzProductUrl` (String).
- **File:** `c:\Users\totic\my_projects\nextjs\viva-leve-portal\src\lib\models\Order.ts`
  - **Update:** Expand `status` enum to include `processing`, `shipped`, `delivered`, `cod_pending`.
  - **Add:** `shippingAddress` object (CEP, street, number, complement, neighborhood, city, state).
  - **Add:** `logzzOrderId` (String).
- **Delete:** `c:\Users\totic\my_projects\nextjs\viva-leve-portal\src\lib\models\DigitalFile.ts` (Obsolete).

### 1.2 UX/UI Audit and Base Configuration
- **Design Tokens:** Update `tailwind.config.ts` to implement the 18px base font size and warm color palette (removing "Pink Pig" pinks).
- **Behavior:** All buttons must have a minimum height of 48px and clear labels. No jargon (e.g., "SKU" -> "Código do Produto", "Payload" -> "Dados").

### 1.3 Routing and Content Cleanup
- **File:** `c:\Users\totic\my_projects\nextjs\viva-leve-portal\src\app\[locale]\(store)\products\[slug]\page.tsx`
  - Remove "Download imediato" section.
  - Update "Sobre o conteúdo" to "Detalhes do Produto".
  - Ensure all `Image` components have descriptive `alt` text in PT-BR.

---

## 🏗 Architectural Decisions

### A. Integration with Logzz (Inventory Management)
**Decision:** Store only `logzzProductId` and `logzzProductUrl` locally. No local stock control.

- **Option 1: Full Inventory Sync**
  - **Pros:** Real-time local stock checking.
  - **Cons:** High complexity, race conditions between store and Logzz warehouse.
- **Option 2: Proxy Inventory (Selected)**
  - **Pros:** Simplifies the database; Logzz is the single source of truth.
  - **Cons:** Reliance on Logzz API response during checkout.

### B. Payment Flow with Pix
**Decision:** Use Stripe's Native Pix integration (Phase 2).

- **Option 1: Manual Pix (Copy/Paste)**
  - **Pros:** Zero fees for the merchant.
  - **Cons:** High manual effort for order confirmation; prone to fraud.
- **Option 2: Stripe Pix (Selected)**
  - **Pros:** Automated status updates via webhook; high professional trust.
  - **Cons:** Standard Stripe transaction fees.

---

## 🎨 UX Requirements Implementation

| Requirement | Implementation Detail |
| :--- | :--- |
| **Base Font Size** | Set `rem` base to `18px` in global CSS or Tailwind config. |
| **Line Height** | All body text defaults to `leading-relaxed` (1.8). |
| **Button Height** | Base class `.btn` must have `min-h-[48px] px-6`. |
| **WCAG AA Contrast** | Validate all brand colors against background white using a contrast checker. |
| **Jargon Removal** | "Checkout" -> "Finalizar Compra", "Slug" -> "Link da página". |
| **Form Labels** | No floating labels without static visibility. Every field has a `<label>` tag. |

---

## 🚦 Execution Order (Critical Path)

1.  **Cleanup (Phase 1):** Remove legacy models and digital product UI. (BLOCKS EVERYTHING)
2.  **Schema Update:** Add Logzz fields and shipping details to User/Order schemas. (BLOCKS PHASE 2)
3.  **UI Foundation:** Update Tailwind and global CSS for 60+ accessibility. (BLOCKS FRONTEND ADAPTATION)
4.  **Logzz Integration (Phase 2):** Connect order fulfillment to Logzz API.
5.  **Phase 2 Checkout:** Adapt Stripe webhook to handle physical product parameters.

---

## 📊 Summary Table

| Metric | Estimated Value |
| :--- | :--- |
| **Total Files to Create** | 2 (Logzz Service, New Seed Script) |
| **Total Files to Change** | ~25 (Store UI, Admin forms, Models) |
| **Total Files to Delete** | 3 (Legacy models/routes) |
| **Complexity (Phase 1)** | 3/10 (Auditing and removal) |
| **Complexity (Phase 2)** | 7/10 (Logzz Bridge + Pix) |
| **Biggest Risk** | Logzz API latency causing timeout during a sensitive checkout flow for older adults. |

---

*Verified by Antigravity @ 2026-03-20*
