<template>
    <div>
        <loading :active.sync="isLoading"/>
        <div class="row mt-4">
            <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
                <div class="card border-0 shadow-sm">
                    <div style="height: 150px; background-size: cover; background-position: center"
                        :style="{backgroundImage: `url(${item.imageUrl})`}">
                    </div>
                    <div class="card-body">
                        <span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
                        <h5 class="card-title">
                            <a href="#" class="text-dark">{{ item.title }}</a>
                        </h5>
                        <p class="card-text">{{ item.content }}</p>
                        <div class="d-flex justify-content-between align-items-baseline">
                            <div class="h4" v-if="!item.price">{{ item.origin_price }} 元</div>
                            <del class="h6" v-if="item.price">原價 {{ item.origin_price }} 元</del>
                            <div class="h4" v-if="item.price">現在只要 {{ item.price }} 元</div>
                        </div>
                    </div>
                    <div class="card-footer d-flex">
                        <button type="button" class="btn btn-outline-secondary btn-sm"
                            @click.prevent="getProduct(item.id)">
                            <i class="fas fa-spinner fa-spin" v-if="item.id === status.loadingItem_more"></i>
                            查看更多
                        </button>
                        <button type="button" class="btn btn-outline-danger btn-sm ml-auto"
                            @click.prevent="addToCart(item.id)">
                            <i class="fas fa-spinner fa-spin" v-if="item.id === status.loadingItem_ShoppingCart"></i>
                            加到購物車
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 購物車內容 -->
        <Cart :shopping-cart="cart" @deleteCart="deleteCart" @useCoupon="addCoupon" />
        <!-- 訂單送出 -->
        <div class="my-5 row justify-content-center">
            <form class="col-md-6" @submit.prevent="createOrder">
                <div class="form-group">
                    <label for="useremail">Email</label>
                    <input type="email" class="form-control" name="email" id="useremail"
                        v-model="form.user.email" v-validate="'required|email'"
                        placeholder="請輸入 Email">
                    <span class="text-danger" v-if="errors.has('email')">{{ errors.first('email') }}</span>
                </div>
            
                <div class="form-group">
                    <label for="username">收件人姓名</label>
                    <input type="text" class="form-control" name="name" id="username"
                        v-model="form.user.name" v-validate="'required'" placeholder="輸入姓名">
                    <span class="text-danger" v-if="errors.has('name')">{{ errors.first('name') }}</span>
                </div>
            
                <div class="form-group">
                    <label for="usertel">收件人電話</label>
                    <input type="tel" class="form-control" name="telephone" id="usertel"
                        v-model="form.user.tel" v-validate="'required'" placeholder="請輸入電話">
                    <span class="text-danger" v-if="errors.has('telephone')">{{ errors.first('telephone') }}</span>
                </div>
            
                <div class="form-group">
                    <label for="useraddress">收件人地址</label>
                    <input type="text" class="form-control" name="address" id="useraddress"
                     v-model="form.user.address"
                        v-validate="'required'" placeholder="請輸入地址">
                    <span class="text-danger" v-if="errors.has('address')">{{ errors.first('address') }}</span>
                </div>
            
                <div class="form-group">
                    <label for="comment">留言</label>
                    <textarea name="" id="comment" class="form-control" cols="30" rows="10"
                     v-model="form.message"></textarea>
                </div>
                <div class="text-right">
                    <button class="btn btn-danger">送出訂單</button>
                </div>
            </form>
        </div>
        <!-- Modal -->
        <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-md" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">{{ product.title }}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <img :src="product.imageUrl" class="img-fluid" alt="">
                        <blockquote class=blockquote mt-3>
                            <p class="mb-0">{{ product.content }}</p>
                            <footer class="blockquote-footer text-right">{{ product.description }}</footer>
                        </blockquote>
                        <div class="d-flex justify-content-between align-items-baseline">
                            <div class="h4" v-if="!product.price">{{ product.origin_price }} 元</div>
                            <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
                            <div class="h4" v-if="product.price">現在只要 {{ product.price }} 元</div>
                        </div>
                        <select name="" class="form-control mt-3" v-model="product.num">
                            <option :value="num" v-for="num in 10" :key="num">
                                選購 {{ num }} {{ product.unit }}
                            </option>
                        </select>
                    </div>
                    <div class="modal-footer">
                        <div class="text-muted text-nowrap mr-3" v-if="!product.price">
                            小計 <strong>{{ product.num * product.origin_price }}</strong> 元
                        </div>
                        <div class="text-muted text-nowrap mr-3" v-else>
                            小計 <strong>{{ product.num * product.price }}</strong> 元
                        </div>
                        <button type="button" class="btn btn-primary" 
                            @click.prevent="addToCart(product.id, product.num)">
                            <i class="fas fa-spinner fa-spin" v-if="product.id === status.loadingItem_ShoppingCart"></i>
                            加到購物車
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery';
import Cart from '../ShoppingCart';

