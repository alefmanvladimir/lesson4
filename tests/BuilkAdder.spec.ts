import { Blockchain, SandboxContract, TreasuryContract } from '@ton-community/sandbox';
import { toNano } from 'ton-core';
import { BuilkAdder } from '../wrappers/BuilkAdder';
import '@ton-community/test-utils';
import { Counter } from '../wrappers/Counter';

describe('BuilkAdder', () => {
    let blockchain: Blockchain;
    let builkAdder: SandboxContract<BuilkAdder>;
    let counter: SandboxContract<Counter>;
    let deployer: SandboxContract<TreasuryContract>
    beforeEach(async () => {
        blockchain = await Blockchain.create();

        builkAdder = blockchain.openContract(await BuilkAdder.fromInit());
        counter = blockchain.openContract(await Counter.fromInit(0n));

        deployer = await blockchain.treasury('deployer');

        const deployResult1 = await builkAdder.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        const deployResult2 = await counter.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult1.transactions).toHaveTransaction({
            from: deployer.address,
            to: builkAdder.address,
            deploy: true,
            success: true,
        });

        expect(deployResult2.transactions).toHaveTransaction({
            from: deployer.address,
            to: counter.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        const res = await builkAdder.send(deployer.getSender(), {
            value: toNano('0.5')
        }, {
            $$type: 'Reach',
            counter: counter.address,
            target: 11n
        })

        // console.log(res)

        let count = await counter.getCounter()
        console.log("counter - ", count)


        // counter.send(deployer.getSender(), {
        //     value: toNano('0.2'),
        //     bounce: true
        // }, {
        //     $$type: "CounterValue",
        //     amount: 5n
        // })
        await sleep(1000)
        const flag = await counter.getFlag()

        console.log("flag - ", flag)
    });
});

async function sleep(t: number){
    return new Promise(resolve=>setTimeout(resolve, t))
}