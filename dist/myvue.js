(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MyVue = {}));
})(this, (function (exports) { 'use strict';

  /*
   * @Author: shuyan.lu shuyan.lu@lotuscars.com.cn
   * @Date: 2023-07-21 17:51:29
   * @LastEditors: shuyan.lu shuyan.lu@lotuscars.com.cn
   * @LastEditTime: 2023-07-24 14:17:06
   * @FilePath: /vue3_learn/vue3_active/lib/reactive.js
   * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
   */
  const bucket = new WeakMap();
  let currentEffect = null;
  //新增副作用函数的栈，其实就是一个数组
  let effectStack = [];

  function effect(fn) { //副作用函数
    const effectFun = ()=>{
      clearup(effectFun);
      currentEffect = effectFun; //这里的 currentEffect只是中间变量
        // 新增 编号001
        effectStack.push(currentEffect);
      fn();
      // currentEffect = null
      currentEffect = effectStack.pop();
    };
    //新增用来保存所有与该副作用函数关联的依赖集合
    effectFun.deps = [];
    effectFun();
  }
  //响应式的处理
  function reactive(target) {
    return new Proxy(target, {
      set:(target, prop, value)=>{
        console.log(target);
        console.log(target[prop]);
        target[prop] = value;
        trigger(target,prop);
        //这里的执行副作用函数就是一层层的往下取，然后去执行
      },
      get:(target,prop)=>{
        console.log(target,prop);
        //如果有副作用函数的时候，就要去收集副作用函数
        track(target,prop);
        return target[prop]
      }
    })
  }

  function trigger(target,prop){ //取出的方法
    let ps = bucket.get(target);
    if (!ps) return
    let effects = ps.get(prop);
    if(!effects)return 
    //这里创建一个新的set数组，相当于搞了一个effects副本就不会影响effects的删除和增加了
    const runEffects = new Set(effects);
    for(let fn of runEffects) fn();
  }

  function track(target,prop) { //收集的方法
    if (!currentEffect) {
      return
    }
   //如果有副作用函数的时候，就要去收集副作用函数
      let ps = bucket.get(target);
      console.log(ps);
      if (!ps) {
        ps = new Map();
        bucket.set(target,ps);
      }
      let effects = ps.get(prop);
      if (!effects) {
        effects = new Set();
        ps.set(prop,effects);
      }
      effects.add(currentEffect);
      currentEffect.deps.push(effects);
  }

  function clearup(effectFun) {
    effectFun.deps.forEach((dep) => dep.delete(effectFun));
    effectFun.deps.length = 0;
  }

  exports.effect = effect;
  exports.reactive = reactive;

}));
