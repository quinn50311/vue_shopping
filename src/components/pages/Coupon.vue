<template>
    <div>
        <loading :active.sync="isLoading"/>
        <div class="text-right mt-4">
            <button class="btn btn-primary" @click.prevent="showModal(true)">建立新的優惠券</button>
        </div>
        <table class="table mt-4">
            <thead>
                <tr>
                    <th>名稱</th>
                    <th width="150">扣除百分比</th>
                    <th width="150">到期日</th>
                    <th width="120">是否啟用</th>
                    <th width="100">編輯</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in coupons" :key="item.id">
                    <td>
                        {{ item.title }}
                    </td>
                    <td class="text-right">
                        {{ item.percent }}
                    </td>
                    <td class="text-right">
                        <!-- 將linux timestamp轉換成 yyyy/mm/dd -->
                        {{ new Date(item.due_date * 1000).getFullYear() }}{{ '/' + ('0' + (new Date(item.due_date * 1000).getMonth() + 1)).slice(-2) }}{{ '/' + ('0' + new Date(item.due_date * 1000).getDate()).slice(-2) }}
                    </td>
                    <td>
                        <span v-if="item.is_enabled" class="text-success">啟用</span>
                        <span v-else>未啟用</span>
                    </td>
                    <td>
                        <div class="row align-items-end">
                            <button class="btn btn-outline-primary btn-sm" @click.prevent="showModal(false, item)">編輯</button>
                            <button class="btn btn-outline-danger btn-sm" @click.prevent="deleteModal(item)">刪除</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- 分頁 -->
        <Page :page-info="pagination" @changePage="getCoupons" />
        <!-- Modal -->
        <div class="modal fade" id="couponModal" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-md" role="document">
                <div class="modal-content border-0">
                    <div class="modal-header bg-dark text-white">
                        <h5 class="modal-title" id="exampleModalLabel">
                            <span>新增優惠券</span>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-sm-12">
                                <div class="form-group">
                                    <label for="title">標題</label>
                                    <input type="text" v-model="tempCoupon.title" class="form-control"
                                        id="title" placeholder="請輸入標題">
                                </div>

                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="percent">百分比</label>
                                        <input type="text" v-model="tempCoupon.percent" class="form-control" 
                                            id="percent"  placeholder="請輸入百分比(%)">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="due_date">到期日</label>
                                        <input type="date" v-model="tempCoupon.due_date" class="form-control" 
                                            id="due_date" placeholder="請輸入到期日">
                                    </div>
                                </div>

                                <hr>
                                <div class="form-group">
                                    <label for="code">優惠碼</label>
                                    <input type="text" v-model="tempCoupon.code" class="form-control" 
                                        id="code" placeholder="請輸入優惠碼">
                                </div>

                                <div class="form-group">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox"
                                            id="is_enabled" 
                                             v-model="tempCoupon.is_enabled"
                                             :true-value="1"
                                             :false-value="0">
                                        <label class="form-check-label" for="is_enabled">
                                            是否啟用
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-primary" @click.prevent="updateCoupons">確認</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- delete Coupon Modal -->
        <div class="modal fade" id="delCouponModal" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content border-0">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title" id="exampleModalLabel">
                            <span>刪除優惠券</span>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        是否刪除 <strong class="text-danger">{{ tempCoupon.title }}</strong> 商品(刪除後將無法恢復)。
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-danger" @click.prevent="isDelete = true, updateCoupons()">
                            確認刪除</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery';
import Page from '../Page';

export default {
    components: {
        Page,
    },
    data() {
        return {
            coupons: [],
            tempCoupon: {},
            isNew: false,
            isDelete: false,
            isLoading: false,
            httpMethod: 'post',
            pagination: {},
        }
    },
    methods: {
        showModal(isNew, item) {
            $('#couponModal').modal('show');
            const vm = this;
            if (isNew) {
                vm.tempCoupon = {};
                vm.isNew = true;
            } else {
                vm.tempCoupon = Object.assign({}, item);
                //將linux timestamp轉換成 yyyy/mm/dd
                vm.tempCoupon.due_date = String(new Date(vm.tempCoupon.due_date * 1000).getFullYear()) + '-' +
                                            String(('0' + (new Date(vm.tempCoupon.due_date * 1000).getMonth() + 1)).slice(-2)) + '-' +
                                            String(('0' + new Date(vm.tempCoupon.due_date * 1000).getDate()).slice(-2));
                vm.isNew = false;
            }
        },
        deleteModal(item) {
            $('#delCouponModal').modal('show');
            const vm = this;
            vm.isDelete = true;
            vm.tempCoupon = Object.assign({}, item);
        },
        updateCoupons() {
            const vm = this;
            let api = `${process.env.APIPATH}/api/${process.env.API}/admin/coupon`;

            //刪除或編輯Coupon
            if (vm.isDelete) {
                api = `${process.env.APIPATH}/api/${process.env.API}/admin/coupon/${vm.tempCoupon.id}`;
                console.log(api);
                vm.$http.delete(api).then((response) => {
                    console.log(response.data);
                    if(response.data.success){
                        vm.getCoupons();
                    }else{
                        console.log('刪除失敗 : ' + response.data.message);
                        this.$bus.$emit('message:push', '刪除失敗 : ' + response.data.message, 'danger');
                    }
                    $('#delCouponModal').modal('hide');
                });
            } else if (!vm.isNew) {
                api = `${process.env.APIPATH}/api/${process.env.API}/admin/coupon/${vm.tempCoupon.id}`;
                vm.httpMethod = 'put';
            }
            if (!vm.isDelete) {
                vm.tempCoupon.due_date = new Date(vm.tempCoupon.due_date).getTime() / 1000;
                vm.$http[vm.httpMethod](api, { data: vm.tempCoupon }).then((response) => {
                    console.log(response.data);
                    if (response.data.success) {
                        vm.getCoupons();
                    } else {
                        if (vm.httpMethod === 'put') {
                            console.log('修改失敗 : ' + response.data.message);
                            this.$bus.$emit('message:push', '修改失敗 : ' + response.data.message, 'danger');
                        } else {
                            console.log('新增失敗 : ' + response.data.message);
                            this.$bus.$emit('message:push', '新增失敗 : ' + response.data.message, 'danger');
                        }
                    }
                    $('#couponModal').modal('hide');
                });
            }
        },
        getCoupons(page = 1) {
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.API}/admin/coupons?page=${page}`;
            vm.isLoading = true;
            vm.$http.get(api).then((response) => {
                console.log(response.data);
                vm.isLoading = false;
                vm.coupons = response.data.coupons;
                vm.pagination = response.data.pagination;
            });
        },
    },
    created() {
        this.getCoupons();
    }
}
</script>