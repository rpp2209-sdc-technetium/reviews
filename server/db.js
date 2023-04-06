const { Pool } = require('pg')

const pool = new Pool({
    host: 'ec2-3-86-189-63.compute-1.amazonaws.com',
    port: 5432,
    password: '12345',
    user: 'postgres',
    database: 'reviews',
    max: 1,
    idleTimeoutMillis: 1,
    allowExitOnIdle: true
})

const searchpid = (product_id, limit, order, offset = 0) => {
    return pool.connect()
        .then((client) => {
            return client.query(`select 
        reviews.id as review_id , rating, summary ,recommend, response, body, date, reviewer_name, helpfulness,
        reviews_photos.id as id,url
        from reviews left join reviews_photos 
        on reviews.id = reviews_photos.review_id 
        where reviews.product_id =${product_id} and reviews.reported =false ORDER BY ${order} desc,review_id desc limit ${limit} offset ${offset}`).then((val) => {
            console.log(val)
                client.release()
                if (!val.rows.length) {
                    return []
                } else {
                    let value = val.rows
                    const res = []
                    for (let i = 0; i < value.length; i++) {
                        const { review_id, rating, summary, response, body, recommend, date, reviewer_name, helpfulness, ...photos } = value[i]
                        const b = { review_id, rating, summary, response, body, date, recommend, reviewer_name, helpfulness, photos: [] }
                        if (i === 0 || review_id !== res[res.length - 1].review_id) {
                            res.push(b)
                            if (photos.id !== null) {
                                res[i].photos.push(
                                    photos
                                )
                            }
                        } else {
                            res[res.length - 1].photos.push(photos)
                        }
                    }
                    return res
                }
            })
        })

}
const searchmeta = (product_id) => {
    return pool.query(`select reviews.id as rid,rating, name,characteristics.id, value,recommend
    from reviews left join characteristic_reviews on reviews.id = characteristic_reviews.review_id
    left join characteristics on characteristic_reviews.characteristic_id = characteristics.id
    where reviews.product_id = ${product_id}`).then((res) => {
        let a = res.rows
        if (!a.length) {
            return []
        }
        const ans = {
            product_id: product_id,
            ratings: {
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                '5': 0
            },
            recommend: {
                'true': 0,
                'false': 0
            },
            characteristics: {}
        }
        for (let i = 0; i < a.length; i++) {
            ans.ratings[a[i].rating]++
            ans.recommend[a[i].recommend]++
            if (!ans.characteristics[a[i].name]) {
                ans.characteristics[a[i].name] = {
                    id: a[i].id,
                    value: a[i].value
                }
            } else {
                ans.characteristics[a[i].name].value += a[i].value
            }
        }
        let l = Object.keys(ans.characteristics).length
        ans.recommend.true /= l
        ans.recommend.false /= l
        let c = res.rows.length / l
        for (let a in ans.ratings) {
            ans.ratings[a] /= l
        }
        for (let a in ans.characteristics) {
            ans.characteristics[a].value /= c
        }
        return ans
    })

}
const insert = (product_id, rating, summary, body, recommend, name, email, photos, characteristics) => {

    async function insertdata() {
        const client = await pool.connect()
        try {
            await client.query('BEGIN')
            let a = await client.query(`insert into reviews(product_id,rating,recommend,reviewer_name,summary,body,reviewer_email)
            values($1,$2,$3,$4,$5,$6,$7) returning id`, [product_id, rating, recommend, name, summary, body, email])
            a = a.rows[0].id
            if (photos.length) {
                b = photos.reduce((acc, cur, ind) => {
                    if (ind !== photos.length - 1)
                        return acc + `(${a},'${cur}'),`
                    else {
                        return acc + `(${a},'${cur}')`
                    }
                }, '')
                await client.query(`insert into reviews_photos(review_id, url) values ${b}`)
            }
            let c = ''
            for (let x in characteristics) {
                c += `(${x},${a},${characteristics[x]}),`
            }
            c = c.slice(0, -1)
            await client.query(`insert into characteristic_reviews(characteristic_id,review_id, value) values ${c} returning *`)
            await client.query('COMMIT')
            client.release()
            return 'ok'
        } catch (e) {
            await client.query('ROLLBACK')
            console.error(e)
        } finally {

        }
    }
    return insertdata()
}

// insert(12, 3, 'hahahahfadsfa', 'hihihihi', false, 'ijiddj', 'daa@b.com', ['lo1l', 'lll', 'odfa'], { '1': 3, '2': 2, '3': 1, '4': 1, '5': 1 }).then((a)=>{
// console.log(a)
// })
const makehelp = (reveiw_id) => {

    return pool.query(`UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = ${reveiw_id} returning helpfulness`)
}

const report = (reveiw_id) => {
    return pool.query(`UPDATE reviews SET reported = true where id =${reveiw_id} returning reported`)
}
// makehelp(1).then((vl) => {
//     console.log(vl.rows)
// })

module.exports = {
    searchmeta, searchpid, insert, makehelp, report

}