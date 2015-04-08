var Config, Pack, Raindrop, Util, buffer, generate, hex, index, lastTimestamp, next;

Pack = require('../package.json');

Util = require('./util');

Config = require('./config');

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
    if (arg.length !== 16 && !Raindrop.isValid(Util.decode(arg))) {
      throw new Error('Argument passed in must be a single string of 16 characters.');
    }
    buf = buffer(Util.decode(arg));
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
  Object.defineProperty(this, 'str', {
    get: function() {
      return buf.map(hex.bind(this, 2)).join('');
    }
  });
  return Object.defineProperty(this, 'estr', {
    get: function() {
      return Util.encode(buf.map(hex.bind(this, 2)).join(''));
    }
  });
};

index = parseInt(Math.random() * 0xFFFFFF, 10);

lastTimestamp = void 0;

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
  var eid, machineId, ref, ref1, ref2, sid, time, timestamp;
  time = Date.now() / 1000;
  timestamp = parseInt(time, 10);
  if (/object|undefined/.test(typeof lastTimestamp)) {
    lastTimestamp = timestamp;
  }
  if (timestamp > lastTimestamp) {
    lastTimestamp = timestamp;
    index = parseInt(Math.random() * 0xFFFFFF, 10);
  }
  time = timestamp % 0xFFFFFFFF;
  machineId = (ref = arg != null ? arg.machineId : void 0) != null ? ref : Config.defaultMachineId;
  sid = (ref1 = arg != null ? arg.serviceTypeId : void 0) != null ? ref1 : Config.defaultSid;
  eid = (ref2 = arg != null ? arg.entityTypeId : void 0) != null ? ref2 : Config.defaultEid;
  if (!(Util.isUmedInt(machineId))) {
    throw new Error('Machine Id must be between 0 and 167772155');
  }
  if (!(Util.isUtinyInt(sid))) {
    throw new Error('Service Id must be between 0 and 255');
  }
  if (!(Util.isUtinyInt(eid))) {
    throw new Error('Entity Type Id must be between 0 and 255');
  }
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

Raindrop.isValid = function(raindrop) {
  if (!raindrop) {
    return false;
  }
  return /^[0-9A-F]{24}$/i.test(raindrop.toString());
};

Raindrop.generate = generate;

Raindrop.prototype = {
  _type: 'Raindrop.' + Pack.version,
  toHexString: function(decoded) {
    if (decoded) {
      return this.str;
    } else {
      return this.estr;
    }
  },
  equals: function(other) {
    return !!other && this.str === other.toString();
  },
  getTimestamp: function() {
    return new Date(parseInt(this.str.substr(0, 8), 16) * 1000).toISOString();
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
  getCounter: function() {
    return parseInt(this.str.substr(18), 16);
  }
};

Raindrop.prototype.inspect = function() {
  return 'Raindrop(' + this + ')';
};

Raindrop.prototype.toString = Raindrop.prototype.toHexString;

module.exports = Raindrop;
