const TestModel = require("../models/TestSchema");

// overall test performance report
let TestReport = async (req, res) => {
    try {
        let { StudentId } = req.params;
   
        const allTestsOfStudent = await TestModel.find({
            "marks.userId": {
                $regex: `^${StudentId}$`,
                $options: "i"
            }
        });

        if (!allTestsOfStudent.length) {
            return res.json([]);
        }

        const myMarks = allTestsOfStudent
            .map(test => {
                const testObj = test.toObject(); 

                return {
                    ...testObj,
                    marks: testObj.marks.filter(
                        m => m.userId.toLowerCase() === StudentId.toLowerCase()
                    )
                };
            })
            .filter(test => test.marks.length > 0);
        const marksObject = {
            userId: "",
            userName: "",
            scoring: {}
        };

        myMarks.forEach(test => {
            // user info
            marksObject.userId = test.marks[0].userId;
            marksObject.userName = test.marks[0].userName;

            const subject = test.subject;


            if (!marksObject.scoring[subject]) {
                marksObject.scoring[subject] = {
                    maxMarks: 0,
                    obtainedMarks: 0
                };
            }
            marksObject.scoring[subject].maxMarks += test.maxMarks;
            marksObject.scoring[subject].obtainedMarks += test.marks[0].obtainedMarks;
        });

        

        if (marksObject) {
            res.status(200).send({
                status: 1,
                performanceData: marksObject
            })
        }

        else {
            res.status(404).send({
                status: 0,
                message: "can not found summary"
            })
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { TestReport };
