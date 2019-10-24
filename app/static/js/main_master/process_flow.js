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
            },

            data_department: [],
            data_location: [],
            errors: false,
            data_error: false,
            view: true
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
        checkRow() {

            if (this.task.name && this.task.department && this.task.location && this.task.days) {
                this.errors = false
                return true
            }

        },
        checkData() {
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
            let payload = JSON.stringify({ 'name': this.process_flow_name, 'task_list': this.taskList })
            console.log(payload)
            axios.post('/main_master/add/process_flow', payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(function (response) {
                    if (response.data.success) {
                        raw.pushAndClearRow();
                        raw.process_flow_name = null
                        raw.taskList= []
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

        },
        removeRow(index) {
            this.taskList.splice(index, 1)
        }
    }
})