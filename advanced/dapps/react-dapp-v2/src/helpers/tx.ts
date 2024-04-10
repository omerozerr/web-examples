import * as encoding from "@walletconnect/encoding";

import { apiGetAccountNonce, apiGetGasPrice } from "./api";
import { parseEther } from "ethers/lib/utils";
import { SendCallsParams } from "../constants";

export async function formatTestTransaction(account: string) {
  const [namespace, reference, address] = account.split(":");
  const chainId = `${namespace}:${reference}`;

  let _nonce;
  try {
    _nonce = await apiGetAccountNonce(address, chainId);
  } catch (error) {
    throw new Error(
      `Failed to fetch nonce for address ${address} on chain ${chainId}`
    );
  }

  const nonce = encoding.sanitizeHex(encoding.numberToHex(_nonce));

  // gasPrice
  const _gasPrice = await apiGetGasPrice(chainId);
  const gasPrice = encoding.sanitizeHex(_gasPrice);

  // gasLimit
  const _gasLimit = 21000;
  const gasLimit = encoding.sanitizeHex(encoding.numberToHex(_gasLimit));

  // value
  const _value = 0;
  const value = encoding.sanitizeHex(encoding.numberToHex(_value));

  const tx = {
    from: address,
    to: address,
    data: "0x",
    nonce,
    gasPrice,
    gasLimit,
    value,
  };

  return tx;
}


export async function formatTestBatchCall(account: string) {
  const [namespace, reference, address] = account.split(":");
  // calldata for batch send
  const receiverAddress = '0xc3cE257B5e2A2ad92747dd486B38d7b4B36Ac7C9'
  const amountToSend = parseEther('0.0001').toHexString()
  const calls = [
    {
      to: receiverAddress as `0x${string}`,
      data:'0x' as `0x${string}`,
      value: amountToSend as `0x${string}`
    },
    {
      to: receiverAddress as `0x${string}`,
      data:'0x' as `0x${string}`,
      value: amountToSend as `0x${string}`
    },
  ]
  const sendCallsRequestParams:SendCallsParams = {
    version:'1.0',
    chainId: `0x${BigInt(reference).toString(16)}`,
    from: address as `0x${string}`,
    calls: calls,
    // capabilities: { paymasterService: { url: 'http://localhost:3002/api' } },
  }

  return sendCallsRequestParams;
}