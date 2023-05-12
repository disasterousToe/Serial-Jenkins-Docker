const Serial = require("../models/SerialModel");
const Receipt = require("../models/ReceiptModel");

// @desc Get all serials
// @route GET /serials/all
// @access Private
const getAllSerials = async (req, res) => {
    // Get all serials from MongoDB
    const serials = await Serial.find().lean();

    // If no serials
    if (!serials?.length) {
        return res.status(400).json({ message: "No serials found" });
    }
    res.json(serials);
};

// @desc Get all serials
// @route GET /serials/detail?serialNo=${serialNo}
// @access Private
const getDetailsBySerialNo = async (req, res) => {
    try {
        const { serialNo } = req.query;

        const serial = await Serial.findOne({ serialNo });
        res.json(serial);
    } catch (error) {
        return res.status(400).json({ message: "Something wrong" });
    }
};

// @desc Get ALL count for all the credit 
// @route GET /serials/count?status=false
// @access Private
const getTotalRedeemedCount = async (req, res) => {
    try {
        const counts = await Serial.aggregate([
            {
                $match: {
                    serialStatus: req.query.status === 'true' ? true : false,
                },
            },
            {
                $count: "count",
            },
        ]);
        res.json(counts);
    } catch (error) {
        return res.status(400).json({ message: "Something wrong" });
    }
};

// @desc Get ALL count for each credit respectively (10, 30, 50, 100)
// @route GET /serials/totalGenerated
// @access Private
const getTotalGeneratedCount = async (req, res) => {
    try {
        const counts = await Serial.aggregate([
            {
                $group: {
                    _id: "$givenCredit",
                    count: { $sum: 1 },
                },
            },
        ]);
        res.json(counts);
    } catch (error) {
        return res.status(400).json({ message: "Something wrong" });
    }
};

// @desc Get count FOR REDEEMED SERIAL ONLY (10, 30, 50, 100)
// @route GET /serials/totalGenerated
// @access Private
const getRedeemedSerialCount = async (req, res) => {
    try {
        const counts = await Serial.aggregate([
            {
                $match: {
                    serialStatus: false,
                },
            },
            {
                $group: {
                    _id: "$givenCredit",
                    count: {
                        $sum: 1,
                    },
                },
            },
        ]);
        res.json(counts);
    } catch (error) {
        return res.status(400).json({ message: "Something wrong" });
    }
};

// @desc Get all serials
// @route GET /serials/status?serialStatus=${serialStatus}
// @access Private
const getSerialsByStatus = async (req, res) => {
    try {
        const { serialStatus } = req.query;
        const serials = await Serial.find({ serialStatus });
        res.json(serials);
    } catch (error) {
        return res.status(400).json({ message: "Something wrong" });
    }
};

// @desc Generate Serial(s)
// @route POST /serials
// @access Private
const generateSerials = async (req, res) => {
    try {
        const { givenCredit, amountToGenerate, remarkName } = req.body;

        if (!givenCredit || !amountToGenerate || !remarkName) {
            return res.status(400).json({ message: "All fields must be provided" });
        }

        let serials = [];

        // Generate additional serials
        for (let i = 0; i < amountToGenerate; i++) {
            serials.push(generateSerialNumber());
        }

        // Check for duplicates and replace them
        const anyDuplicate = await Serial.find({ serialNo: { $in: serials } });
        anyDuplicate.forEach(duplicate => {
            let newSerial = generateSerialNumber();
            while (serials.includes(newSerial) || anyDuplicate.map(d => d.serialNo).includes(newSerial)) {
                newSerial = generateSerialNumber();
            }
            serials.splice(serials.indexOf(duplicate.serialNo), 1, newSerial);
        });

        // Return only the requested number of unique serials
        serials = serials.slice(0, amountToGenerate);

        const serialDocs = [];
        for (let j = 0; j < serials.length; j++) {
            const serialDoc = new Serial({
                givenCredit,
                remarkName,
                serialNo: serials[j],
                redemptionAcc: "",
                serialStatus: true,
            });
            await serialDoc.save();
            serialDocs.push(serialDoc);
        }

        // Create a new receipt and push the serial IDs to the receipt
        const receipt = new Receipt({
            serialID: serialDocs.map((doc) => doc._id),
        });
        await receipt.save();

        return res.status(200).json({ serialDocs });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// FUNCTION
function generateSerialNumber() {
    let serial = "";
    const chars = "1234567890";

    for (let i = 0; i < 16; i++) {
        serial += chars[Math.floor(Math.random() * chars.length)];
    }
    return serial;
}

module.exports = {
    getAllSerials,
    getDetailsBySerialNo,
    getSerialsByStatus,
    generateSerials,
    getTotalRedeemedCount,
    getTotalGeneratedCount,
    getRedeemedSerialCount,
};
