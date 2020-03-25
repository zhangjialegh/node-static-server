#!/usr/bin/env node
const path = require('path')
const Koa = require('koa')
const static = require('koa-static')
const httpProxyMiddleware = require('http-proxy-middleware')
const koaConnect = require('koa2-connect')

const proxyPrefix = '--proxy'
const pathPrefix = '--dist'
const portPrefix = '--port'
const proxyTable = {}
let distName = 'dist'
let port = 5000

const app = new Koa()
const commander = process.argv.slice(2)

let distRoot = path.join(path.resolve(), distName)

// 判断是否有代理需求
if (commander.length) {
  if (commander.includes(portPrefix)) {
    const portIndex = commander.indexOf(portPrefix)
    if (commander[portIndex+1]) {
      port = commander[portIndex+1]
    }
  }
  if (commander.includes(proxyPrefix)) {
    const ids = []
    const distPath = commander.indexOf(pathPrefix)
    commander.forEach((item,index) => {
      if (item === proxyPrefix) {
        ids.push(index)
      }
    })

    if (distPath!==-1 && commander[distPath+1]) {
      distRoot = commander[distPath+1]
    }
    ids.forEach(i => {
      if (!!commander[i+1] && commander[i+1].includes('=')) {
        const proxyItem = commander[i+1].split('=')

        // 代理配置
        proxyTable[`/${proxyItem[0]}`] = {
          target: proxyItem[1],
          changeOrigin: true
        }
      }
    })
  } else {
    distRoot = commander[0]
  }
}


// 引入静态文件
app.use(static(distRoot))

// 代理兼容封装
const proxy = function (context, options) {
  if (typeof options === 'string') {
    options = {
      target: options
    }
  }
  return async function (ctx, next) {
    await koaConnect(httpProxyMiddleware(context, options))(ctx, next)
  }
}



Object.keys(proxyTable).map(context => {
  const options = proxyTable[context]
  // 使用代理
  app.use(proxy(context, options))
})

app.listen(port, () => console.log(`processing on port ${port}`))