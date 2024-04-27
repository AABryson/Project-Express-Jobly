const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


class Job {
//#################{}??
//#in solution have LEFT JOIN
    static async getAllJobs(){
        let result = await db.query(`SELECT * FROM jobs`);
        allJobs = result.rows
        return alljobs;
}
    

    static async getAllJobs(title, minSalary, hasEquity) {
        if(title || minSalary || hasEquity){
            let result = await db.query(`SELECT * FROM jobs WHERE title ILIKE '%' || $1 || '%'
            OR salary <= $2
            OR equity = $3`, [title, minSalary, hasEquity]);
            let allJobs = result.rows;
            return allJobs;

        } else {
            const allOfThem = await db.query(`SELECT * FROM jobs`)
            let results = allOfThem.rows;
            return results;
        } 
    }
//#their code used id
    static async findJob(title){
        let result = await db.query(`SELECT title, salary, equity, company_handle FROM jobs WHERE title = $1`, [title]);
        //#####################access rows object first
        let foundJob = result.rows[0]
        if(!foundJob) {
            throw new NotFoundError("There is no job with that title")
        }
        let results = await db.query(`SELECT handle, name, description, num_employees, logo_url FROM companies WHERE handle = $1`, [foundJob.company_handle])
        let companiesWithJob = results.rows
//#add noew property to company and assign above value
        foundJob.companies = companiesWithJob;
        return foundJob;
    }

    static async createJob(job) {
        //##################db.query
        // let companyHandle = await db.query(`SELECT company_handle FROM jobs WHERE company_handle = $1`, [company_handle])
        // if(companyHandle.rows.length === 0){
        //     throw new BadRequestError('The company handle could not be found')
        // }
        let result = await db.query(`INSERT INTO jobs (title, salary, equity, company_handle) VALUES ($1, $2, $3, $4) RETURNING id, title, salary, equity, company_handle AS "companyHandle"`, [job.title, job.salary, job.equity, job.companyHandle]);
        //#######just result.rows instead?
        let jobby = result.rows[0];
        return jobby
    }


    static async updateJob(id, data){
        const { setCols, values } = sqlForPartialUpdate(data, {});
        let idVarIdx = "$" + (values.length + 1);
        let result = await db.query(`UPDATE jobs SET ${setCols} WHERE id = ${idVarIdx} RETURNING title, salary, equity, company_handle`, [...values, id])
        //##########same: access rows object first
        let updatedJob = result.rows[0];
        if(!updatedJob) {
            throw new NotFoundError('Did not find job with that id')
        }
        return updatedJob
    }

    static async deleteJob(title){
        let result = await db.query(`DELETE FROM jobs WHERE title = $1 RETURNING title`, [title]);
        console.log('result', result.rows[0])
        let returnedTitle = result.rows[0];
        if(!returnedTitle){
            throw new NotFoundError('no job with that title');
        }
//#kept getting undefined for test; forgot return
        return returnedTitle
        
    }

}

module.exports = Job