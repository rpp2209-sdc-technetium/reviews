import http from 'k6/http';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

// A simple counter for http requests
export let options = {
    vus: 10,
  duration: "10s",
  rps: 100
}




export default function () {
    let randomId = randomIntBetween(1,100000)
    http.get(`http://localhost:5000/reviews?product_id=${randomId}`);

}
/*{
        product_id: 1,
        rating: 2,
        summary: 'wwff',
        body: 'great product',
        recommend: true,
        name: 'pop',
        email: 'a@c.com',
        photos: JSON.stringify(["ewfsfsafe", "efef", "lol"]),
        characteristics: JSON.stringify({ "1": 1, "2": 2, "3": 3, "4": 4 })
    }*/