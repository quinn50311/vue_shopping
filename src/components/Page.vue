<template>
    <div>
        <nav aria-label="Page navigatio" v-if="pageInfo">
            <ul class="pagination">
                <li class="page-item" :class="{'disabled' : pageInfo.has_pre === false }">
                    <a class="page-link" href="#" aria-label="Previous" @click.prevent="getProds(pageInfo.current_page - 1)">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <li class="page-item" v-for="page in pageInfo.total_pages" :key="page"
                        :class="{'active' : pageInfo.current_page === page}">
                    <a class="page-link" href="#" @click.prevent="getProds(page)">{{ page }}</a>
                </li>
                <li class="page-item" :class="{'disabled' : pageInfo.has_next === false }">
                    <a class="page-link" href="#" aria-label="Next" @click.prevent="getProds(pageInfo.current_page + 1)">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
export default {
    name: 'Pagination',
    props: ['pageInfo'],
    data() {
        return {};
    },
    methods: {
        getProds(page) {
            this.$emit('changePage', page);
        },
    },
};
</script>
