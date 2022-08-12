// YaOJ 核心组件库
// 基于 Bootstrap
// core 的组件是独立的，可复用的，不依赖于外部组件。
// core 的组件的复用范围应该足够广，复用次数足够多，否则可以直接放在相应组件的文件夹中，没必要移植到 core
// core 组件的名称应符合 vue 的推荐命名方式，至少需要两个单词且不缩写

import TabView from './TabView.vue'
import TabPane from './TabPane.vue'

import DataTable from './DataTable'
import BaseTable from './BaseTable'

import BaseModal from './BaseModal'
import CardModal from './CardModal'

import VIcon from './VIcon.vue'

export {
    TabView,
    TabPane,
    DataTable,
    BaseTable,
    BaseModal,
    CardModal,
    VIcon,
}