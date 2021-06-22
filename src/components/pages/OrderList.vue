<template>
    <div>
        <loading :active.sync="isLoading"/>
        <table class="table mt-4">
            <thead>
                <tr>
                    <th width="120">購買時間</th>
                    <th>Email</th>
                    <th width="300">購買款項</th>
                    <th width="120">應付金額</th>
                    <th width="100">是否付款</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in orders" :key="item.id">
                    <td>
                        <!-- 將linux timestamp轉換成 yyyy/mm/dd -->
                        {{ new Date(item.create_at * 1000).getFullYear() }}{{ '/' + ('0' + (new Date(item.create_at * 1000).getMonth() + 1)).slice(-2) }}{{ '/' + ('0' + new Date(item.create_at * 1000).getDate()).slice(-2) }}
                    </td>
                    <td>
                        {{ item.user.email }}
                    </td>
                    <td>
                        <span v-for="prod in item.products" :key="prod.id">
                            {{ prod.product.title }} 數量 : {{ prod.qty }} {{ prod.product.unit }}<br>
                        </span>
                    </td>
                    <td class="text-right">
                        <span >

                        </span>
                        {{ item.total | currency }}
                    </td>
                    <td>
                        <span v-if="item.is_paid" class="text-success">已付款</span>
                        <span v-else>尚未啟用</span>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- 分頁 -->
        <Page :page-info="pagination" @changePage="getOrders" />
        <!-- Modal -->
        <!-- <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content border-0">
                    <div class="modal-header bg-dark text-white">
                        <h5 class="modal-title" id="exampleModalLabel">
                            <span>新增產品</span>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-sm-4">
                                <div class="form-group">
                                    <label for="image">輸入圖片網址</label>
                                    <input type="text" v-model="tempProduct.imageUrl" class="form-control" 
                                        id="image" placeholder="請輸入圖片連結">
                                </div>
                                <div class="form-group">
                                    <label for="customFile">或 上傳圖片
                                        <i class="fas fa-spinner fa-spin" v-if="isLoading"></i>
                                    </label>
                                    <input type="file" id="customFile" class="form-control"
                                        ref="files" @change="uploadImg">
                                </div>
                                <img img="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80"
                                    class="img-fluid" :src="tempProduct.imageUrl" alt="">
                            </div>
                            <div class="col-sm-8">
                                <div class="form-group">
                                    <label for="title">標題</label>
                                    <input type="text" v-model="tempProduct.title" class="form-control"
                                        id="title" placeholder="請輸入標題">
                                </div>

                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="category">分類</label>
                                        <input type="text" v-model="tempProduct.category" class="form-control" 
                                            id="category"  placeholder="請輸入分類">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="price">單位</label>
                                        <input type="unit" v-model="tempProduct.unit" class="form-control" 
                                            id="unit" placeholder="請輸入單位">
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="origin_price">原價</label>
                                        <input type="number" v-model="tempProduct.origin_price" class="form-control" 
                                            id="origin_price" placeholder="請輸入原價">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="price">售價</label>
                                        <input type="number" v-model="tempProduct.price" class="form-control" 
                                            id="price" placeholder="請輸入售價">
                                    </div>
                                </div>
                                <hr>

                                <div class="form-group">
                                    <label for="description">產品描述</label>
                                    <textarea type="text" v-model="tempProduct.description" class="form-control" 
                                        id="description" placeholder="請輸入產品描述"></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="content">說明內容</label>
                                    <textarea type="text" v-model="tempProduct.content" class="form-control" 
                                        id="content" placeholder="請輸入產品說明內容"></textarea>
                                </div>
                                <div class="form-group">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox"
                                            id="is_enabled" 
                                             v-model="tempProduct.is_enabled"
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
                        <button type="button" class="btn btn-primary" @click.prevent="updateProducts">確認</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="delProductModal" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content border-0">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title" id="exampleModalLabel">
                            <span>刪除產品</span>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        是否刪除 <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-danger" @click.prevent="isDelete = true, updateProducts()">
                            確認刪除</button>
                    </div>
                </div>
            </div>
        </div> -->
    </div>
</template>

<script>
// import $ from 'jquery';
import Page from '../Page';

export default {
    components: {
        Page,
    },
    data() {
        return {
            orders: [],
            tempOrder: {},
            cart: [],
            httpMethod: 'post',
            isLoading: false,
            pagination: {},
        };
    },
    methods: {
        getOrders(page = 1) {
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.API}/admin/orders?page=${page}`;
            vm.isLoading = true;
            vm.$http.get(api).then((response) => {
                console.log(response.data);
                vm.isLoading = false;
                vm.orders = response.data.orders;
                vm.pagination = response.data.pagination;
                // vm.pagination = response.data.pagination;
            });
        },
    },
    created() {
        this.getOrders();
    },
}
</script>