import { Bytes, log, Address } from '@graphprotocol/graph-ts';
import { IERC721 } from '../../generated/IERC721/IERC721';

export function supportsInterface(
  contractAddress: Address,
  interfaceId: string,
  expected: boolean = true
): boolean {
  log.info('CALLING,', []);
  let erc721Normal = IERC721.bind(contractAddress);

  let result = erc721Normal.try_supportsInterface(
    Bytes.fromHexString(interfaceId) as Bytes
  );

  log.info('CALL FINISHED', []);

  if (!result.reverted) {
    log.info('EVENT ADDRESS, {}, RESULT {}', [
      contractAddress.toHex(),
      (result.value as boolean).toString(),
    ]);
    return result.value == expected;
  }

  return false;
}
