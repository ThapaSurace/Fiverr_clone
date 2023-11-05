import Report from "../model/report.model.js"
import createError from "../utils/createError.js";

// post new report
export const postReport = async (req,res,next) => {
    const report = new Report({
        gigId: req.body.gigId,
        userId: req.userId,
        reportType: req.body.reportType,
        desc: req.body.desc
       }) 

    try {
      const savedReport = await report.save() 
      res.status(200).send(savedReport)
    } catch (err) {
        next(err)
    }
}

//get all reports
export const getReports = async (req,res,next) => {
    try {
        if(!req.isAdmin) return next(createError(404,"Only admin can see reports"))
        const reports = await Report.find()
        if(!reports) return next(createError(404,"Reports not found!"))
        res.status(200).send(reports)
    } catch (err) {
        next(err)
    }
}