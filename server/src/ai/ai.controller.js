const sql = require('mssql');

const { generateSQL } = require('./sqlGenerator');
const { validateSQL } = require('./sqlValidator');

const askAI = async (req, res) => {

    try {

        const { question } = req.body;

        if (!question) {
            return res.status(400).json({
                message: 'Question required'
            });
        }

        const generatedSQL =
            await generateSQL(question);

        validateSQL(generatedSQL);

        const result =
            await new sql.Request()
                .query(generatedSQL);

        res.json({
            question,
            sql: generatedSQL,
            data: result.recordset
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
};

module.exports = {
    askAI
};