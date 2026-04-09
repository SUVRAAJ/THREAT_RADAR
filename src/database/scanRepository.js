const db= require('./db')

//writing a query for saving an entry into the database
function saveScan(target,type,report)
{
    const stmt= db.prepare(`INSERT INTO scans(target,type,finalScore,threatLevel,fullReport,scannedAt) VALUES (?,?,?,?,?,?)`)

    stmt.run(
        target,
        type,
        report.finalScore,
        report.threatLevel,
        JSON.stringify(report),
        report.scannedAt
    )
}

//writing a query for getting N amount of last scanshere by default it is 20
function getRecentScans(limit=20)
{
    const stmt= db.prepare(`SELECT id,target,type,finalScore,threatLevel,scannedAt FROM scans ORDER BY scannedAt DESC LIMIT ?`)
    return stmt.all(limit)
}

//writing a query for getting scans by hitting a particular target
function getScansByTarget(target)
{
    const stmt= db.prepare(`SELECT id,target,type,finalScore,threatLevel,scannedAt FROM scans WHERE target=? ORDER BY scannedAt DESC`)
    return stmt.all(target).map(row=>({
        ...row,
        fullReport: row.fullReport?JSON.parse(row.fullReport):null
    }))
}

module.exports={saveScan,getRecentScans,getScansByTarget}