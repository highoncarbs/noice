new Vue({
    el: '#reports_master',
    data() {
        return {
            filter: {
                start_date: null,
                end_date: null,
                status: "",
                category: null,
                leader: null,
            },
            transactions: {
            },
            status_card_view: false,
            trans_id: null,
            progress_data_item: [],
            delete_modal: false,
            curr_index: null,
            viewUpload: false,
            fileSrc: "",
            data_product_category: [],
            data_team_leader: [],
            finished_product_category: "",
            team_leader: "",
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
        
            axios.get('/basic_master/get/product_category')
            .then(function (response) {
                self.data_product_category = response.data

            })
            .catch(function (error) {
                console.log(error)
                self.$buefy.snackbar.open({
                    duration: 4000,
                    message: 'Unable to fetch data for Product Category',
                    type: 'is-light',
                    position: 'is-top-right',
                    actionText: 'Close',
                    queue: true,
                    onAction: () => {
                        this.isActive = false;
                    }
                })
            })
        axios.get('/basic_master/get/leader')
            .then(function (response) {
                self.data_team_leader = response.data
            })
            .catch(function (error) {
                console.log(error)
                self.$buefy.snackbar.open({
                    duration: 4000,
                    message: 'Unable to fetch data for Team Leader',
                    type: 'is-light',
                    position: 'is-top-right',
                    actionText: 'Close',
                    queue: true,
                    onAction: () => {
                        this.isActive = false;
                    }
                })
            })
    },
    computed: {

        autocompleteProductCategory() {

            if (this.data_product_category.length != 0) {
                return this.data_product_category.filter((option) => {
                    return option.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.finished_product_category) >= 0
                })
            }
        },
        autocompleteTeamLeader() {

            if (this.data_team_leader.length != 0) {
                return this.data_team_leader.filter((option) => {
                    return option.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.team_leader) >= 0
                })
            }
        },
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
            if (this.filter.status) {
                return this.transactions.filter(item => {

                    if (item.flag == this.filter.status) {
                        return item
                    }
                }
                )
            }
            if (this.filter.leader) {
                return this.transactions.filter(item => {

                    if (item.basic[0].team_leader[0].name == this.filter.leader) {
                        return item
                    }
                }
                )
            }
            if (this.filter.category) {
                return this.transactions.filter(item => {

                    if (item.basic[0].finished_product_category[0].name == this.filter.category) {
                        return item
                    }
                }
                )
            }

            return data;

        }
    },
    methods: {
        getProductCategory(option) {
            if (option != null) {
                this.filter.category = option.name
                this.finished_product_category = option.name
            }
            else {
                this.filter.category = null
            }
        },

        getTeamLeader(option) {
            if (option != null) {
                this.filter.leader = option.name
                this.team_leader = option.name
            }
            else {
                this.filter.leader = null
            }
        },
        viewBig(id) {
            let self = this
            axios.get('/transaction/get/basic/files/one/' + String(id))
                .then(function (response) {
                    console.log(response.data)
                    self.fileSrc = self.getStatic(response.data)
                    if (self.fileSrc != null) {
                        self.viewUpload = !this.viewUpload
                    }
                })
        },
        getStatic(path) {
            if (path != "") {
                let fileSrc = String('\\static') + String(path).split('\static')[1]
                console.log('static ---' + fileSrc)
                return fileSrc
            }
            else {
                return null
            }
        },
        formatDate(data) {
            let date = String(data).split("-")
            return date[2] + '-' + date[1] + '-' + date[0]
        },
        getStatus(id, index) {
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
                            self.transactions.splice(self.curr_index, 1)
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