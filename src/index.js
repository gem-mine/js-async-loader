let $scriptjs = null
const loadPromiseMap = {}
const getRootVariable = detectionName =>
  detectionName.split('.').reduce((previousValue, currentValue) => previousValue && previousValue[currentValue], window)
const getCallBackFunName = detectionName => `_$_${detectionName.replace(/\./g, '')}_initialize_$_`

export default function scriptjsLoader (sdkUrl, detectionName, sdkUrlParams, callbackName) {
  if (!$scriptjs) {
    $scriptjs = require('scriptjs')
  }

  if (!sdkUrlParams) {
    sdkUrlParams = {}
  }
  if (!sdkUrl) {
    return Promise.resolve({})
  }
  const queryStringArray = []
  let sdkUrlNew = sdkUrl
  Object.keys(sdkUrlParams).forEach(key => {
    const value = sdkUrlParams[key]
    if (value !== undefined) {
      if (sdkUrlNew.indexOf(':' + key) !== -1) {
        sdkUrlNew = sdkUrlNew.replace(':' + key, value)
      } else {
        queryStringArray.push(key)
      }
    }
  })
  if (loadPromiseMap[sdkUrlNew]) {
    return loadPromiseMap[sdkUrlNew]
  }
  loadPromiseMap[sdkUrlNew] = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('js cannot be loaded outside browser env'))
      return
    }
    // 切换路由时
    if (detectionName && getRootVariable(detectionName)) {
      resolve(getRootVariable(detectionName))
      return
    }
    if (detectionName && callbackName) {
      if (typeof window[getCallBackFunName(detectionName)] !== 'undefined') {
        reject(new Error('js sdk initialization error'))
      }

      window[getCallBackFunName(detectionName)] = () => {
        window[getCallBackFunName(detectionName)] = undefined
        resolve(getRootVariable(detectionName))
      }

      if (process.env.NODE_ENV !== 'production') {
        if (Object.keys(sdkUrlParams).indexOf(callbackName) > -1) {
          console.error(`"${callbackName}" key in sdkUrlParams is not allowed`)
          throw new Error(`"${callbackName}" key in sdkUrlParams is not allowed`)
        }
      }
    }

    let queryString = queryStringArray.reduce(
      (previousValue, currentValue) => `${previousValue}&${currentValue}=${sdkUrlParams[currentValue]}`,
      ''
    )
    if (detectionName && callbackName) {
      queryString = `${callbackName}=${getCallBackFunName(detectionName)}${queryString}`
    }
    // scriptjs库保证js是加载并执行完成，不是通过变量检测
    $scriptjs(`${sdkUrlNew}${queryString ? '?' + queryString : ''}`, () => {
      if (detectionName && typeof getRootVariable(detectionName) === 'undefined') {
        reject(new Error('js sdk initialization error (not loaded)'))
      } else if (detectionName && !callbackName) {
        resolve(getRootVariable(detectionName))
      } else if (!callbackName) {
        resolve({})
      }
    })
  })

  return loadPromiseMap[sdkUrlNew]
}
