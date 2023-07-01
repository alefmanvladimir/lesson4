import { toNano } from 'ton-core';
import { BuilkAdder } from '../wrappers/BuilkAdder';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const builkAdder = provider.open(await BuilkAdder.fromInit());

    await builkAdder.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(builkAdder.address);

    // run methods on `builkAdder`
}
