// .vuepress/config.js
module.exports = {
  plugins: [['vuepress-plugin-code-copy', true]],
  title: 'Blog',
  description: 'Man Proposes, God Disposes!',
  markdown: {
    lineNumbers: true
  },
    head: [
        ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }]
      ],
    theme: 'reco',
    themeConfig: {
      // 备案
      record: '蜀ICP备2022007878号',
      recordLink: 'https://beian.miit.gov.cn/#/Integrated/index',
      cyberSecurityRecord: '公安部备案文案',
      cyberSecurityLink: 'http://www.beian.gov.cn/portal/index.do',
      // 项目开始时间，只填写年份
      startYear: '2022',
      valineConfig: {
        appId: 'fBnitjGHwpVBILFhDYEwOcky-gzGzoHsz',// your appId
        appKey: '9WusNbFFnF5rKk5SfYuizKAP', // your appKey
      },
      friendLink: [
        {
          title: 'vuepress-theme-reco',
          desc: 'A simple and beautiful vuepress Blog & Doc theme.',
          logo: "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
          link: 'https://vuepress-theme-reco.recoluan.com'
        },
        {
          title: '午后南杂',
          desc: 'Enjoy when you can, and endure when you must.',
          email: 'recoluan@qq.com',
          link: 'https://www.recoluan.com'
        },
        {
          title: 'TPL小组周报',
          desc: '基于Vue和SpringBoot开发的周报系统',
          logo: '/images/week.png',
          link: 'https://www.trilliontang.work/blogging/posts'
        },
        // ...
      ],
      logo: '/images/logo.png',
      author: '李同学',
      nav: require('./nav.js'),
      type: 'blog',
      authorAvatar: '/images/libai.jpg',
      subSidebar: 'auto',//在所有页面中启用自动生成子侧边栏，原 sidebar 仍然兼容
       // 博客配置
      blogConfig: {
        category: {
          location: 2,     // 在导航栏菜单中所占的位置，默认2
          text: 'Category' // 默认文案 “分类”
        },
        tag: {
          location: 3,     // 在导航栏菜单中所占的位置，默认3
          text: 'Tag'      // 默认文案 “标签”
        },
        socialLinks: [     // 信息栏展示社交信息
          { icon: 'reco-github', link: 'https://github.com/yhli394' },
          { icon: 'reco-npm', link: 'https://www.npmjs.com/~reco_luan' }
        ]
      }
    }
  }