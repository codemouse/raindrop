var Pack, Raindrop, buffer, generate, hex, index, machineId, next;

Pack = require('../package.json');

Raindrop = function(arg) {
  var buf;
  if (!(this instanceof Raindrop)) {
    return new Raindrop(arg);
  }
  if (arg && ((arg instanceof Raindrop) || arg._type === 'Raindrop.' + Pack.version)) {
    return arg;
  }
  buf = void 0;
  if (typeof arg === 'string') {
    if (arg.length !== 12 && !Raindrop.isValid(arg)) {
      throw new Error('Argument passed in must be a single String of 12 bytes or a string of 24 hex characters');
    }
    buf = buffer(arg);
  } else {
    if (/object|undefined/.test(typeof arg)) {
      buf = buffer(generate(arg));
    }
  }
  Object.defineProperty(this, 'id', {
    enumerable: true,
    get: function() {
      return String.fromCharCode.apply(this, buf);
    }
  });
  return Object.defineProperty(this, 'str', {
    get: function() {
      return buf.map(hex.bind(this, 2)).join('');
    }
  });
};

index = Raindrop.index = parseInt(Math.random() * 0xFFFFFF, 10);

machineId = parseInt(Math.random() * 0xFFFFFF, 10);

buffer = function(str) {
  var i, out;
  i = void 0;
  out = [];
  if (str.length === 24) {
    i = 0;
    while (i < 24) {
      out.push(parseInt(str[i] + str[i + 1], 16));
      i += 2;
    }
  } else if (str.length === 12) {
    i = 0;
    while (i < 12) {
      out.push(str.charCodeAt(i));
      i++;
    }
  }
  return out;
};

generate = function(arg) {
  var eid, ref, ref1, sid, time;
  time = Date.now();
  time = parseInt(time, 10) % 0xFFFFFFFF;
  sid = (ref = arg.serviceTypeId) != null ? ref : 0;
  eid = (ref1 = arg.entityTypeId) != null ? ref1 : 0;
  return hex(8, time) + hex(6, machineId) + hex(2, sid) + hex(2, eid) + hex(6, next());
};

hex = function(length, n) {
  n = n.toString(16);
  if (n.length === length) {
    return n;
  } else {
    return '00000000'.substring(n.length, length) + n;
  }
};

next = function() {
  return index = (index + 1) % 0xFFFFFF;
};

Raindrop.createFromTime = function(time) {
  time = parseInt(time, 10) % 0xFFFFFFFF;
  return new Raindrop(hex(8, time) + '0000000000000000');
};

Raindrop.createFromHexString = function(hexString) {
  if (!Raindrop.isValid(hexString)) {
    throw new Error('Invalid Raindrop hex string');
  }
  return new Raindrop(hexString);
};

Raindrop.isValid = function(rainRaindrop) {
  if (!rainRaindrop) {
    return false;
  }
  return /^[0-9A-F]{24}$/i.test(rainRaindrop.toString());
};

Raindrop.generate = generate;

Raindrop.prototype = {
  _type: 'Raindrop.' + Pack.version,
  toHexString: function() {
    return this.str;
  },
  equals: function(other) {
    return !!other && this.str === other.toString();
  },
  getTimestamp: function() {
    return (new Date(parseInt(this.str.substr(0, 8), 16) * 1000)).toISOString();
  },
  getMachineId: function() {
    return parseInt(this.str.substr(8, 6), 16);
  },
  getServiceId: function() {
    return parseInt(this.str.substr(14, 2), 16);
  },
  getEntityTypeId: function() {
    return parseInt(this.str.substr(16, 2), 16);
  },
  getRandomCounter: function() {
    return parseInt(this.str.substr(18), 16);
  }
};

Raindrop.prototype.inspect = function() {
  return 'Raindrop(' + this + ')';
};

Raindrop.prototype.toJSON = Raindrop.prototype.toHexString;

Raindrop.prototype.toString = Raindrop.prototype.toHexString;

module.exports = Raindrop;
