const { verify } = require('jsonwebtoken');
const user = require("../models/user");

const authentication = (req,res,next) => {

    const accessToken = req.header("accessToken")
    if (!accessToken) return res.json({ message: "User not Loged In" })
    try {

        verify(accessToken, "secret", async (err, decode) => {
            if (err) {
                return res.status(400).json({ message: err.message })
            }
            const data = await user.findOne({ _id: decode.data })
            if (data) {
                req.user = data._id
                next()
            } else {
                res.json({ message: "failed" })
            }

        });


    } catch (err) {
        res.status(400).json({ message: err.message })
    }

}

module.exports = authentication