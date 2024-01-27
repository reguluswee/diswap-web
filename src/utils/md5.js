import md5 from "js-md5";

/**
 * MD5 拼接串
 * @param {object}
 * @returns {string}
 */
export function sortString(obj) {
    // 按字母 a-z 排序
    const sortData = Object.keys(obj)
        .sort()
        .reduce((pre, cur) => {
            pre[cur] = obj[cur];
            return pre;
        }, {});
    const result = Object.keys(sortData)
        .reduce((pre, cur) => {
            pre.push(`${cur}=${sortData[cur]}`);
            return pre;
        }, [])
        .join("");
    return result;
}

/**
 * MD5 加密 + SHA512 加密 + 盐
 */
export function MD5SHA512(obj) {
    const resultString = sortString(obj) + "key=202cb962ac5907sdfdsdb07152d234b70";
    const enResultString = encodeURIComponent(resultString, "utf-8").replace(/'/g, "%27").replace('*', '%2A');
    // 解决 md5 中文编码问题
    const MD5string = md5(enResultString);
    // console.log(
    //   "resultString==>> ",
    //   enResultString,
    //   " ==md5==>> ",
    //   MD5string,
    // );
    return MD5string;
}

/**
 * querystring to obj
 * @param {string}
 * @return {obj}
 */
export function str2Obj(string) {
    if (!string) {
        return {};
    }
    let obj = {};
    let arr = string.split("&");
    arr.forEach((v) => {
        obj[v.split("=")[0]] = v.split("=")[1];
    });
    return obj;
}