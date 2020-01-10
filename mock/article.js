import Mock from 'mockjs'

const List = []
const count = 100
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    book_id: '@increment',
    book_name: '@title(3, 5)',
    author: '@title(1, 1)',
    description: '@title(10, 15)',
    image_uri,
    reptileType: 1,
    type: 3,
    status: 1,
    bookStatus: 2,
    bookType: '其他小说',
    isJin: 2,
    updateTime: '@datetime'
  }))
}

export default [
  {
    url: '/book/list',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, page_size = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < page_size * page && index >= page_size * (page - 1))

      return {
        'code': 0,
        'msg': '获取成功',
        'data': {
          'total': mockList.length,
          'list': pageList
        }
      }
    }
  },

  {
    url: '/article/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 0,
            data: article
          }
        }
      }
    }
  },

  {
    url: '/article/pv',
    type: 'get',
    response: _ => {
      return {
        code: 0,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },

  {
    url: '/article/create',
    type: 'post',
    response: _ => {
      return {
        code: 0,
        data: 'success'
      }
    }
  },

  {
    url: '/article/update',
    type: 'post',
    response: _ => {
      return {
        code: 0,
        data: 'success'
      }
    }
  }
]

