<template>
  <div class="app-container">
    <div class="clearfix">
      <el-button class="fr" type="primary" @click="handleAddRole">
        新增角色
      </el-button>
    </div>

    <el-table v-loading="loading" :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="角色ID" width="160">
        <template slot-scope="scope">
          {{ scope.row.role_id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.role_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            <span v-if="row.status === '1'">正常</span>
            <span v-if="row.status === '2'">停用</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.created_at }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="primary" size="small" @click="handleRoleEdit(scope)">编辑权限</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog width="40%" :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'新增角色'">
      <el-form :model="role" label-width="100px">
        <el-form-item label="角色名称：">
          <el-input v-model="role.role_name" style="width: 70%" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="状态：">
          <el-radio-group v-model="role.status">
            <el-radio-button :label="1">正常</el-radio-button>
            <el-radio-button :label="2">停用</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="Menus">
          <el-tree ref="tree" :check-strictly="checkStrictly" :data="routesData" :props="defaultProps" show-checkbox node-key="path" class="permission-tree" />
        </el-form-item> -->
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog width="40%" :visible.sync="dialogRoleVisible" title="编辑权限">
      <el-form label-width="100px">
        <el-form-item label="角色名称：">
          <el-input v-model="role.role_name" :disabled="true" style="width: 70%" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="状态：">
          <el-radio-group v-model="role.status" :disabled="true">
            <el-radio-button :label="1">正常</el-radio-button>
            <el-radio-button :label="2">停用</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单：">
          <el-tree ref="tree" :check-strictly="checkStrictly" :data="routesData" :props="defaultProps" show-checkbox node-key="id" class="permission-tree" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogRoleVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { getRoles, addRole, updateRole, updateRoleTree, deleteRole } from '@/api/role'
import { asyncRoutes } from '@/router/index'

const defaultRole = {
  role_name: '',
  status: 1
}

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        '0': 'info',
        '1': 'success',
        '2': 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      loading: false,
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogRoleVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    this.getRoutes()
    this.getRoles()
  },
  methods: {
    getRoutes() {
      // const res = await getRoutes()
      const routes = this.generateRoutes(asyncRoutes)
      this.routes = routes
    },
    getRoles() {
      this.loading = true
      getRoles().then(res => {
        this.loading = false
        if (res.code === 0) {
          this.rolesList = res.data
        }
      })
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          id: route.id || (route.meta && route.meta.id),
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title
        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      console.log(data)
      return data
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.role = deepClone(scope.row)
    },
    handleRoleEdit(scope) {
      this.dialogRoleVisible = true
      this.role = deepClone(scope.row)
      this.checkStrictly = true
      this.$nextTick(() => {
        let routeList = []
        try {
          routeList = this.role.permission.split(',')
        } catch (error) {
          console.log(error)
        }

        console.log(routeList)
        this.$refs.tree.setCheckedKeys(routeList)
        this.checkStrictly = false
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('确认删除该角色吗', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          deleteRole({
            role_id: row.role_id
          }).then(res => {
            if (res.code === 0) {
              this.getRoles()
              this.$message({
                message: '删除角色成功！',
                type: 'success'
              })
            }
          })
        })
        .catch(err => { console.error(err) })
    },
    confirm() {
      const isEdit = this.dialogType === 'edit'

      if (isEdit) {
        updateRole({
          role_id: this.role.role_id,
          status: this.role.status
        }).then(res => {
          if (res.code === 0) {
            this.getRoles()
            this.$message({
              message: '编辑角色成功！',
              type: 'success'
            })
          }
        })
      } else {
        addRole(this.role).then(res => {
          if (res.code === 0) {
            this.getRoles()
            this.$message({
              message: '新增角色成功！',
              type: 'success'
            })
          }
        })
      }
      this.dialogVisible = false
    },
    confirmRole() {
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      updateRoleTree({
        role_id: this.role.role_id,
        permission: checkedKeys.join(',')
      }).then(res => {
        if (res.code === 0) {
          this.$message({
            message: '编辑角色权限成功！',
            type: 'success'
          })
        }
        this.dialogRoleVisible = false
        this.getRoles()
      })
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
