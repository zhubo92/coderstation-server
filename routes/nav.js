/**
 * 网址导航模块对应二级路由
 */

const express = require("express");
const router = express.Router();

// 引入业务层方法
const {
    addNavService,
    findNavByPageService,
    findNavTagByPageService,
    findNavByIdService,
    updateNavService,
    deleteNavService, findNavService, updateNavClickService, findNavSubTagByPageService,
} = require("../services/navService");

const { formatResponse } = require("../utils/tools");

/**
 * 根据分页获取网址导航
 */
router.get("/", async function (req, res) {
    const result = await findNavByPageService(req.query)
    res.send(formatResponse(0, "", result));
});

/**
 * 根据分页获取网址导航标签
 */
router.get("/tag", async function (req, res) {
    const result = await findNavTagByPageService(req.query)
    res.send(formatResponse(0, "", result));
});

/**
 * 根据分页获取网址导航二级标签
 */
router.get("/subTag", async function (req, res) {
    const result = await findNavSubTagByPageService(req.query)
    res.send(formatResponse(0, "", result));
});

/**
 * 网址导航列表（网站专用）
 */
router.get("/list", async function (req, res) {
    const result = await findNavService();
    res.send(formatResponse(0, "", result));
});

/**
 * 修改网址导航点击数（网站专用）
 */
router.patch("/click", async function (req, res) {
    const oldNav = await findNavByIdService(req.body._id);
    const result = await updateNavClickService(req.body._id, {
        ...oldNav,
        clickNumber: req.body.clickNumber,
    });
    res.send(formatResponse(0, "", result));
});

/**
 * 获取其中一个网址导航信息
 */
router.get("/:id", async function (req, res) {
    const result = await findNavByIdService(req.params.id);
    res.send(formatResponse(0, "", result));
});

/**
 * 新增网址导航
 */
router.post("/", async function (req, res, next) {
    const result = await addNavService(req.body);
    if (result && result._id) {
        res.send(formatResponse(0, "", result));
    } else {
        next(result);
    }
});

/**
 * 删除网址导航
 */
router.delete("/:id", async function (req, res) {
    console.log(req.params.id);
    const result = await deleteNavService(req.params.id);
    res.send(formatResponse(0, "", result));
});

/**
 * 修改网址导航
 */
router.patch("/:id", async function (req, res) {
    const result = await updateNavService(req.params.id, req.body);
    res.send(formatResponse(0, "", result));
});

module.exports = router;
