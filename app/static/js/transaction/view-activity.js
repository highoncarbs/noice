const ActivityForm = ({
    template: '#activity_form',
    data() {
        return {
            pp_num: null,
            activity_list: [],
            image: null,
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


    },

    mounted() {

        try {
            let path_array = window.location.pathname.split("/")
            let pp_num = path_array[path_array.length - 1]
            this.pp_num = pp_num
            let self = this
            axios.get('/transaction/get/activity/' + String(this.pp_num))
                .then(function (response) {
                    // console.log(response)
                    if (response.data) {
                        self.activity_list = JSON.parse(response.data)[0]
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
        saveReport() {
            print("EIn Here")
            if (this.report.status) {
                let self = this
                let formData = new FormData()
                formData.append('data', JSON.stringify(this.report))
                formData.append('image', this.image)
                axios.post('/transaction/update/' + String(this.pp_num), formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
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
            }
        },
        removeImage() {
            this.report.image = null
            this.$refs.imageUpload.removeImage();

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