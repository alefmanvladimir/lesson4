import "@stdlib/deploy";

message CounterValue {
    amount: Int as uint32;
}

contract Counter with Deployable {
    id: Int as uint32;
    counter: Int as uint32;
    flag: Bool;

    init(id: Int) {
        self.id = id;
        self.counter = 0;
        self.flag = false;
    }

    receive("increment") {
        self.counter = self.counter + 1;
        // emit("increment".asComment());
        self.reply(CounterValue{amount: self.counter}.toCell());
    }

    receive("query") {
        // emit("query".asComment());
        self.reply(CounterValue{amount: self.counter}.toCell());
    }

    bounced(src: Slice){
        self.flag = true;
    }

    get fun counter(): Int {
        return self.counter;
    }

    get fun id(): Int {
        return self.id;
    }

    get fun flag(): Bool {
        return self.flag;
    }
}
