<template>
  <div class="account-wrapper">
    <div class="clearfix">
      <el-button class="fr" type="primary" @click="handleAddRole">
        新增账号
      </el-button>
    </div>

    <el-table v-loading="loading" :data="accountList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="账号ID" width="160">
        <template slot-scope="scope">
          {{ scope.row.user_id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="账号" width="220">
        <template slot-scope="scope">
          {{ scope.row.account }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="昵称" width="220">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系方式" width="220">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.created_at }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" class="fr" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="getAccounts" />

    <el-dialog width="40%" :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'新增角色'">
      <el-form :model="acc" label-width="100px">
        <el-form-item label="账号：">
          <el-input v-model="acc.account" :disabled="dialogType==='edit'" style="width: 80%" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码：">
          <el-input v-model="acc.password" style="width: 80%" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="昵称：">
          <el-input v-model="acc.nickname" style="width: 80%" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="联系方式：">
          <el-input v-model="acc.mobile" style="width: 80%" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="角色：">
          <el-checkbox-group v-model="acc.role_id">
            <el-checkbox v-for="(item, index) in roleList" :key="index" :label="item.role_id">{{ item.role_name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getRoles, getAccounts, addAccounts, updateAccounts, deleteAccounts } from '@/api/role'
import Pagination from '@/components/Pagination'

const defaultRole = {
  account: '',
  password: '',
  nickname: '',
  mobile: '',
  role_id: []
}

export default {
  components: { Pagination },
  data() {
    return {
      query: {
        page: 1,
        limit: 20
      },
      loading: false,
      roleList: [],
      accountList: [],
      total: 0,
      acc: Object.assign({}, defaultRole),
      dialogVisible: false,
      dialogType: 'new'
    }
  },
  created() {
    this.getAccounts()
    this.getRoles()
  },
  methods: {
    getRoles() {
      getRoles().then(res => {
        if (res.code === 0) {
          this.roleList = res.data
        }
      })
    },
    getAccounts() {
      this.loading = true
      getAccounts(this.query).then(res => {
        this.loading = false
        if (res.code === 0) {
          this.accountList = res.data.list
          this.total = Number(res.data.total)
        }
      })
    },
    handleAddRole() {
      this.acc = Object.assign({}, defaultRole)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      const acc = deepClone(scope.row)
      acc.role_id = acc.role_id && String(acc.role_id).split(',') || []
      this.acc = acc
    },
    handleDelete({ $index, row }) {
      this.$confirm('确认删除该账号吗', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteAccounts({
            user_id: row.user_id
          }).then(res => {
            if (res.code === 0) {
              this.$message({
                message: '删除账号成功！',
                type: 'success'
              })
              this.getAccounts()
            }
          })
        })
        .catch(err => { console.error(err) })
    },
    confirm() {
      const isEdit = this.dialogType === 'edit'
      this.acc.role_id = this.acc.role_id.join(',')

      if (isEdit) {
        updateAccounts(this.acc).then(res => {
          if (res.code === 0) {
            this.getAccounts()
            this.$message({
              message: '编辑账号成功！',
              type: 'success'
            })
          }
        })
      } else {
        addAccounts(this.acc).then(res => {
          if (res.code === 0) {
            this.getAccounts()
            this.$message({
              message: '新增账号成功！',
              type: 'success'
            })
          }
        })
      }
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.account-wrapper {
  padding: 20px;
}
</style>

<style>
.account-wrapper .el-checkbox{
  width: 100px;
}
</style>
