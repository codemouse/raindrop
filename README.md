# Raindrop

Raindrop is a distributed id generation utility that mimics the MongoDB BSON ObjectID implementation, with a few key tweaks.

The identifier is a 24 character hex string that is automatically encoded into a compact 16 character string represented with the following alphabet:

'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'

The core hex identifier is represented with the following attributes:

- 4-byte value representing the seconds since the Unix epoch
- 3-byte machine identifier (random value)
- 1-byte microservice id
- 1-byte entity type id
- 3-byte counter, starting with a random value

Raindrop is entirely deconstructable into its core values, to allow for the id to travel with key information regarding microservice origination id and domain-specific entity type identifiers.

