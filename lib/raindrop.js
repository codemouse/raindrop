var IntEncoder, Pack, Raindrop, _, buffer, decode, encode, generate, hex, index, isTinyInt, machineId, next;

_ = require('lodash');

IntEncoder = require('int-encoder');

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
  if (_.isString(arg)) {
    if (arg.length !== 16 && !Raindrop.isValid(decode(arg, 16))) {
      throw new Error('Argument passed in must be a single string of 16 characters.');
    }
    console.log(1);
    buf = buffer(decode(arg), 16);
  } else if (_.isObject(arg)) {
    console.log(2);
    buf = buffer(generate(arg));
  } else {
    throw new Error('Invalid argument passed. Must pass a single string of 16 characters, or arguments object containing serviceId and entityTypeId.');
  }
  Object.defineProperty(this, 'id', {
    enumerable: true,
    get: function() {
      return String.fromCharCode.apply(this, buf);
    }
  });
  Object.defineProperty(this, 'str', {
    get: function() {
      var x;
      x = buf.map(hex.bind(this, 2)).join('');
      console.log(x);
      x;
      return new Date(parseInt(x.slice(0, 8), 16) * 1000).toISOString();
    }
  });
  return Object.defineProperty(this, 'estr', {
    get: function() {
      return encode(buf.map(hex.bind(this, 2)).join(''));
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

decode = function(arg) {
  return IntEncoder.decode(arg, 16);
};

encode = function(arg) {
  return IntEncoder.encode(arg, 16);
};

generate = function(arg) {
  var eid, ref, ref1, sid, time;
  time = Date.now();
  time = parseInt(time, 10) % 0xFFFFFFFF;
  sid = (ref = arg.serviceTypeId) != null ? ref : -1;
  eid = (ref1 = arg.entityTypeId) != null ? ref1 : -1;
  if (!(isTinyInt(sid))) {
    throw new Error('Service Id must be between 1 and 255');
  }
  if (!(isTinyInt(eid))) {
    throw new Error('Entity Type Id must be between 1 and 255');
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

isTinyInt = function(arg) {
  return arg >= 1 && arg <= 255;
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
    return new Date(parseInt(this.str.slice(0, 8), 16) * 1000).toISOString();
  },
  getMachineId: function() {
    return parseInt(this.str.slice(8, 6), 16);
  },
  getServiceId: function() {
    return parseInt(this.str.slice(14, 2), 16);
  },
  getEntityTypeId: function() {
    return parseInt(this.str.slice(16, 2), 16);
  },
  getRandomCounter: function() {
    return parseInt(this.str.slice(18), 16);
  }
};

Raindrop.prototype.inspect = function() {
  return 'Raindrop(' + this + ')';
};

Raindrop.prototype.toString = Raindrop.prototype.toHexString;

module.exports = Raindrop;
