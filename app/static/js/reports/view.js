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
            progress_data_item: [],
            delete_modal: false,
            curr_index: null
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
            let data = this.transactions
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

                    if (Date.parse(end_date) <= Date.parse(this.filter.end_date)) {
                        return item
                    }
                }
                )
            }
            console.log(data)
            return data;

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
        },
        setModal(index) {
            this.delete_modal = !this.delete_modal
            this.curr_index = index
        },
        deleteData() {
            let self = this
            let id = this.transactions[this.curr_index].id

            axios.post('/transaction/delete/' + String(id))
                .then(function (response) {
                    if (response.data.success) {
                        if (response.data.success) {
                            self.$buefy.snackbar.open({
                                duration: 4000,
                                message: response.data.success,
                                type: 'is-light',
                                position: 'is-top-right',
                                actionText: 'Close',
                                queue: true,
                                onAction: () => {
                                    this.isActive = false;
                                }
                            })

                            self.delete_modal = !self.delete_modal
                            self.curr_index = null
                            self.transactions.splice(self.curr_index , 1)
                        }
                        else {
                            self.$buefy.snackbar.open({
                                duration: 4000,
                                message: response.data.message,
                                type: 'is-light',
                                position: 'is-top-right',
                                actionText: 'Close',
                                queue: true,
                                onAction: () => {
                                    this.isActive = false;
                                }
                            })
                        }

                    }
                })
        }
    }


})