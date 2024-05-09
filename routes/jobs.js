// 'use strict'
const express = require('express');
const jsonschema = require('jsonschema')
const { BadRequestError } = require('../expressError');
//their code has ({ mergeParams: true })
const router = express.Router()
const Job = require('../models/job')
const { ensureAdmin } = require("../middleware/auth");
const jobNewSchema = require("../schemas/jobNew.json")
const jobUpdateSchema = require('../schemas/jobUpdate.json')




router.post('/', ensureAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, jobNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
    }
//#their code passed an object with properties title, etc.
        let title = req.body.title;
        console.log(title);
        let salary = req.body.salary;
        let equity = req.body.equity;
        //foreign key;
        let companyHandle = req.body.companyHandle;
        let result = await Job.createJob(title, salary, equity, companyHandle)
        // console.log(req.body);
        // let result = await Job.createJob(req.body);
        console.log(result);
        
//#their code has ({postjob}); i think that means there will be a key -postjob- and its value will be the object 'postjob'
        return res.json({result})
    } catch (err) {
//#remember to return
        return next(err)
    }
    
})

router.get('/', async function(req, res, next){
/**get all jobs that satisfy a certain condition, or just get all jobs */
    try {
        let title = req.query.title;
        let minSalary = req.query.minSalary;
        let hasEquity = req.hasEquity;
        let getJobs = await Job.getAllJobs(title, minSalary, hasEquity);
//#their code has ({getJobs})
        return res.json(getJobs)
    } catch(err) {
        return next(err)
    }
})


router.get('/:title', async function(req, res, next){
    try {
        let title = req.params.title;
        let jobFind = await Job.findJob(title)
        return res.json(jobFind)
    } catch(err) {
        return next(err)
    }
})

router.patch('/:id', ensureAdmin, async function(req, res, next){
    try {
        const validator = jsonschema.validate(req.body, jobUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        let id = req.params.id;
        // let data = req.body.data;
        let data = req.body
        let update = await Job.updateJob(id, data);
        return res.json(update)
    } catch(err) {
        return next(err)
    }
})

router.delete('/:title', async function(req, res, next){
    try {
        let title = req.params.title;
        await Job.deleteJob(title);
        return res.json({ deleted: title} )
    } catch(err) {
        return next(err)
    }
})



module.exports = router;

