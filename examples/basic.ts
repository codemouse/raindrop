/**
 * Raindrop examples
 *
 * Run with: npm run example
 */

import { raindrop } from '../src/raindrop';
import type { RaindropOptions } from '../src/raindrop';

// ─── 1. Zero-config ID ────────────────────────────────────────────────────────
// All fields default to 0 / random process id. Useful for prototyping.

const simple = raindrop();
console.log('--- 1. Zero-config');
console.log('  id     :', simple.id);       // 16-char URL-safe string
console.log('  hexId  :', simple.hexId);    // 24-char hex representation
console.log('  version:', simple.version);

// ─── 2. Service-aware ID ─────────────────────────────────────────────────────
// Real services should always pin processId (machine + pid combo) and serviceId
// so that IDs are decodable back to their origin.

const USER_SERVICE  = 1;  // serviceId  : 0–255
const ORDER_ENTITY  = 4;  // entityTypeId: 0–255

const opts: RaindropOptions = {
  processId:    7844,           // e.g. machine-id XOR process pid
  serviceId:    USER_SERVICE,
  entityTypeId: ORDER_ENTITY,
};

const drop = raindrop(opts);
console.log('\n--- 2. Service-aware ID');
console.log('  id      :', drop.id);
console.log('  hexId   :', drop.hexId);
console.log('  materials:', drop.materials);

// ─── 3. Decoding ─────────────────────────────────────────────────────────────
// decode() reconstructs every field from the hex string alone — no database
// round-trip needed.

const decoded = drop.decoded();
console.log('\n--- 3. Decoded');
console.log('  timestamp   :', decoded.timestamp);    // ISO-8601 (second precision)
console.log('  processId   :', decoded.processId);
console.log('  serviceId   :', decoded.serviceId);
console.log('  entityTypeId:', decoded.entityTypeId);
console.log('  counter     :', decoded.counter);

// ─── 4. Equality ─────────────────────────────────────────────────────────────
// equals() compares both id and version, so IDs from different library versions
// never silently compare as equal.

const other = raindrop(opts);
console.log('\n--- 4. Equality');
console.log('  drop == drop :', drop.equals(drop));   // true
console.log('  drop == other:', drop.equals(other));  // false

// ─── 5. Bulk generation ───────────────────────────────────────────────────────
// The counter increments monotonically within a second, so bulk IDs are still
// orderable by insertion time even when generated in tight loops.

const batch = Array.from({ length: 5 }, () => raindrop(opts));
console.log('\n--- 5. Bulk (5 IDs)');
batch.forEach((d, i) => console.log(`  [${i}] ${d.id}  counter=${d.decoded().counter}`));

// ─── 6. Round-trip verify ─────────────────────────────────────────────────────
// Store the hexId, then call decoded() later — the result is identical because
// decoded() reads only from the immutable hex string, not any runtime state.

const stored = drop.hexId;
console.log('\n--- 6. Round-trip verify');
console.log('  stored hexId  :', stored);
console.log('  decoded later :', drop.decoded());  // identical to step 3

