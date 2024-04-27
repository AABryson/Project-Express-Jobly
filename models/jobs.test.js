// "use strict"
// const { NotFoundError, BadRequestError } = require("../expressError");
process.env.NODE_ENV === 'test'
const db = require("../db.js");
const Job = require("./jobs.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testJobIds
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);



test('get all jobs from database', async function(){
    let allJobs = await Job.getAllJobs();
    expect(allJobs).toEqual([{ id: expect.any(Number), title: 'testJobTitle1', salary: 100, equity: '0', company_handle: 'c1'}, {id: expect.any(Number), title: 'testJobTitle2', salary: 0, equity: '0.5', company_handle: 'c2'}])
})

test('find job in database', async function(){
    let jobTitle = await Job.findJob('testJobTitle1');
    //need to rewrite to include salary, equity, company_handle
    expect(jobTitle).toEqual({ "companies" :
        [{"description": "Desc1",
        "handle": "c1",
        "logo_url": "http://c1.img",
        "name": "C1",
        "num_employees": 1,
        }],
        "company_handle": "c1",
        "equity": "0",
        "salary": 100,
        "title": "testJobTitle1"
        })
})

test('create a new job', async function(){
    let newJob = {
        title: 'philosopher',
        salary: 70000,
        equity: '0',
        companyHandle: 'c1'
    }
    let result = await Job.createJob(newJob)
    expect(result).toEqual({ title: 'philosopher', salary: 70000, equity: '0', id: expect.any(Number), companyHandle: 'c1'})
})

test("update job in database", async function () {
    let data = {
        title: 'NewJob',
        salary: 5,
        equity: '0'
    }
    let job = await Job.updateJob(1, data);
    expect(job).toEqual({
    //   id: 1,
      company_handle: "c1",
      ...data,
    });
  });



test('delete job from database', async function(){
    let delete_job = await Job.deleteJob('testJobTitle1')
    //#########################json
    console.log(delete_job)
    expect(delete_job).toEqual({ title: 'testJobTitle1'})
})





