const redis = require('redis');
//44.203.251.141 
//url: 'redis://alice:foobared@awesome.redis.server:6380'
const client = redis.createClient({
    url: 'redis://3.92.77.117:6379'
})
const client1 = redis.createClient({
    url: 'redis://52.90.37.25:6379'
})
const clientmeta =redis.createClient({
    url: 'redis://18.208.153.152:6379'
})
client.on('connect', () => {
    console.log('redis connected')
})
client1.on('connect', () => {
    console.log('redis2 connected')
})
clientmeta.on('connect',()=>{
    console.log('meta')
})
client.connect()
client1.connect()
clientmeta.connect()
const saveredis = (key, value, id) => {
    if (id < 450000) {
        return client.set(key, value)
    } else {
        return client1.set(key, value)
    }

}
const readredis = (key, id) => {
    if (id < 450000) {
        return client.get(key)
    } else {
        return client1.get(key)
    }
}
const getmeta =(id)=>{
    return clientmeta.get(id)
}
const setmeta=(key,value)=>{
    return clientmeta.set(key,value)
}


module.exports = {
    saveredis,
    readredis,
    getmeta,
    setmeta
}
