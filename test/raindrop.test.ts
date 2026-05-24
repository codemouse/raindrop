import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { raindrop } from '../src/raindrop';

describe('raindrop()', () => {
  describe('shape', () => {
    test('returns an object with all expected properties', () => {
      const drop = raindrop({ entityTypeId: 1, processId: 100, serviceId: 2 });
      assert.ok(drop.id);
      assert.ok(drop.hexId);
      assert.ok(drop.version);
      assert.ok(drop.materials);
      assert.strictEqual(typeof drop.decoded, 'function');
      assert.strictEqual(typeof drop.equals, 'function');
    });

    test('id is a 16-character string', () => {
      const drop = raindrop();
      assert.strictEqual(typeof drop.id, 'string');
      assert.strictEqual(drop.id.length, 16);
    });

    test('hexId is a 24-character lowercase hex string', () => {
      const drop = raindrop();
      assert.strictEqual(drop.hexId.length, 24);
      assert.match(drop.hexId, /^[0-9a-f]{24}$/);
    });

    test('version is a semver string', () => {
      const drop = raindrop();
      assert.match(drop.version, /^\d+\.\d+\.\d+$/);
    });

    test('materials timestamp is a valid ISO 8601 string', () => {
      const drop = raindrop();
      assert.match(drop.materials.timestamp, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      assert.ok(!isNaN(new Date(drop.materials.timestamp).getTime()));
    });
  });

  describe('options', () => {
    test('materials reflect passed entityTypeId, processId, serviceId', () => {
      const opts = { entityTypeId: 4, processId: 7844, serviceId: 1 };
      const drop = raindrop(opts);
      assert.strictEqual(drop.materials.entityTypeId, opts.entityTypeId);
      assert.strictEqual(drop.materials.processId, opts.processId);
      assert.strictEqual(drop.materials.serviceId, opts.serviceId);
    });

    test('works with no options', () => {
      assert.doesNotThrow(() => raindrop());
    });

    test('works with all-zero options', () => {
      assert.doesNotThrow(() => raindrop({ entityTypeId: 0, processId: 0, serviceId: 0 }));
    });

    test('works with max valid option values', () => {
      assert.doesNotThrow(() =>
        raindrop({ entityTypeId: 0xff, processId: 0xffffff, serviceId: 0xff }),
      );
    });
  });

  describe('validation', () => {
    test('throws for entityTypeId above 255', () => {
      assert.throws(() => raindrop({ entityTypeId: 256 }), /must be a number between/);
    });

    test('throws for processId above 16777215', () => {
      assert.throws(() => raindrop({ processId: 0x1000000 }), /must be a number between/);
    });

    test('throws for serviceId above 255', () => {
      assert.throws(() => raindrop({ serviceId: 256 }), /must be a number between/);
    });
  });

  describe('decoded()', () => {
    test('roundtrips all fields back to original values', () => {
      const opts = { entityTypeId: 4, processId: 7844, serviceId: 1 };
      const drop = raindrop(opts);
      const decoded = drop.decoded();
      assert.strictEqual(decoded.entityTypeId, opts.entityTypeId);
      assert.strictEqual(decoded.processId, opts.processId);
      assert.strictEqual(decoded.serviceId, opts.serviceId);
      assert.strictEqual(decoded.timestamp, drop.materials.timestamp);
      assert.strictEqual(decoded.counter, drop.materials.counter);
    });
  });

  describe('equals()', () => {
    test('returns true when compared to itself', () => {
      const drop = raindrop({ entityTypeId: 1, processId: 1, serviceId: 1 });
      assert.strictEqual(drop.equals(drop), true);
    });

    test('returns false for a different drop with the same options', () => {
      const opts = { entityTypeId: 1, processId: 1, serviceId: 1 };
      const drop1 = raindrop(opts);
      const drop2 = raindrop(opts);
      assert.strictEqual(drop1.equals(drop2), false);
    });
  });

  describe('uniqueness', () => {
    test('generates 1000 unique ids', () => {
      const opts = { entityTypeId: 1, processId: 1, serviceId: 1 };
      const ids = new Set(Array.from({ length: 1000 }, () => raindrop(opts).id));
      assert.strictEqual(ids.size, 1000);
    });

    test('counter increments by 1 for sequential calls within the same second', () => {
      const drops = Array.from({ length: 5 }, () => raindrop({ processId: 1 }));
      const timestamps = drops.map(d => d.decoded().timestamp);
      const counters = drops.map(d => d.materials.counter);

      // Only assert sequential increments if all drops share the same second
      if (new Set(timestamps).size === 1) {
        for (let i = 1; i < counters.length; i++) {
          assert.strictEqual(counters[i], counters[i - 1] + 1);
        }
      }
    });
  });
});
