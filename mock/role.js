export default [
  // user login
  {
    url: '/account/list',
    type: 'get',
    response: config => {
      return {
        code: 0,
        data: {
          list: [{
            user_id: 1,
            account: 'admin',
            nickname: 'admin',
            mobile: 12345678901,
            role_id: '1',
            created_at: '2020-01-01'
          }, {
            user_id: 2,
            account: 'cskf',
            nickname: '开发',
            role_id: '2',
            mobile: 12345678901,
            created_at: '2020-01-01'
          }, {
            user_id: 3,
            account: 'csyy',
            nickname: '运营',
            role_id: '3',
            mobile: 12345678901,
            created_at: '2020-01-01'
          }],
          total: 10
        }
      }
    }
  },

  // get user info
  {
    url: '/roles/roleperm',
    type: 'get',
    response: config => {
      return {
        code: 0,
        data: [{
          role_id: '1',
          role_name: '超级管理员',
          status: '1',
          permission: '1,2,3,4,5,6,7,8',
          created_at: '2020-01-01'
        }, {
          role_id: '2',
          role_name: '开发',
          status: '1',
          permission: '4,5,6',
          created_at: '2020-01-01'
        }, {
          role_id: '3',
          role_name: '运营',
          status: '1',
          permission: '7,8',
          created_at: '2020-01-01'
        }]
      }
    }
  },

  // user logout
  {
    url: '/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 0,
        data: 'success'
      }
    }
  }
]
