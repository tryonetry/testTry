module.exports = {
    root: true,
    env: {
      node: true
    },
    'extends': [
      'plugin:vue/essential',
      'eslint:recommended'
    ],
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      "no-unused-vars":"off",   //关闭：不能有未声明的变量这个规则
    },
    parserOptions: {
      parser: 'babel-eslint'
    }
  }
  