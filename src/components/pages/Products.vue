<template>
    <div>
        <loading :active.sync="isLoading"/>
        <div class="text-right mt-4">
            <button class="btn btn-primary" @click.prevent="showModal(true)">建立新的商品</button>
        </div>
        <table class="table mt-4">
            <thead>
                <tr>
                    <th width="120">分類</th>
                    <th>產品名稱</th>
                    <th width="120">原價</th>
                    <th width="120">售價</th>
                    <th width="100">是否啟用</th>
                    <th width="90">編輯</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in products" :key="item.id">
                    <td>
                        {{ item.category }}
                    </td>
                    <td>
                        {{ item.title }}
                    </td>
                    <td class="text-right">
                        {{ item.origin_price | currency }}
                    </td>
                    <td class="text-right">
                        {{ item.price | currency }}
                    </td>
                    <td>
                        <span v-if="item.is_enabled" class="text-success">啟用</span>
                        <span v-else>未啟用</span>
                    </td>
                    <td>
                        <div class="row align-items-end">
                            <button class="btn btn-outline-primary btn-sm" @click.prevent="showModal(false, item)">編輯</button>
                            <button class="btn btn-outline-danger btn-sm" @click.prevent="deleteProduct(item)">刪除</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- 分頁 -->
        <Page :page-info="pagination" @changePage="getProducts" />
        <!-- Modal -->
        <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
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
            products: [],
            tempProduct: {},
            httpMethod: 'post',
            inNew: false,
            isDelete: false,
            isLoading: false,
            pagination: {},
        };
    },
    methods: {
        getProducts(page = 1) {
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.API}/products?page=${page}`;
            vm.isLoading = true;
            vm.$http.get(api).then((response) => {
                console.log(response.data);
                vm.isLoading = false;
                vm.products = response.data.products;
                vm.pagination = response.data.pagination;
            });
        },
        showModal(isNew, item) {
            $('#productModal').modal('show');
            const vm = this;
            if(isNew){
                vm.tempProduct = {};
                vm.isNew = true;
            }else{
                vm.tempProduct = Object.assign({}, item);
                vm.isNew = false;
            }
        },
        updateProducts() {
            const vm = this;
            let api = `${process.env.APIPATH}/api/${process.env.API}/admin/product`;

            if(vm.isDelete){
                api = `${process.env.APIPATH}/api/${process.env.API}/admin/product/${vm.tempProduct.id}`;
                console.log(api);
                vm.$http.delete(api).then((response) => {
                    console.log(response.data);
                    if(response.data.success){
                        vm.getProducts();
                    }else{
                        console.log('刪除失敗 : ' + response.data.message);
                        this.$bus.$emit('message:push', '刪除失敗 : ' + response.data.message, 'danger');
                    }
                    $('#delProductModal').modal('hide');
                });
            }else if(!vm.isNew){
                api = `${process.env.APIPATH}/api/${process.env.API}/admin/product/${vm.tempProduct.id}`;
                vm.httpMethod = 'put';
            }

            if(!vm.isDelete){
                vm.$http[vm.httpMethod](api, { data: vm.tempProduct }).then((response) => {
                    console.log(response.data);
                    if(response.data.success){
                        vm.getProducts();
                    }else{
                        if(vm.httpMethod === 'put'){
                            console.log('修改失敗 : ' + response.data.message);
                            this.$bus.$emit('message:push', '修改失敗 : ' + response.data.message, 'danger');
                        }else{
                            console.log('新增失敗 : ' + response.data.message);
                            this.$bus.$emit('message:push', '新增失敗 : ' + response.data.message, 'danger');
                        }
                    }
                    $('#productModal').modal('hide');
                });
            }
        },
        deleteProduct(item) {
            $('#delProductModal').modal('show');
            const vm = this;
            vm.tempProduct = Object.assign({}, item);
            console.log(vm.tempProduct);
        },
        uploadImg() {
            console.log(this);
            const uploadFile = this.$refs.files.files[0];
            const vm = this;
            const formData = new FormData();
            formData.append('file-to-upload', uploadFile);
            vm.isLoading = true;
            const url = `${process.env.APIPATH}/api/${process.env.API}/admin/upload`;
            vm.$http.post(url, formData, {
                headers: {
                    'Content-type': 'multipart/form-data',
                }
            }).then((response) => {
                vm.isLoading = false;
                console.log(response.data);
                if(response.data.success){
                    // vm.tempProduct.imageUrl = response.data.imageUrl;
                    vm.$set(vm.tempProduct, 'imageUrl', response.data.imageUrl);
                }else{
                    console.log('上傳失敗 : ' + response.data.message);
                    this.$bus.$emit('message:push', '上傳失敗 : ' + response.data.message, 'danger');
                }
            });
        },
    },
    created() {
        this.getProducts();
    },
}
</script>