export default {
  name: 'CustomerOrder',
  components: {
      Cart,
  },
  data() {
      return {
          products: [],
          product: {},
          cart: {},
          coupon_code: '',
          isLoading: false,
          status: {
              loadingItem_more: '',
              loadingItem_ShoppingCart: '',
          },
          form: {
              user: {
                name: '',
                email: '',
                tel: '',
                address: '',
            },
            message: '',
          },
      };
  },
  methods: {
      getAllProducts() {
          const vm = this;
          const api = `${process.env.APIPATH}/api/${process.env.API}/products/all`;
          vm.isLoading = true;
          vm.$http.get(api).then((response) => {
              console.log(response.data);
              vm.isLoading = false;
              vm.products = response.data.products;
          });
      },
      getProduct(id) {
          const vm = this;
          const api = `${process.env.APIPATH}/api/${process.env.API}/product/${id}`;
          vm.status.loadingItem_more = id;
          vm.$http.get(api).then((response) => {
              console.log(response.data);
              vm.product = response.data.product;
              $('#productModal').modal('show');
              vm.status.loadingItem_more = '';
          });
      },
      addToCart(id, qty = 1) {
          const vm = this;
          const api = `${process.env.APIPATH}/api/${process.env.API}/cart`;
          const cart = {
              product_id: id,
              qty,
          };
          vm.status.loadingItem_ShoppingCart = id;
          vm.$http.post(api, { data: cart }).then((response) => {
              console.log(response.data);
              vm.getCart();
              $('#productModal').modal('hide');
              vm.status.loadingItem_ShoppingCart = '';
          });
      },
      getCart() {
          const vm = this;
          const api = `${process.env.APIPATH}/api/${process.env.API}/cart`;
          vm.isLoading = true;
          vm.$http.get(api).then((response) => {
              console.log(response.data);
              vm.cart = response.data.data;
              vm.isLoading = false;
          });
      },
      deleteCart(id) {
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.API}/cart/${id}`;
            vm.isLoading = true;
            vm.$http.delete(api).then((response) => {
                console.log(response.data);
                vm.isLoading = false;
                vm.getCart();
            });
      },
      addCoupon(coupon_code) {
            const vm = this;
            vm.coupon_code = coupon_code;
            const api = `${process.env.APIPATH}/api/${process.env.API}/coupon`;
            const coupon = {
                code: vm.coupon_code,
            };
            console.log(api, coupon);
            vm.$http.post(api, { data: coupon }).then((response) => {
                if (response.data.success) {
                    console.log(response.data);
                    this.getCart();
                } else {
                    console.log(response.data.message);
                    this.$bus.$emit('message:push', '使用優惠券失敗 : ' + response.data.message, 'danger')
                }
            });
      },
      createOrder() {
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.API}/order`;
            const order = vm.form;
            this.$validator.validate().then((valid) => {
                if (valid) {
                    vm.$http.post(api, { data : order }).then((response) => {
                        console.log("訂單已建立", response);
                        vm.isLoading = false;
                        vm.$router.push(`/customer_order_check/${response.data.orderId}`);
                    });
                } else {
                    console.log('欄位不完整');
                }
            });
      },
  },
  created() {
      this.getAllProducts();
      this.getCart();
  },
};
</script>