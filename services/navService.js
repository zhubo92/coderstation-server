const {
    findNavByPageDao,
    findNavByIdDao,
    addNavDao,
    deleteNavDao,
    updateNavDao, findNavDao,
} = require("../dao/navDao");
const {validate} = require("validate.js");
const {navRule} = require("./rules");
const {ValidationError} = require("../utils/errors");
const mongoose = require("mongoose");

/**
 * 按分页查询网址导航
 */
module.exports.findNavByPageService = async function (queryObj) {
    return await findNavByPageDao(queryObj, "a");
};

/**
 * 按分页查询网址导航标签
 */
module.exports.findNavTagByPageService = async function (queryObj) {
    return await findNavByPageDao(queryObj, "h3");
};

/**
 * 按分页查询网址导航二级标签
 */
module.exports.findNavSubTagByPageService = async function (queryObj) {
    return await findNavByPageDao(queryObj, "sub");
};

/**
 * 根据 id 获取其中一个网址导航信息
 */
module.exports.findNavByIdService = async function (id) {
    return await findNavByIdDao(id);
};

/**
 * 新增网址导航
 */
module.exports.addNavService = async function (newNavInfo) {
    console.log(newNavInfo, 'addNavService');
    // 首先进行同步的数据验证
    const validateResult = validate.validate(newNavInfo, navRule);
    if (!validateResult) { // 验证通过
        // 添加其他的信息
        // 点击数，默认为 0
        newNavInfo.clickNumber = 0;
        // 上架日期
        newNavInfo.createTime = new Date().getTime().toString();

        // 如果没有上传图片，则默认给一张图片
        if (!newNavInfo.navLogo) {
            newNavInfo.navLogo = '/static/imgs/dribbble.png';
        }

        newNavInfo._id = new mongoose.Types.ObjectId().toString();
        return await addNavDao(newNavInfo);
    } else { // 数据验证失败
        return new ValidationError("数据验证失败");
    }
};

/**
 * 删除网址导航
 */
module.exports.deleteNavService = async function (id) {
    // 接下来再删除该网址导航
    return await deleteNavDao(id);
};

/**
 * 修改网址导航
 */
module.exports.updateNavService = async function (id, newInfo) {
    return await updateNavDao(id, newInfo);
};

/**
 * 修改网址导航
 */
module.exports.updateNavClickService = async function (id, newInfo) {
    return await updateNavDao(id, newInfo);
};

/**
 * 查询网址导航列表（网站专用）
 */
module.exports.findNavService = async function () {
    const list = await findNavDao();
    const idToNodeMap = new Map();
    const result = [];

    console.log(list.length, 'list');

    // 初始化所有节点为一个 Map
    list.map(item => {
        const {navTag, _id, navTitle, navType, navLink, navLogo, navDesc} = item;
        const web = {};
        if(navTag === "h3") {
            web.name = navTitle;
            web.icon = navLogo;
            web.children = [];
            web.web = [];
        } else if(navTag === "sub") {
            web.name = navTitle;
            web.web = [];
        } else {
            web.title = navTitle;
            web.logo = navLogo;
            web.desc = navDesc;
            web.url = navLink;
        }
        web.id = _id;
        web.type = navType;
        idToNodeMap.set(navTitle, web);
    });

    // 构建层级结构
    Array.from(idToNodeMap.values()).map(item => {
        if (!item.type) { // 如果没有父节点，说明是顶层节点
            result.push(idToNodeMap.get(item.name));
        } else { // 如果有父节点，加入对应父节点的 children 数组
            if(item.title) idToNodeMap.get(item.type).web.push(idToNodeMap.get(item.title));
            if(item.name) idToNodeMap.get(item.type).children.push(idToNodeMap.get(item.name));
        }
    });

    return result;
};
