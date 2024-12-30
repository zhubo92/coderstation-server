// 引入模型
const navModel = require("../models/navModel");

/**
 * 分页查找网址导航
 */
module.exports.findNavByPageDao = async function (queryObj, navTag = "a") {
    const pageObj = {
        currentPage: Number(queryObj.current),
        eachPage: Number(queryObj.pageSize),
    };

    const queryCondition = { navTag };
    if(queryObj.navTitle){
        // 用户要按照网址导航标题进行搜索
        queryCondition.navTitle = new RegExp(queryObj.navTitle,"i");
    }
    pageObj.count = await navModel.countDocuments(queryCondition); // 数据总条数
    pageObj.totalPage = Math.ceil(pageObj.count / pageObj.eachPage); // 总页数
    pageObj.data = await navModel
        .find(queryCondition)
        .skip((pageObj.currentPage - 1) * pageObj.eachPage) // 设置跳过的数据条数
        .sort({ createTime: -1 })
        .limit(pageObj.eachPage); // 查询条数
    return pageObj;
};

module.exports.findNavDao = async function () {
    const result = await navModel.aggregate([
        {
            $addFields: {
                sortOrder: {
                    $switch: {
                        branches: [
                            { case: { $eq: ["$navTag", "h3"] }, then: 1 },
                            { case: { $eq: ["$navTag", "sub"] }, then: 2 },
                            { case: { $eq: ["$navTag", "a"] }, then: 3 }
                        ],
                        default: 4 // 默认值，未匹配到的放在最后
                    }
                }
            }
        },
        { $sort: { sortOrder: 1, createTime: -1 } },
    ]);

    return result;
}

/**
 * 根据 id 获取其中一个网址导航信息
 */
module.exports.findNavByIdDao = async function (id) {
    console.log(id, 'id')
    return navModel.findOne({
        _id: id,
    });
};

/**
 * 新增网址导航
 */
module.exports.addNavDao = async function (newNavInfo) {
    console.log(newNavInfo,'addNavDao');
    return await navModel.create(newNavInfo);
};

/**
 * 根据 id 删除网址导航
 */
module.exports.deleteNavDao = async function (id) {
    return navModel.deleteOne({
        _id: id,
    });
};

/**
 * 根据 id 修改网址导航
 */
module.exports.updateNavDao = async function (id, newInfo) {
    return navModel.updateOne({ _id: id }, newInfo);
};

