const express = require("express");
const router = express.Router();

const { formatResponse } = require("../utils/tools");
const {findNavByIdDao} = require("../dao/navDao");
const navModel = require("../models/navModel");

router.get("/:id", async function (req, res) {
    const result = await navModel.findOne({
        _id: req.params.id,
    });
    console.log(req.params.id, 'result')
    res.send(formatResponse(0, "", result));
});

module.exports = router;
