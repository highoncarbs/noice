const ActivityForm = ({
    template: '#activity_form',
    data() {
        return {
            base_activity: '',
            baseActivityList: [],
            base_activity_list: [],
            activity_list: [],
            data_department: [],
            data_location: [],
            query_department: '',
            query_location: '',
            program_start_date: null,
            loader: false
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

        let raw = this
        if (localStorage.getItem('basic')) {

            if (localStorage.getItem('activity')) {
                
                let activitySaved = JSON.parse(localStorage.getItem('activity'))[1]
                raw.activity_list = activitySaved
                raw.base_activity = activitySaved['name']
            }

            let basicSaved = JSON.parse(localStorage.getItem('basic'))[0]
            this.program_start_date = moment(basicSaved.start_date, 'YYYY-MM-DD')

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
        }
        else {
            this.$buefy.snackbar.open({
                duration: 4000,
                message: 'Please add and save Basic Info first',
                type: 'is-light',
                position: 'is-top-right',
                actionText: 'Close',
                queue: true,
                onAction: () => {
                    this.isActive = false;
                }
            })
        }

    },
    methods: {

        getActivity(option) {
            if (option != null) {
                this.activity_list = option
                this.setUpDates()
            }
            else {
                this.activity_list = []
            }
        },
        addRow(index) {

            let newObj = {
                days: null,
                department: [],
                location: [],
                name: null,
                task_id: null

            }
            let temp_list = this.activity_list.task_items
            // this.$set(this.activity_list.task_items, index + 1, newObj)
            temp_list.splice(index + 1, 0, newObj)
            this.activity_list.task_items = temp_list
            // console.log(temp_list)
        },
        removeRow(index) {
            this.activity_list.task_items.splice(index, 1)
        },
        next() {
            try {
                if (this.activity_list.length != 0) {
                    this.loader = true

                    let selectedData = []
                    let self = this
                    console.log(this.activity_list)
                    axios.post('/transaction/add/activity', JSON.stringify(this.activity_list), {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(function (response) {
                            try {
                                if (response.data.success) {
                                    let selectedData = []
                                    selectedData.push({ 'activity_id': response.data.activity_id })
                                    selectedData.push(self.activity_list)
                                    localStorage.setItem('activity', JSON.stringify(selectedData))
                                    self.$router.push('/material')

                                }
                                this.loader = false

                            }
                            catch (error) {
                                this.loader = false

                                console.log('Error sending JSON data - activity list')
                            }
                        })

                }
            }
            catch (error) {
                this.loader = false

                console.log('Unable to save data - ' + String(error))
            }
        },
        previous() {
            try {
                if (this.activity_list.length != 0) {

                    localStorage.setItem('activity', JSON.stringify(this.activity_list))
                }
                this.$router.push('/basic')
            }
            catch (error) {
                console.log('Unable to save data - ' + String(error))
            }
        },
        setUpDates() {
            const program_date = moment(this.program_start_date, 'YYYY-MM-DD')
            index_list = []
            dependency_list = []
            this.activity_list.task_items.forEach(function (task, index) {
                index_list.push(index)
                if (task.depends != null) {
                    dependency_list.push(task.depends)
                }
                else {
                    dependency_list.push(null)
                }
            })

            console.log(index_list, dependency_list)
            let self = this
            // Date set up form index & dependency list
            this.activity_list.task_items.forEach(function (task, index) {
                if (dependency_list[index] == null || dependency_list[index] == "") {
                    task.start_date = moment(program_date).format("DD-MM-YYYY")
                    task.end_date = moment(program_date).add(Number(task.days), 'days').format("DD-MM-YYYY")

                }
                else {
                    let depends = dependency_list[index] - 1
                    if (depends in index_list) {
                        let previous_date = moment(self.activity_list.task_items[depends].end_date, 'DD-MM-YYYY')
                        task.start_date = previous_date.format("DD-MM-YYYY")
                        task.end_date = previous_date.add(Number(task.days), 'days').format("DD-MM-YYYY")
                    }

                }


                console.log(task.start_date, task.end_date)
            })


        },

    }
})