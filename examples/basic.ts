import { raindrop } from '../src/raindrop';

const options = {
  entityTypeId: 4,
  processId: 7844,
  serviceId: 1,
};

const drop = raindrop(options);

console.log(drop);
console.log(`version: ${drop.version}`);
console.log(drop.id);
console.log(drop.hexId);
console.log(drop.materials);
console.log(drop.decoded());
console.log(`timestamp: ${drop.decoded().timestamp}`);
console.log(`entity type id: ${drop.decoded().entityTypeId}`);
console.log(`process id: ${drop.decoded().processId}`);
console.log(`service id: ${drop.decoded().serviceId}`);
console.log(`counter: ${drop.decoded().counter}`);

const drop2 = raindrop(options);

console.log(`equals self: ${drop.equals(drop)}`);
console.log(`equals other: ${drop.equals(drop2)}`);
