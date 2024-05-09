const bcrypt = require("bcrypt");
const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");
//#looks like I didn't use this########################
const testJobIds = [];
async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM companies");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  //my addition
  await db.query("DELETE FROM jobs")

  await db.query(`
    INSERT INTO companies(handle, name, num_employees, description, logo_url)
    VALUES ('c1', 'C1', 1, 'Desc1', 'http://c1.img'),
           ('c2', 'C2', 2, 'Desc2', 'http://c2.img'),
           ('c3', 'C3', 3, 'Desc3', 'http://c3.img')`);

  await db.query(`
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email)
        VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com'),
               ('u2', $2, 'U2F', 'U2L', 'u2@email.com')
        RETURNING username`,
      [
        await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
      ]);
    
  // await db.query(`INSERT INTO jobs(id, title, salary, equity, company_handle) VALUES (1, 'testJobTitle1', 100, 0, 'c1'), (2, 'testJobTitle2', 0, 0.5, 'c2') RETURNING title`)
  
  //##################why did I include id?????????????????
  //I think I was trying to specify an id rather than allow for the auto specification
  let jobResults = await db.query(`INSERT INTO jobs(id, title, salary, equity, company_handle) VALUES (1, 'testJobTitle1', 100, 0, 'c1'), (2, 'testJobTitle2', 0, 0.5, 'c2') RETURNING title`)
  //theirs: 
  const resultsJobs = await db.query(`
    INSERT INTO jobs (title, salary, equity, company_handle)
    VALUES ('Job1', 100, '0.1', 'c1'),
          ('Job2', 200, '0.2', 'c1'),
          ('Job3', 300, '0', 'c1'),
          ('Job4', NULL, NULL, 'c1')
    RETURNING id`);
    testJobIds.splice(0, 0, ...resultsJobs.rows.map(r => r.
  id));
  
  // testJobIds.splice(0, 0, ...jobResults.rows.map(r => r.title));

//   const resultsJobs = await db.query(`
//     INSERT INTO jobs (title, salary, equity, company_handle)
//     VALUES ('testJobTitle1, 100, '0', 'c1'),
//           ('testJobTitle2', 0, '0.5', 'c2')
//     RETURNING id`);
// testJobIds.splice(0, 0, ...resultsJobs.rows.map(r => r.id));


// ###########################################
  await db.query(`INSERT INTO applications(username, job_id) VALUES ('u1', '1') RETURNING job_id`)
}
//theirs:
//await db.query(`
// INSERT INTO applications(username, job_id)
// VALUES ('u1', $1)`,
// [testJobIds[0]]);
async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

//#why didn't i call jobResults down here
module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds
};