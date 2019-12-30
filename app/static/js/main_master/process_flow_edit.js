new Vue({
    el: '#process_flow_master',
    data() {
        return {
            process_flow_name: null,
            taskList: [],
            pp_num: null,
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
        try {
            let path_array = window.location.pathname.split("/")
            let pp_num = path_array[path_array.length - 1]
            this.pp_num = pp_num
            console.log('pp_num - ' + pp_num)
            let self = this
            
            axios.get('/main_master/get/process_flow/' + String(pp_num))
                .then(function (response) {
                    console.log(response.data)
                    self.process_flow_name = response.data.name
                    
                    self.taskList = response.data.task_items
                    self.taskList.forEach(function (item) {
                        item.department = item.department[0] 
                        item.location = item.location[0] 
                    })
                })
        
        }
        catch (error) {

        }
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
        showAddData(val) {
            let self = this
            this.$buefy.dialog.prompt({
                message: `<b>Add Data</b> `,
                inputAttrs: {
                    placeholder: 'e.g. Data',
                    maxlength: 100,
                    value: this.name
                },
                confirmText: 'Add',
                onConfirm: (value) => {

                    let formdata = { 'name': value }
                    axios
                        .post('/basic_master/add/' + String(val), formdata)
                        .then(function (response) {
                            console.log(response.data)
                            if (response.data.success) {
                                switch (val) {
                                    case 'department':
                                        self.data_department.push(response.data.data)
                                        break;
                                    case 'location':
                                        self.data_location.push(response.data.data)
                                        break;
                                    default:
                                        break;
                                }
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

                            }
                            else {
                                if (response.data.message) {
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
                        .catch(function (error) {
                            console.log(error)
                        })

                }
            })
        },
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
                error: {}
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
                axios.post('/main_master/edit/process_flow/'+String(raw.pp_num), payload, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function (response) {
                        if (response.data.success) {
                            // raw.pushAndClearRow();
                            // raw.process_flow_name = null
                            // raw.taskList = []
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
            window.location.href="/main_master/process_flow"
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