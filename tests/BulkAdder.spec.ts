import { Blockchain, SandboxContract, TreasuryContract } from '@ton-community/sandbox';
import { toNano } from 'ton-core';
import { BulkAdder } from '../wrappers/BulkAdder';
import '@ton-community/test-utils';
import { Counter } from '../wrappers/Counter';
import { count } from 'console';

describe('BulkAdder and Counter', () => {
    let blockchain: Blockchain;
    let bulkAdder: SandboxContract<BulkAdder>;
    let counter: SandboxContract<Counter>
    let deployer: SandboxContract<TreasuryContract>
    beforeEach(async () => {
        blockchain = await Blockchain.create();

        bulkAdder = blockchain.openContract(await BulkAdder.fromInit());
        counter = blockchain.openContract(await Counter.fromInit(1n));

        deployer = await blockchain.treasury('deployer');

        const deployResultBulkAdder = await bulkAdder.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        const deployResultCounter = await counter.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResultBulkAdder.transactions).toHaveTransaction({
            from: deployer.address,
            to: bulkAdder.address,
            deploy: true,
            success: true,
        });

        expect(deployResultCounter.transactions).toHaveTransaction({
            from: deployer.address,
            to: counter.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and bulkAdder are ready to use
    });

    it('should increse to target', async ()=>{
        const target = 5n
        const res = await bulkAdder.send(deployer.getSender(), {
            value: toNano('0.6')
        }, {
            $$type: 'Reach',
            counter: counter.address,
            target
        })

        const count = await counter.getCounter()
        expect(count).toEqual(target);

        
    })
});
