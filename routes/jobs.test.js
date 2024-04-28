process.env.NODE_ENV === 'test'
const request = require('supertest');
const app = require('../app')
// const db = require('/..db.js')

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testJobIds,
    u1Token,
    //#add u2Token with isAdmin = true?
    u2Token
    } = require("./_testCommon");
    
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


test('create new job', async function(){
    let resp = await request(app)
        .post('/jobs')
        .send({ id: 6, title : 'newJobTitle', salary : 100, equity : '0.2', company_handle : 'c1' })
        .set('authorization', `Bearer ${ u2Token }`);
        console.log(resp.body)
    expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({ postJob : { title : 'newJobTitle', salary : 100, equity : '0.2', company_handle : 'c1'}})
    // expect(resp.body).toEqual({ id : expect.any(Number), title : 'newJobTitle', salary : 100, equity : '0.2', company_handle : 'c1'})
})

test('create new job but non admin', async function(){
    let resp = await request(app).post('/jobs')
    .send({ title : 'newJobTitle', salary : 100, equity : '0.2', company_handle : 'c1'})
    .set('authorization', `Bearer ${ u1Token }`);
    expect(resp.statusCode).toEqual(401)
    expect(resp.body).toEqual({ error : {message : "Unauthorized", status : 401 }})
})

test('get all the jobs', async function(){
    let resp = await request(app).get('/jobs');
    expect(resp.body).toEqual([{ id : expect.any(Number), title: 'J1', salary : 1, equity : '0.1', company_handle : 'c1'}, { id : expect.any(Number), title: 'J2', salary : 2, equity : '0.2', company_handle : 'c1'}, {id : expect.any(Number), title: 'J3', salary : 3, equity : null, company_handle : 'c1'}])
})

test('get all jobs with particular title', async function(){
    let resp = await request(app).get('/jobs/?title=J1');
    console.log(resp.body);
    expect(resp.body).toEqual([{title: "J1", salary: 1, id: expect.any(Number), equity: "0.1", company_handle: "c1" }])
})

test('get particular job', async function(){
    let resp = await request(app).get('/jobs/J2')
    expect(resp.body).toEqual({"companies": [{
        "description": "Desc1",
        "handle": "c1",
        "logo_url": "http://c1.img",
        "name": "C1",
        "num_employees": 1,
        }], "company_handle": "c1",
        "equity": "0.2",
        "salary": 2,
        "title": "J2",
    })
})

test('update a job', async function(){
    let  data = { title : 'newerJobTitle', salary : 200, equity : '0.5', company_handle : 'c1' }
    let resp = await request(app).patch(`/jobs/${testJobIds[0]}`)
    .send(data)
    .set('authorization', `Bearer ${ u2Token }`);
    expect(resp.body).toEqual({ title : 'newerJobTitle', salary : 200, equity : '0.5', company_handle : 'c1' })
})


test('try to update as non admin', async function(){
    let data = {data : { title : 'newerJobTitle', salary : 200, equity : '0.5', company_handle : 'c1' }};
    let resp = await request(app).patch('/jobs')
    .send(data)
    .set('authorization', `Bearer ${ u1Token }`);
   
    expect(resp.body).toEqual({ error : {message : "Not Found", status : 404} })
})

test('delete a job', async function() {
    let resp = await request(app)
    .delete('/jobs/J2')
    .set('authorization', `Bearer ${ u2Token }`)
    expect(resp.body).toEqual({ deleted : 'J2' })

})


