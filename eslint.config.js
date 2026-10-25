import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import globals from 'globals'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,cjs,vue}'],
  },
  {
    name: 'app/ignores',
    ignores: ['**/dist/**', '**/dist-wrap/**', '**/dist-ssr/**', '**/*.local'],
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  skipFormatting,
  {
    name: 'app/language-options',
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    name: 'app/rules',
    rules: {
      // 项目历史代码大量使用 var 重复声明，非真实缺陷，关闭误报
      'no-redeclare': 'off',
    },
  },
]
