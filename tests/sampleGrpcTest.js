import grpc from 'k6/net/grpc';
import { check, sleep } from 'k6';

export const options = {
    scenarios: {
        shared_iter_scenario: {
            executor: "shared-iterations",
            vus: 1,
            iterations: 1,
            startTime: "0s",
            maxDuration: '10m'
         }
    }
    ,
  throw: true
};
const serviceName = "CleanCoffeeMachine";
const client = new grpc.Client();
client.load(['../proto'], 'CoffeeMaker.proto');

export default () => {

  client.connect('localhost:50051', {
    plaintext: true,
  });

  const data = { "name":"Machine one", "cleanMode":"Deep"}

  const response = client.invoke('test.logic.CoffeeMaker.CoffeeShopService/' + serviceName, data);

    check(response, {
      'status is OK': (r) => r && r.status === grpc.StatusOK,
    });

    console.log(JSON.stringify(response.message));

    client.close();

};

