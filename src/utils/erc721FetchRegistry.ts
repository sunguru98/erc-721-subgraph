import { Address, log } from '@graphprotocol/graph-ts';

import { Contract, TokenRegistry } from '../../generated/schema';

import { IERC721Metadata } from '../../generated/IERC721/IERC721Metadata';

export function fetchRegistry(address: Address): TokenRegistry {
  let erc721 = IERC721Metadata.bind(address);
  let contract = Contract.load(address.toHex());

  if (contract == null) {
    contract = new Contract(address.toHex());
    log.info('CONTRACT ID {}', [contract.id]);
    contract.asERC721 = contract.id;
    contract.save();
    log.info('CONTRACT AS ERC721 {}', [contract.asERC721.toString()]);
  }

  let registry = TokenRegistry.load(contract.id);
  if (registry == null) {
    registry = new TokenRegistry(contract.id);
    let try_name = erc721.try_name();
    let try_symbol = erc721.try_symbol();
    registry.name = try_name.reverted ? '' : try_name.value;
    registry.symbol = try_symbol.reverted ? '' : try_symbol.value;
    log.info('CONTRACT ADDRESS {}, TOKEN NAME {}, TOKEN SYMBOL {}', [
      contract.id,
      registry.name,
      registry.symbol,
    ]);
  }

  contract.save();

  return registry as TokenRegistry;
}
