const {
    findNavByPageDao,
    findNavByIdDao,
    addNavDao,
    deleteNavDao,
    updateNavDao,
} = require("../dao/navDao");
const { validate } = require("validate.js");
const { navRule } = require("./rules");
const { ValidationError } = require("../utils/errors");

/**
 * 按分页查询网址导航
 */
module.exports.findNavByPageService = async function (queryObj) {
    return await findNavByPageDao(queryObj);
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
    console.log(newNavInfo,'newNavInfo');
    // 首先进行同步的数据验证
    const validateResult = validate.validate(newNavInfo, navRule);
    if (!validateResult) { // 验证通过
        // 添加其他的信息
        // 点击数，默认为 0
        newNavInfo.clickNumber = 0;
        // 上架日期
        newNavInfo.createTime = new Date().getTime().toString();

        // 如果没有上传图片，则默认给一张图片
        if(!newNavInfo.navLogo){
            newNavInfo.navLogo = '/static/imgs/dribbble.png';
        }
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
