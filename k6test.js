import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

// A simple counter for http requests
export let options = {
    vus: 2,
    duration: '1s',
}




export default function () {
    http.put('http://localhost:5000/reviews/9878/report');

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