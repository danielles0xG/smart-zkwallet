import { ContractFactory } from "zksync-web3";

// const contractFactory = new ContractFactory(abi, bytecode, initiator, "createAccount");
// const aa = await contractFactory.deploy(...args);
// await aa.deployed();
/**
 * import { utils } from "zksync-web3";

    // here the `tx` is a `TransactionRequest` object from `zksync-web3` SDK.
    // and the zksyncProvider is the `Provider` object from `zksync-web3` SDK connected to zkSync network.
    tx.from = aaAddress;
    tx.customData = {
    ...tx.customData,
    customSignature: aaSignature,
    };
    const serializedTx = utils.serialize({ ...tx });

    const sentTx = await zksyncProvider.sendTransaction(serializedTx);
 */

import { utils, Wallet } from 'zksync-web3';
import * as ethers from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';

export default async function (hre: HardhatRuntimeEnvironment) {
  // Private key of the account used to deploy
  const wallet = new Wallet('0x501a6ebf002be33b2378b72affd602419ec36c2aa14fe5fbc80664ef13ec1005');
  const deployer = new Deployer(hre, wallet);
  const factoryArtifact = await deployer.loadArtifact('AAFactory');
  const aaArtifact = await deployer.loadArtifact('TwoUserMultisig');

  // Getting the bytecodeHash of the account
  const bytecodeHash = utils.hashBytecode(aaArtifact.bytecode);

  const factory = await deployer.deploy(
    factoryArtifact,
    [bytecodeHash],
    undefined,
    [
      // Since the factory requires the code of the multisig to be available,
      // we should pass it here as well.
      aaArtifact.bytecode,
    ]
  );

  console.log(`AA factory address: ${factory.address}`);
}
