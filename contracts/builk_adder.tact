import "@stdlib/deploy";

message CounterValue {
    amount: Int as uint32;
}

message Reach {
    counter: Address;
    target: Int as uint32;
}

contract BuilkAdder with Deployable {

    target: Int as uint32;

    init() {
        self.target = 0;    
    }

    receive(msg: Reach) {
        // require(msg.target<=10, "target can't be more than 10");
        self.target = msg.target; // 5
        // emit("Reach".asComment());
        // step 2: this contract will query the current counter value from the other contract
        send(SendParameters{
            to: msg.counter,
            value: 0,
            mode: SendRemainingValue + SendIgnoreErrors,
            body: "query".asComment()
        });
    }

    receive(msg: CounterValue){
        require(self.target<=10, "target can't be more than 10");
        if(msg.amount<self.target){
            // emit("CounterValue".asComment());
            send(SendParameters{
                to: sender(),
                value: 0,
                mode: SendRemainingValue + SendIgnoreErrors,
                body: "increment".asComment()
            });
        } else {
            let mes: CounterValue = CounterValue{amount: 5};
            throw(mes.amount);
            // send(SendParameters{
            //     to: sender(),
            //     value: 0,
            //     mode: SendRemainingValue + SendIgnoreErrors,
            //     body: CounterValue{amount: 5}.toCell(),
            //     bounce: true
            // });
        }
    }
}
