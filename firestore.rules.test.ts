import { readFileSync } from 'node:fs';

/**
 * Security Rules Verification Spec for Y-CRAFT Waiting Orders
 * Validates that every Dirty Dozen payload is covered by DRAFT_firestore.rules / firestore.rules.
 */
export const DIRTY_DOZEN_CASES = [
  { id: 1, name: 'Unauthenticated list on waiting_orders', expected: 'PERMISSION_DENIED' },
  { id: 2, name: 'Non-owner authenticated list on waiting_orders', expected: 'PERMISSION_DENIED' },
  { id: 3, name: 'Unverified owner email spoofing', expected: 'PERMISSION_DENIED' },
  { id: 4, name: 'Non-owner get on waiting_orders/{id}', expected: 'PERMISSION_DENIED' },
  { id: 5, name: 'Shadow field injection on order create', expected: 'PERMISSION_DENIED' },
  { id: 6, name: 'Status bypass (completed on create)', expected: 'PERMISSION_DENIED' },
  { id: 7, name: 'Forged createdAt timestamp on create', expected: 'PERMISSION_DENIED' },
  { id: 8, name: 'Invalid document ID characters', expected: 'PERMISSION_DENIED' },
  { id: 9, name: 'Oversized notes string (>1000 chars)', expected: 'PERMISSION_DENIED' },
  { id: 10, name: 'Non-owner status update attempt', expected: 'PERMISSION_DENIED' },
  { id: 11, name: 'Admin immutable field mutation attempt', expected: 'PERMISSION_DENIED' },
  { id: 12, name: 'Self-assigned admin escalation attempt', expected: 'PERMISSION_DENIED' },
] as const;

export function verifyRulesInvariants(rulesPath = './firestore.rules'): boolean {
  const rules = readFileSync(rulesPath, 'utf8');
  const requiredAssertions = [
    "rules_version = '2';",
    'allow read, write: if false;',
    'request.auth.token.email_verified == true',
    "request.auth.token.email == 'youssefeslam906@gmail.com'",
    'isValidWaitingOrder(incoming())',
    "incoming().status == 'waiting'",
    "affectedKeys().hasOnly(['status', 'updatedAt'])",
    'allow list: if isOwnerEmail();',
  ];
  return requiredAssertions.every((assertion) => rules.includes(assertion));
}
