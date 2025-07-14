import { encodeAddress, decodeAddress, blake2AsHex } from '@polkadot/util-crypto';
import { Buffer } from 'buffer';

export const ADDRESS_FORMAT = {
  ss58: 'SS58',
  h160: 'H160',
  snow: 'SNOW',
  arctic: 'Arctic',
  pubKey: 'Public Key',
};

export const CHAIN_PREFIX = {
  snow: 2207,
  ss58: 42,
  arctic: 2208,
};

export function convertH160ToSs58(h160Addr: string): string {
  validateH160(h160Addr);
  const addressBytes = Buffer.from(h160Addr.slice(2), 'hex');
  const prefixBytes = Buffer.from('evm:');
  const convertBytes = Uint8Array.from(Buffer.concat([prefixBytes, addressBytes]));
  const finalAddressHex = blake2AsHex(convertBytes, 256);
  return encodeAddress(finalAddressHex, CHAIN_PREFIX.ss58);
}

export function convertSs58ToH160(ss58Addr: string): string {
  validateSs58(ss58Addr);
  const pubKey = getPubKey(ss58Addr);
  return pubKey.slice(0, 42);
}

export function getPubKey(ss58addr: string): string {
  return '0x' + Buffer.from(decodeAddress(ss58addr)).toString('hex');
}

export function encodePubKey(pubKey: string, prefix: number): string {
  validatePubKey(pubKey);
  return encodeAddress(pubKey, prefix);
}

export function encodePolkadotAddress(addr: string, prefix: number): string {
  try {
    return encodeAddress(addr, prefix);
  } catch {
    throw new Error('Invalid Address provided!');
  }
}

export function validateH160(h160Addr: string): void {
  const re = /^0x[0-9A-Fa-f]{40}$/;
  if (!re.test(h160Addr)) {
    throw new Error('Invalid H160 address provided!');
  }
}

export function validateSs58(ss58Addr: string): void {
  if (ss58Addr.length !== 48 || ss58Addr.at(0) !== '5') {
    throw new Error('Invalid SS58 address provided!');
  }
}

export function validatePubKey(pubkey: string): void {
  const re = /^0x[0-9a-fA-F]{64}$/;
  if (!re.test(pubkey)) {
    throw new Error('Invalid Public Key provided!');
  }
}

// Convert H160 address to bytes32 for smart contract
export function h160ToPubKey(h160Addr: string): string {
  validateH160(h160Addr);
  
  // First convert H160 to SS58 using the same method as the reference
  const ss58Address = convertH160ToSs58(h160Addr);
  
  // Then get the pubkey from the SS58 address
  return getPubKey(ss58Address);
}

// Convert SS58 address to bytes32 for smart contract
export function ss58ToPubKey(ss58Addr: string): string {
  validateSs58(ss58Addr);
  return getPubKey(ss58Addr);
}
