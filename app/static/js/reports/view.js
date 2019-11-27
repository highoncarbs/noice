new Vue({
    el: '#reports_master',
    data() {
        return {
            filter: {
                start_date: null,
                end_date: null,
                status: null,
                category: null,
                leader: null,
            },
            transactions: {
            },
            status_card_view: false,
            trans_id: null,
            progress_data_item: []
        }
    },
    delimiters: ['[[', ']]'],
    mounted() {
        let self = this
        axios.get('/transaction/get')
            .then(function (response) {
                if (response.data) {
                    self.transactions = JSON.parse(response.data)
                }
            })
    },
    computed: {
        filteredTransaction() {
            let data = {}
            if (this.filter.start_date) {
                data = this.transactions.filter(item => {
                    let temp_date = Date.parse(item.basic[0].start_date)

                    if (temp_date >= Date.parse(this.filter.start_date)) {
                        return item
                    }
                }
                )
            }
            if (this.filter.end_date) {
                return this.transactions.filter(item => {
                    let momDate = moment(item.basic[0].start_date, 'YYYY-MM-DD')
                    let end_date = momDate.add(Number(item.basic[0].days), 'days').format("YYYY-MM-DD")
                    console.log(Date.parse(end_date), Date.parse(this.filter.end_date))
                    if (Date.parse(end_date) <= Date.parse(this.filter.end_date)) {
                        return item
                    }
                }
                )
            }
            return this.transactions;

        }
    },
    methods: {
        formatDate(data) {
            let date = String(data).split("-")
            return date[2] + '-' + date[1] + '-' + date[0]
        },
        getStatus(id, index) {
            console.log(id, index)
            this.status_card_view = true
            this.trans_id = id
            this.progress_data_item = this.transactions[index].activity[0].task_items_act
        }
    }


})