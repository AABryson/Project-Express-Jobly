process.env.NODE_ENV === 'test'
const request = require('supertest');
const app = require('../app')
// const db = require('/..db.js')

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    // testjobIds,
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
        .send({ title : 'newJobTitle', salary : 100, equity : '0.2', company_handle : 'c1'})
        .set('authorization', `Bearer ${ u2Token }`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({ title : 'newJobtitle'})
    // expect(resp.body).toEqual({ id : expect.any(Number), title : 'newJobTitle', salary : 100, equity : '0.2', company_handle : 'c1'})
})

test('create new job but non admin', async function(){
    let resp = await request(app).post('/jobs')
    .send({ title : 'newJobTitle', salary : 100, equity : '0.2', company_handle : 'c1'})
    .set('authorization', `Bearer ${ u1Token }`);
    expect(resp.statusCode).toEqual(401)
    expect(resp.body).toEqual({ message : "Unauthorized" })
})

test('get all the jobs', async function(){
    let resp = await request(app).get('/jobs');
    expect(resp.body).toEqual([{ id : expect.any(Number), title: 'testJobTitle1', salaray : 100, equity : '0', company_handle : 'c1'}, { id : expect.any(Number), title: 'testJobTitle2', salaray : 0, equity : '0.5', company_handle : 'c2'}])
})

test('get particular job', async function(){
    let resp = await request(app).get('/jobs/:testJobTitle1')
    expect(resp.body).toEqual( {title: 'testJobTitle1', salaray : 100, equity : '0', company_handle : 'c1' })
})

test('update a job', async function(){
    let  data = {data : { title : 'newerJobTitle', salary : 200, equity : '0.5', company_handle : 'c1' }}
    let resp = await request(app).patch('/jobs/1')
    .send(data)
    .set('authorization', `Bearer ${ u2Token }`);
    expect(resp.body).toEqual({title : 'newerJobTitle', salary : 200, equity : '0.5', company_handle : 'c1' })
})

test('try to update as non admin', async function(){
    let data = {data : { title : 'newerJobTitle', salary : 200, equity : '0.5', company_handle : 'c1' }}
    let resp = await request(app).patch('/jobs/1')
    .send(req.body.data)
    .set('authorization', `Bearer ${ u1Token }`);
    expect(resp.statusCode).toEqual(401)
    expect(resp.body).toEqual({ message : "Unauthorized" })
})

test('delete a job', async function() {
    let resp = await request(app).delete(1);
    expect(resp.body).toEqual(1)

})


