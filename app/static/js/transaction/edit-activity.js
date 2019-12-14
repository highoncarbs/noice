const ActivityForm = ({
    template: '#activity_form',
    data() {
        return {
            pp_num: null,
            image: null,
            base_activity: '',
            baseActivityList: [],
            base_activity_list: [],
            activity_list: [],
            data_department: [],
            data_location: [],
            query_department: '',
            query_location: '',
            program_start_date: null,
            report: {
                date: null,
                status: null,
                finished_goods_code: null,
                quantity: null,
                report: null
            }

        }
    },
    delimiters: ['[[', ']]'],
    computed: {

        moment: function () {
            return moment();
        },
        autocompleteActivity() {
            if (this.base_activity_list.length != 0) {

                return this.base_activity_list.filter((option) => {
                    return option.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.base_activity.toLowerCase()) >= 0
                })
            }

        },
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

    mounted() {

        try {
            let path_array = window.location.pathname.split("/")
            let pp_num = path_array[path_array.length - 1]
            this.pp_num = pp_num
            let self = this
            axios.get('/transaction/get/basic/' + String(this.pp_num))
                .then(function (response) {
                    console.log(response.data)
                    payload = JSON.parse(response.data)[0]
                    console.log(payload.start_date)
                    self.program_start_date = moment(payload.start_date, 'YYYY-MM-DD')
                })

            axios.get('/transaction/get/activity/' + String(this.pp_num))
                .then(function (response) {
                    // console.log(response)
                    if (response.data) {
                        self.activity_list = JSON.parse(response.data)[0]
                        self.activity_list.task_items_act.forEach(function (item) {
                            if (item.depends_on == 0) {
                                item.depends_on = ""
                            }
                        })
                    }
                })
                .catch(function (error) {
                    console.log(error)
                    self.$buefy.snackbar.open({
                        duration: 4000,
                        message: "Unable to load data",
                        type: 'is-light',
                        position: 'is-top-right',
                        actionText: 'Close',
                        queue: true,
                        onAction: () => {
                            this.isActive = false;
                        }
                    })


                })

        }
        catch (error) {
            console.log("Unable to load data from Endpoint" + String(error))
        }

        let raw = this
        axios.get('/main_master/get/process_flow')
            .then(function (response) {
                raw.base_activity_list = response.data
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
    methods: {
        checkData(e) {
            console.log("In hereh")
            e.preventDefault();
            if (this.report.status && this.image && this.report.date && this.report.finished_goods_code) {

                return true;
            }
            else {
                console.log(this.report.status, this.image, this.report.date, this.report.finished_goods_code)

                return false;
            }
        },

        formatDate(data) {

            let date = String(data).split("-")
            return date[2] + '-' + date[1] + '-' + date[0]
        },
        removeRow(index) {
            this.activity_list.task_items_act.splice(index, 1)
        },
        update() {
            let self = this 
            axios.post('/transaction/update/activity/' + String(this.pp_num), this.activity_list)
                .then(function (response) {
                    if (response.data.success) {
                        self.$buefy.snackbar.open({
                            duration: 4000,
                            message: "Data updated",
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
                        self.$buefy.snackbar.open({
                            duration: 4000,
                            message: "Something went wrong",
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

        notRow(index) {
            let self = this
            console.log(index, this.activity_list)
            let item_id = this.activity_list.task_items_act[index]
            axios.post('/transaction/update/activity/item/not/' + String(item_id.id))
                .then(function (response) {
                    if (response.data.success) {

                        self.$buefy.snackbar.open({
                            duration: 4000,
                            message: "Activity updated",
                            type: 'is-light',
                            position: 'is-top-right',
                            actionText: 'Close',
                            queue: true,
                            onAction: () => {
                                this.isActive = false;
                            }
                        })

                        item_id.flag = "not"

                    }
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
                })

        },
        doneRow(index) {
            let self = this
            console.log(index, this.activity_list)
            let item_id = this.activity_list.task_items_act[index]
            axios.post('/transaction/update/activity/item/' + String(item_id.id))
                .then(function (response) {
                    if (response.data.success) {

                        self.$buefy.snackbar.open({
                            duration: 4000,
                            message: "Activity marked as <b>Done </b>!",
                            type: 'is-light',
                            position: 'is-top-right',
                            actionText: 'Close',
                            queue: true,
                            onAction: () => {
                                this.isActive = false;
                            }
                        })

                        item_id.flag = "done"

                    }
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
                })

        },
        addRow(index) {

            let newObj = {
                days: null,
                department: [],
                location: [],
                name: null,
                task_id: null

            }
            let temp_list = this.activity_list.task_items_act
            // this.$set(this.activity_list.task_items_act, index + 1, newObj)
            temp_list.splice(index + 1, 0, newObj)
            this.activity_list.task_items_act = temp_list
            // console.log(temp_list)
        },
        setUpDates() {
            const program_date = moment(this.program_start_date, 'YYYY-MM-DD')
            index_list = []
            dependency_list = []
            this.activity_list.tast_items_act.forEach(function (task, index) {
                index_list.push(index)
                if (task.depends != null) {
                    dependency_list.push(task.depends)
                }
                else {
                    dependency_list.push(null)
                }
            })

            console.log(index_list , dependency_list)
            let self = this
            // Date set up form index & dependency list
            this.activity_list.tast_items_act.forEach(function (task, index) {
                if (dependency_list[index] == null || dependency_list[index] == "") {
                    task.start_date = moment(program_date).format("DD-MM-YYYY")
                    task.end_date = moment(program_date).add(Number(task.days), 'days').format("DD-MM-YYYY")

                }
                else {
                    let depends = dependency_list[index]-1
                    if (depends in index_list) {
                        let previous_date = moment(self.activity_list.tast_items_act[depends].end_date , 'DD-MM-YYYY')
                        task.start_date = previous_date.format("DD-MM-YYYY")
                        task.end_date =  previous_date.add(Number(task.days) , 'days').format("DD-MM-YYYY")
                    }

                }

                
            console.log( task.start_date , task.end_date)
            })


        },
        setUpDates() {

            let self = this

            const program_date = this.program_start_date
            index_list = []
            dependency_list = []
            this.activity_list.task_items_act.forEach(function (task, index) {
                index_list.push(index)
                if (task.depends_on != null) {
                    dependency_list.push(task.depends_on)
                }
                else {
                    dependency_list.push(null)
                }
            })

            console.log(index_list, dependency_list)
            // Date set up form index & dependency list
            this.activity_list.task_items_act.forEach(function (task, index) {
                if (dependency_list[index] == null || dependency_list[index] == "") {
                    task.start_date = moment(program_date).format("DD-MM-YYYY")
                    task.end_date = moment(program_date).add(Number(task.days), 'days').format("DD-MM-YYYY")

                }
                else {
                    let depends = dependency_list[index] - 1
                    if (depends in index_list) {
                        let previous_date = moment(self.activity_list.task_items_act[depends].end_date, 'DD-MM-YYYY')
                        task.start_date = previous_date.format("DD-MM-YYYY")
                        task.end_date = previous_date.add(Number(task.days), 'days').format("DD-MM-YYYY")
                    }

                }


                console.log(task.start_date, task.end_date)
            })


        },

        getActivity(option) {
            if (option != null) {
                this.activity_list = option
                this.setUpDates()
            }
            else {
                this.activity_list = []
            }
        },
        previous() {
            try {

                this.$router.push('/view-activity')

            }
            catch (error) {
                console.log('Unable to save data - ' + String(error))
            }
        }


    }
})