const TestModel = require("../models/TestSchema")
const mongoose = require("mongoose");


const testInsert = async (req, res) => {
  try {
    const {
      branchId,
      batchId,
      subject,
      chapterName,
      testDate,
      maxMarks,
      marks
    } = req.body;

    // normalize date (VERY IMPORTANT)
    const normalizedDate = new Date(testDate);
    normalizedDate.setHours(0, 0, 0, 0);

    // 1️⃣ Find test first
    let test = await TestModel.findOne({
      branchId,
      batchId,
      subject,
      testDate: normalizedDate
    });

    // 2️⃣ If test not found → create ONCE
    if (!test) {
      test = await TestModel.create({
        branchId,
        batchId,
        subject,
        chapterName,
        testDate: normalizedDate,
        maxMarks,
        marks: []
      });
    }

    // 3️⃣ Insert / Update marks (NO DUPLICATE STUDENT)
    const incomingMark = marks[0]; // one student at a time

    const studentIndex = test.marks.findIndex(
      m => m.userId === incomingMark.userId
    );

    if (studentIndex !== -1) {
      // update marks
      test.marks[studentIndex].obtainedMarks =
        incomingMark.obtainedMarks;
    } else {
      // insert marks
      test.marks.push(incomingMark);
    }

    await test.save();

    res.status(200).send({
      status: 1,
      message: "Marks saved successfully",
      test
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: 0,
      message: "Unable to save test marks"
    });
  }
};



const getTestsRecordForDropDown = async (req, res) => {
    try {
        let { batchId } = req.query
        const branchId = req.user.branchId
        if (!batchId || !branchId) {
            return res.status(400).send({
                status: 0,
                message: "BranchId and BatchId are required fields"

            })
        }
        let TestSubjectsDetails = await TestModel.find({
            batchId, branchId
        }).select("subject chapterName testDate")
        if (!TestSubjectsDetails) {
            return res.status(404).send({
                status: 0,
                message: "No test Records exists"
            })
        }
        res.status(200).send({
            status: 1,
            message: "records exists",
            TestSubjectsDetails
        })
    } catch (error) {
        return res.status(500).send({
            status: 0,
            message: "can not fetch record"
        })
    }
}


const viewTests = async (req, res) => {
    try {
        const { batchId, testId, studentId } = req.query;
        const branchId = req.user.branchId

        // Validate ObjectId
        if (!branchId || !batchId) {
            return res.status(400).json({
                message: "branchId and batchId are required",
            });
        }

        if (testId && !mongoose.Types.ObjectId.isValid(testId)) {
            return res.status(400).json({
                message: "Invalid testId",
            });
        }

        // ==========================
        // STUDENT-WISE VIEW
        // ==========================
        if (studentId) {
            let query = {
                branchId,
                batchId,
            };

            // Optional testId for student
            if (testId) {
                query._id = testId;
            }

            const tests = await TestModel.find(query).sort({ testDate: -1 });

            const studentTests = tests
                .map((test) => {
                    const studentMark = test.marks.find(
                        (m) => m.userId.toString() === studentId
                    );

                    if (!studentMark) return null;

                    return {
                        testId: test._id,
                        rollNo: studentMark.userId,
                        subject: test.subject,
                        chapterName: test.chapterName,
                        testDate: test.testDate,
                        studentName: studentMark.userName,
                        fatherName: studentMark.userF_name,
                        maxMarks: test.maxMarks,
                        obtainedMarks: studentMark.obtainedMarks,
                    };
                })
                .filter(Boolean);

            return res.status(200).json({
                success: true,
                type: "STUDENT_VIEW",
                count: studentTests.length,
                data: studentTests,
            });
        }

        // ==========================
        // ADMIN / TEACHER VIEW
        // ==========================
        if (!testId) {
            return res.status(400).json({
                message: "testId is required for admin/teacher view",
            });
        }

        const test = await TestModel.findOne({
            branchId,
            batchId,
            _id: testId,
        });

        if (!test) {
            return res.status(404).json({
                message: "Test not found",
            });
        }

        return res.status(200).json({
            success: true,
            type: "ADMIN_TEACHER_VIEW",
            data: test,
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error while fetching tests",
        });
    }
};
const updateTests = async (req, res) => {
    try {
        const { testId, marks } = req.body;

        // 1️⃣ Validate input
        if (!testId || !marks || !Array.isArray(marks)) {
            return res.status(400).json({ message: 'Invalid payload' });
        }

        // 2️⃣ Find the test
        const test = await TestModel.findById(testId);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // 3️⃣ Update marks
        const updatedMarks = test.marks.map((studentMark) => {
            const newMark = marks.find((m) => m.userId === studentMark.userId);
            if (newMark) {
                // Validate obtainedMarks
                const obtained = Number(newMark.obtainedMarks);
                if (isNaN(obtained) || obtained < 0 || obtained > test.maxMarks) {
                    throw new Error(`Invalid marks for student ${studentMark.userId}`);
                }
                return { ...studentMark._doc, obtainedMarks: obtained };
            }
            return studentMark;
        });

        test.marks = updatedMarks;

        // 4️⃣ Save
        const updatedTest = await test.save();

        res.status(200).json({ message: 'Test updated successfully', updatedTest });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update test', error: err.message });
    }
}

module.exports = { testInsert, getTestsRecordForDropDown, viewTests, updateTests }