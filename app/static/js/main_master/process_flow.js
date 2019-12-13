new Vue({
    el: '#process_flow_master',
    data() {
        return {
            process_flow_name: null,
            taskList: [],
            query_department: '',
            query_location: '',
            task: {
                name: null,
                department: null,
                location: null,
                days: null,
                error: {}
            },

            data_department: [],
            data_location: [],
            errors: false,
            data_error: false,
            view: true,
            process_flow_list: []
        }

    },
    mounted() {
        let raw = this
        axios.get('/basic_master/get/department')
            .then(function (response) {
                raw.data_department = response.data
            })
            .catch(function (error) {
                console.log(error)
                raw.$buefy.snackbar.open({
                    duration: 4000,
                    message: 'Unable to fetch data for Department',
                    type: 'is-light',
                    position: 'is-top-right',
                    actionText: 'Close',
                    queue: true,
                    onAction: () => {
                        this.isActive = false;
                    }
                })
            })
        axios.get('/basic_master/get/location')
            .then(function (response) {
                raw.data_location = response.data
            })
            .catch(function (error) {
                console.log(error)
                raw.$buefy.snackbar.open({
                    duration: 4000,
                    message: 'Unable to fetch data for Location',
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

        autocompleteDepartment() {

            if (this.data_department.length != 0) {
                return this.data_department.filter((option) => {
                    return option.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.query_department.toLowerCase()) >= 0
                })
            }
        },
        autocompleteLocation() {

            if (this.data_location.length != 0) {
                return this.data_location.filter((option) => {
                    return option.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.query_location.toLowerCase()) >= 0
                })
            }
        },
    },
    delimiters: ['[[', ']]'],
    methods: {
        getLastRow() {
            let raw = this
            axios.get('/main_master/get/process_flow/last')
                .then(function (response) {
                    data = response.data
                    raw.process_flow_name = data.name
                    data.task_items.forEach(function (item) {
                        
                        raw.task.name = item.name
                        raw.task.days = item.days
                        raw.task.department = item.department[0]
                        raw.task.location = item.location[0]
                        raw.addRow()
                    })

                    // raw.formID.alt_name = data.alt_name

                    // raw.form.fabric_combination = data.fabric_combination[0].name
                    // raw.formID.fabric_combination = data.fabric_combination[0].id

                    // raw.form.print_technique = data.print_technique[0].name
                    // raw.formID.print_technique = data.print_technique[0].id

                    // raw.form.design_number = data.design_number[0].name
                    // raw.formID.design_number = data.design_number[0].id

                    // raw.form.uom = data.uom[0].name
                    // raw.formID.uom = data.uom[0].id
                   
                    // raw.form.size = data.size[0].name
                    // raw.formID.size = data.size[0].id

                    // raw.form.product_category = data.product_category[0].name
                    // raw.formID.product_category = Number(data.product_category[0].id)
                })
        },
        checkRow() {
            try {
                this.task.error = {}
                if (this.task.name && this.task.department && this.task.location && this.task.days) {
                    return true
                }
                if (!this.task.name) {
                    this.$set(this.task.error, 'name', true)
                }
                if (!this.task.department) {
                    this.$set(this.task.error, 'department', true)
                }
                if (!this.task.location) {
                    this.$set(this.task.error, 'location', true)
                }
                if (!this.task.days) {
                    this.$set(this.task.error, 'days', true)
                }
            }
            catch (error) {
                console.error(error)
            }


        },
        checkData() {
            this.data_error = false
            if (this.taskList.length != 0 && this.process_flow_name) {
                return true
            }

            this.data_error = true
        },
        pushAndClearRow() {
            this.$refs.name.focus()
            this.taskList.push(this.task)
            this.query_department = ''
            this.query_location = ''
            this.task = {
                name: null,
                department: null,
                location: null,
                days: null,
                error : {}
            }
            this.errors = false

        },
        addRow() {
            if (this.checkRow()) {
                this.pushAndClearRow();
            }
            else {
                this.errors = true
            }
        },
        submitData() {
            let raw = this

            if (this.checkData()) {
                let payload = JSON.stringify({ 'name': this.process_flow_name, 'task_list': this.taskList })
                axios.post('/main_master/add/process_flow', payload, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function (response) {
                        if (response.data.success) {
                            raw.pushAndClearRow();
                            raw.process_flow_name = null
                            raw.taskList = []
                            raw.$buefy.snackbar.open({
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

                        }
                        else {
                            raw.$buefy.snackbar.open({
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
                    })
            }
        },
        removeRow(index) {
            this.taskList.splice(index, 1)
        },
        showView() {
            this.data_error = false
            this.view = !this.view
            let raw = this
            axios.get('/main_master/get/process_flow')
                .then(function (response) {
                    raw.process_flow_list = response.data
                })
                .catch(function (error) {
                    console.log(error)
                    raw.$buefy.snackbar.open({
                        duration: 4000,
                        message: 'Unable to fetch Process Flow List',
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
        deleteData(data_id, index) {
            let raw = this
            let payload = { 'id': data_id }
            axios.post('/main_master/delete/process_flow', payload)
                .then(function (response) {
                    if (response.data.success) {
                        raw.process_flow_list.splice(index, 1)
                        raw.$buefy.snackbar.open({
                            duration: 4000,
                            message: 'Data deleted',
                            type: 'is-light',
                            position: 'is-top-right',
                            actionText: 'Close',
                            queue: true,
                            onAction: () => {
                                this.isActive = false;
                            }
                        })
                    }
                })

        }
    }
})