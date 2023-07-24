/*
 * @Author: shuyan.lu shuyan.lu@lotuscars.com.cn
 * @Date: 2023-07-21 18:07:27
 * @LastEditors: shuyan.lu shuyan.lu@lotuscars.com.cn
 * @LastEditTime: 2023-07-23 14:22:54
 * @FilePath: /vue3_learn/vue3_active/build.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const rollup = require("rollup");
const path = require("path");
const input = path.resolve(__dirname, "lib/reactive.js");
build()
async function build() {
  const inputOptions = {
    input,
  }
  bundle = await rollup.rollup(inputOptions)
  bundle.write({
    format: 'umd',
    file: 'dist/myvue.js',
    name: 'MyVue',
  })
}
