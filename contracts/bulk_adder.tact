import "@stdlib/deploy";

message Reach {
    counter: Address;
    target: Int as uint32;
}

message CounterValue {
    amount: Int as uint32;
}

contract BulkAdder with Deployable {

    target: Int as uint32;

    init() {
        self.target = 0;    
    }

    // step 1
    receive(msg: Reach){
        // require(msg.target<=10, "target can't be more than 10");
        if(msg.target>10){
            throw(123);
        }
        self.target = msg.target; // 5
        send(SendParameters{
            to: msg.counter,
            value: 0,
            mode: SendRemainingValue + SendIgnoreErrors,
            body: "query".asComment()
        });
    }

    // step 3
    receive(msg: CounterValue){
        if(self.target>msg.amount){
            send(SendParameters{
                to: sender(),
                value: 0,
                mode: SendRemainingValue + SendIgnoreErrors,
                body: "increment".asComment()
            });
        }
    }
}
