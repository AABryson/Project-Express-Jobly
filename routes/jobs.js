// 'use strict'
const express = require('express');
const { UnauthorizedError } = require('../expressError');
//their code has ({ mergeParams: true })
const router = express.Router()
const Job = require('../models/jobs')
const { ensureAdmin } = require("../middleware/auth");




router.post('/', ensureAdmin, async function (req, res, next) {
    try {
//#their code passed an object with properties title, etc.
        // let title = req.body.title;
        // let salary = req.body.salary;
        // console.log(req.body.company_handle);
        // let equity = req.body.equity;
        // //foreign key;
        // let company_handle = req.body.companyHandle;
        console.log(req.body);
        let postJob = await Job.createJob(req.body);
        
//#their code has ({postjob}); i think that means there will be a key -postjob- and its value will be the object 'postjob'
        return res.status(201).json({postJob})
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

// router.get('/', async function(req, res, next) {
//     try {
//         let query = req.query;
//         let getSpecJob = await Job.getAllJobs(query);
//         return res.json(getSpecJob)
//     } catch(err) {
//         next(err)
//     }
// })

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

